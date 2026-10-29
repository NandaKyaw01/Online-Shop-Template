import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken, verifyToken, getCookieSecureOption } from "@/lib/security";
import { CurrentUser } from "@/types";

const USER_COOKIE = "hardware_user_session";

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(USER_COOKIE);
  if (!session?.value) return null;

  const verifiedUserId = verifyToken(session.value);
  if (!verifiedUserId) {
    return null;
  }

  return verifiedUserId;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        created_at: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to query user profile:", error);
    return null;
  }
}

export async function setUserSession(userId: string) {
  const cookieStore = await cookies();
  const signedSession = signToken(userId);
  const secure = await getCookieSecureOption();

  cookieStore.set(USER_COOKIE, signedSession, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE);
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    return await prisma.notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });
  } catch {
    return 0;
  }
}
