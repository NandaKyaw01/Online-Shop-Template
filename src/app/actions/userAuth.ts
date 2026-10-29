"use server";

import { prisma } from "@/lib/prisma";
import { setUserSession, clearUserSession, getCurrentUserId } from "@/lib/userAuth";
import { hashPassword, verifyPassword, sanitizeInput } from "@/lib/security";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResponse } from "@/types";

export async function loginUserAction(formData: FormData): Promise<ActionResponse> {
  const username = sanitizeInput(formData.get("username")).toLowerCase();
  const password = (formData.get("password") as string) || "";

  if (!username || !password) {
    return { success: false, error: "Please enter both username and password." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: "Invalid username or password." };
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return { success: false, error: "Invalid username or password." };
    }

    await setUserSession(user.id);
  } catch (error: any) {
    console.error("Login failed:", error);
    return { success: false, error: "Authentication failed. Please try again." };
  }

  redirect("/profile");
}

export async function registerUserAction(formData: FormData): Promise<ActionResponse> {
  const username = sanitizeInput(formData.get("username")).toLowerCase();
  const password = (formData.get("password") as string) || "";
  const name = sanitizeInput(formData.get("name"));
  const phone = sanitizeInput(formData.get("phone"));
  const address = sanitizeInput(formData.get("address"), 500);

  if (!username || !password) {
    return { success: false, error: "Username and password are required." };
  }

  if (username.length < 3) {
    return { success: false, error: "Username must be at least 3 characters." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return { success: false, error: "Username already taken. Please choose another." };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        password_hash: hashedPassword,
        name: name || username,
        phone,
        address,
        role: "USER",
        notifications: {
          create: {
            title: "Welcome to HARDWARE//CORE!",
            message: "Your account has been created. You can track your hardware orders and delivery status here.",
          },
        },
      },
    });

    await setUserSession(newUser.id);
  } catch (error: any) {
    console.error("Registration failed:", error);
    return { success: false, error: error.message || "Failed to create account." };
  }

  redirect("/profile");
}

export async function logoutUserAction() {
  await clearUserSession();
  redirect("/login");
}

export async function updateUserProfileAction(formData: FormData): Promise<ActionResponse> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const name = sanitizeInput(formData.get("name"));
  const phone = sanitizeInput(formData.get("phone"));
  const address = sanitizeInput(formData.get("address"), 500);

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Profile update failed:", error);
    return { success: false, error: "Failed to update profile information." };
  }
}

export async function markNotificationReadAction(notificationId: string): Promise<ActionResponse> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    await prisma.notification.updateMany({
      where: { id: notificationId, user_id: userId },
      data: { is_read: true },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to mark notification as read" };
  }
}
