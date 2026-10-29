"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/userAuth";
import { validateImageFile, sanitizeInput } from "@/lib/security";
import fs from "fs/promises";
import path from "path";
import { ActionResponse } from "@/types";
import { formatMMK } from "@/lib/currency";

export interface CreateOrderResult extends ActionResponse {
  orderId?: string;
}

export interface ValidateCartResult {
  validIds: string[];
  invalidIds: string[];
}

/**
 * Validates that product IDs in the cart actually exist in the database.
 * Used to automatically clean up orphaned cart items after database migrations or seeds.
 */
export async function validateCartItemsAction(productIds: string[]): Promise<ValidateCartResult> {
  if (!productIds || productIds.length === 0) {
    return { validIds: [], invalidIds: [] };
  }

  try {
    const existing = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    const validSet = new Set(existing.map((p) => p.id));
    return {
      validIds: productIds.filter((id) => validSet.has(id)),
      invalidIds: productIds.filter((id) => !validSet.has(id)),
    };
  } catch (err) {
    console.error("Cart validation error:", err);
    return { validIds: productIds, invalidIds: [] };
  }
}

export async function createOrderAction(formData: FormData): Promise<CreateOrderResult> {
  try {
    const customer_name = sanitizeInput(formData.get("customer_name"), 100);
    const phone = sanitizeInput(formData.get("phone"), 30);
    const address = sanitizeInput(formData.get("address"), 500);
    const cart_json = formData.get("cart_data") as string;
    const screenshot = formData.get("kpay_screenshot") as File;

    const currentUserId = await getCurrentUserId();

    if (!customer_name || !phone || !address) {
      return { success: false, error: "Please fill in all shipping details." };
    }

    // Validate screenshot with strict security checks
    const uploadValidation = validateImageFile(screenshot, 10 * 1024 * 1024);
    if (!uploadValidation.valid || !uploadValidation.safeFilename) {
      return {
        success: false,
        error: uploadValidation.error || "Please upload a valid payment slip screenshot (PNG, JPG, WebP).",
      };
    }

    let items: Array<{ id: string; quantity: number; price: number }> = [];
    try {
      items = JSON.parse(cart_json);
    } catch {
      return { success: false, error: "Invalid cart data." };
    }

    if (!items || items.length === 0) {
      return { success: false, error: "Your shopping cart is empty." };
    }

    // 1. Verify that all products exist in PostgreSQL database to prevent foreign key errors
    const productIds = Array.from(new Set(items.map((item) => item.id).filter(Boolean)));
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const missingItems = items.filter((item) => !productMap.has(item.id));
    if (missingItems.length > 0) {
      return {
        success: false,
        error: "Your cart contains outdated or unavailable products (possibly from an earlier database session). Please clear your cart and select currently available items.",
      };
    }

    // 2. Verify stock availability
    for (const item of items) {
      const dbProduct = productMap.get(item.id)!;
      const q = Math.max(1, Math.floor(Number(item.quantity) || 1));
      if (dbProduct.stock < q) {
        return {
          success: false,
          error: `Insufficient stock for "${dbProduct.title}". Only ${dbProduct.stock} units currently available.`,
        };
      }
    }

    // 3. Calculate verified total using authentic database prices
    const total_amount = items.reduce((sum, item) => {
      const dbProduct = productMap.get(item.id)!;
      const q = Math.max(1, Math.floor(Number(item.quantity) || 1));
      return sum + dbProduct.price * q;
    }, 0);

    // 4. Save screenshot safely to /public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeFilename = uploadValidation.safeFilename;
    const filePath = path.join(uploadsDir, safeFilename);

    const buffer = Buffer.from(await screenshot.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const kpay_screenshot_url = `/uploads/${safeFilename}`;

    // 5. Create Order & OrderItems and decrement stock inside an atomic transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          user_id: currentUserId || null,
          customer_name,
          phone,
          address,
          total_amount,
          kpay_screenshot_url,
          status: "PENDING",
          items: {
            create: items.map((item) => {
              const dbProduct = productMap.get(item.id)!;
              return {
                product_id: dbProduct.id,
                quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
                price: dbProduct.price,
              };
            }),
          },
        },
      });

      for (const item of items) {
        const q = Math.max(1, Math.floor(Number(item.quantity) || 1));
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: q } },
        });
      }

      return newOrder;
    });

    // If order was placed by an authenticated user, create a notification
    if (currentUserId) {
      await prisma.notification.create({
        data: {
          user_id: currentUserId,
          title: `Order #${order.id.slice(-6)} Placed`,
          message: `Your order for ${formatMMK(total_amount)} has been recorded and is currently PENDING manual KBZPay slip verification.`,
        },
      });
    }

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error: unknown) {
    console.error("Order creation failed:", error);
    let msg = "Failed to process order. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        msg = "One or more items in your cart are no longer available in the store database. Please clear your cart and add available items.";
      } else {
        msg = error.message;
      }
    }
    return {
      success: false,
      error: msg,
    };
  }
}
