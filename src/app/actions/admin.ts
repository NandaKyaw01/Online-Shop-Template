"use server";

import { prisma } from "@/lib/prisma";
import { setAdminSession, clearAdminSession, isAdminAuthenticated } from "@/lib/adminAuth";
import { verifyPassword, sanitizeInput } from "@/lib/security";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResponse } from "@/types";
import { formatMMK } from "@/lib/currency";

export async function adminLoginAction(formData: FormData): Promise<ActionResponse> {
  const username = sanitizeInput(formData.get("username")).toLowerCase();
  const password = (formData.get("password") as string) || "";

  // 1. Verify against database Admin user with bcrypt hash
  try {
    const adminUser = await prisma.user.findFirst({
      where: { username, role: "ADMIN" },
    });

    if (adminUser) {
      const isValid = await verifyPassword(password, adminUser.password_hash);
      if (isValid) {
        await setAdminSession();
        redirect("/admin/orders");
      }
    }
  } catch (err) {
    console.error("Database admin lookup error:", err);
  }

  // 2. Fallback against env configuration
  const validUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const validPassword = process.env.ADMIN_PASSWORD || "pass123";

  if (username === validUsername && password === validPassword) {
    await setAdminSession();
    redirect("/admin/orders");
  }

  return { success: false, error: "Invalid admin credentials." };
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function approvePaymentAction(orderId: string): Promise<ActionResponse> {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status === "APPROVED") {
        return;
      }

      // Update Order to APPROVED
      await tx.order.update({
        where: { id: orderId },
        data: { status: "APPROVED" },
      });

      // Decrement product stock for each item safely
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.product_id },
          data: {
            stock: {
              decrement: Math.max(1, item.quantity),
            },
          },
        });
      }

      // If order has an associated user, send approval notification
      if (order.user_id) {
        await tx.notification.create({
          data: {
            user_id: order.user_id,
            title: `Order #${order.id.slice(-6)} Payment Approved!`,
            message: `Your KBZPay payment of ${formatMMK(order.total_amount)} has been verified. Your hardware components are now being packed for dispatch.`,
          },
        });
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    revalidatePath("/profile");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to approve payment:", error);
    const msg = error instanceof Error ? error.message : "Failed to approve payment.";
    return { success: false, error: msg };
  }
}

export async function rejectPaymentAction(orderId: string): Promise<ActionResponse> {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "REJECTED" },
    });

    // If order has user, send rejection notification
    if (order.user_id) {
      await prisma.notification.create({
        data: {
          user_id: order.user_id,
          title: `Order #${order.id.slice(-6)} Payment Rejected`,
          message: `Your KBZPay payment screenshot could not be verified. Please verify your transaction ID or contact support with your transfer receipt.`,
        },
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    revalidatePath("/profile");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to reject payment:", error);
    const msg = error instanceof Error ? error.message : "Failed to reject payment.";
    return { success: false, error: msg };
  }
}
