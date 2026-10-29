"use server";

import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { validateImageFile, sanitizeInput } from "@/lib/security";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { Condition } from "@prisma/client";
import { ActionResponse, ProductItem } from "@/types";

export async function createProductAction(formData: FormData): Promise<ActionResponse<ProductItem>> {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    return { success: false, error: "Unauthorized access." };
  }

  const title = sanitizeInput(formData.get("title"), 150);
  const description = sanitizeInput(formData.get("description"), 2000);
  const price = parseFloat(formData.get("price") as string);
  const condition = formData.get("condition") as Condition;
  const stock = parseInt(formData.get("stock") as string, 10);
  const image_url_input = sanitizeInput(formData.get("image_url"), 255);
  const imageFile = formData.get("image_file") as File | null;

  if (!title || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
    return { success: false, error: "Please provide a valid title, positive price, and stock quantity." };
  }

  let final_image_url = image_url_input || "/images/products/xeon-e5-2680v2.svg";

  // If image file was uploaded, validate strictly
  if (imageFile && imageFile.size > 0) {
    const validation = validateImageFile(imageFile, 10 * 1024 * 1024);
    if (!validation.valid || !validation.safeFilename) {
      return { success: false, error: validation.error || "Invalid product image." };
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeFilename = validation.safeFilename;
    const filePath = path.join(uploadsDir, safeFilename);

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    final_image_url = `/uploads/products/${safeFilename}`;
  }

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description: description || "",
        price,
        condition: condition === "SECONDHAND" ? Condition.SECONDHAND : Condition.NEW,
        stock: Math.max(0, stock),
        image_url: final_image_url,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message || "Failed to create product." };
  }
}

export async function updateProductAction(productId: string, formData: FormData): Promise<ActionResponse> {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    return { success: false, error: "Unauthorized access." };
  }

  const title = sanitizeInput(formData.get("title"), 150);
  const description = sanitizeInput(formData.get("description"), 2000);
  const price = parseFloat(formData.get("price") as string);
  const condition = formData.get("condition") as Condition;
  const stock = parseInt(formData.get("stock") as string, 10);
  const image_url_input = sanitizeInput(formData.get("image_url"), 255);
  const imageFile = formData.get("image_file") as File | null;

  if (!title || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
    return { success: false, error: "Please provide a valid title, positive price, and stock quantity." };
  }

  const updateData: any = {
    title,
    description: description || "",
    price,
    condition: condition === "SECONDHAND" ? Condition.SECONDHAND : Condition.NEW,
    stock: Math.max(0, stock),
  };

  if (image_url_input) {
    updateData.image_url = image_url_input;
  }

  // If a new image file was uploaded
  if (imageFile && imageFile.size > 0) {
    const validation = validateImageFile(imageFile, 10 * 1024 * 1024);
    if (!validation.valid || !validation.safeFilename) {
      return { success: false, error: validation.error || "Invalid replacement image." };
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeFilename = validation.safeFilename;
    const filePath = path.join(uploadsDir, safeFilename);

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    updateData.image_url = `/uploads/products/${safeFilename}`;
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message || "Failed to update product." };
  }
}

export async function deleteProductAction(productId: string): Promise<ActionResponse> {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    await prisma.orderItem.deleteMany({
      where: { product_id: productId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { success: false, error: error.message || "Failed to delete product." };
  }
}
