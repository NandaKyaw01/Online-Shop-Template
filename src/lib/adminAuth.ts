import { cookies } from "next/headers";
import { signToken, verifyToken, getCookieSecureOption } from "@/lib/security";

const ADMIN_COOKIE = "hardware_admin_session";
const ADMIN_PAYLOAD = "admin_authenticated_session";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  if (!session?.value) return false;

  const payload = verifyToken(session.value);
  return payload === ADMIN_PAYLOAD;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const signedToken = signToken(ADMIN_PAYLOAD);
  const secure = await getCookieSecureOption();

  cookieStore.set(ADMIN_COOKIE, signedToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
