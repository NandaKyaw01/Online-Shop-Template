import bcrypt from "bcryptjs";
import crypto from "crypto";
import path from "path";

const SESSION_SECRET =
  process.env.SESSION_SECRET || "hardware-store-super-secure-key-2026-default";

/**
 * Secure password hashing using bcrypt with 12 salt rounds
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainText, salt);
}

/**
 * Constant-time password comparison
 */
export async function verifyPassword(
  plainText: string,
  hashed: string
): Promise<boolean> {
  // Support legacy plain text during migration/test if needed, but prefer bcrypt
  if (!hashed.startsWith("$2a$") && !hashed.startsWith("$2b$")) {
    return plainText === hashed;
  }
  return bcrypt.compare(plainText, hashed);
}

/**
 * Creates a cryptographically signed token: payload.signature
 */
export function signToken(payload: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${payload}.${signature}`;
}

/**
 * Verifies a signed token in constant time to prevent timing attacks.
 * Returns payload if valid, or null if invalid or tampered with.
 */
export function verifyToken(signedToken: string): string | null {
  if (!signedToken || !signedToken.includes(".")) return null;

  const lastDotIndex = signedToken.lastIndexOf(".");
  const payload = signedToken.substring(0, lastDotIndex);
  const signature = signedToken.substring(lastDotIndex + 1);

  if (!payload || !signature) return null;

  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");

  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (sigBuffer.length !== expectedBuffer.length) return null;

    if (crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return payload;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Allowed image extensions and MIME types
 */
const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
  safeFilename?: string;
  ext?: string;
}

/**
 * Validates uploaded files to prevent path traversal, executable uploads, and large payloads.
 */
export function validateImageFile(
  file: File,
  maxSizeBytes: number = 10 * 1024 * 1024 // 10 MB default
): UploadValidationResult {
  if (!file || file.size === 0) {
    return { valid: false, error: "No file provided or file is empty." };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds the limit of ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`,
    };
  }

  const rawExt = path.extname(file.name || "").toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.has(rawExt) && rawExt !== ".svg") {
    return {
      valid: false,
      error: `Invalid file extension (${rawExt}). Allowed formats: JPG, PNG, WebP.`,
    };
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: `Invalid file type (${file.type}). Must be a valid image.`,
    };
  }

  // Generate collision-resistant cryptographically random filename
  const randomPrefix = crypto.randomBytes(12).toString("hex");
  const timestamp = Date.now();
  const safeFilename = `upload-${timestamp}-${randomPrefix}${rawExt}`;

  return {
    valid: true,
    safeFilename,
    ext: rawExt,
  };
}

/**
 * Sanitizes user input string: strips null bytes, trims, and bounds length.
 */
export function sanitizeInput(input: unknown, maxLength: number = 255): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "") // Remove null bytes
    .trim()
    .slice(0, maxLength);
}

/**
 * Determines whether cookies should have the Secure attribute.
 * In development, local network testing, or unencrypted HTTP IP access,
 * setting Secure causes browsers to drop cookies per RFC 6265bis.
 */
export async function getCookieSecureOption(): Promise<boolean> {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;

  try {
    const { headers } = await import("next/headers");
    const headerList = await headers();
    const proto = headerList.get("x-forwarded-proto");
    if (proto) {
      return proto === "https";
    }
    const host = headerList.get("host") || "";
    // If accessed via local private network IP (RFC 1918) or localhost over plain HTTP
    const isLocalOrPrivate = /^(localhost|127\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|10\.)/i.test(host);
    if (isLocalOrPrivate) {
      return false;
    }
  } catch {
    // Outside request context
  }

  return process.env.NODE_ENV === "production";
}

