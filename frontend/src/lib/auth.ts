import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE = "fiz-session";
const SESSION_SECRET = process.env.APP_PASSWORD;

// Ensure secret is configured
if (!SESSION_SECRET && process.env.NODE_ENV === "production") {
  console.error("CRITICAL: APP_PASSWORD not configured!");
}

/**
 * Generate cryptographically secure token with HMAC-SHA256 signature
 */
function generateToken(): string {
  // Use crypto.randomBytes instead of Math.random
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(16).toString("hex");
  const data = `${timestamp}.${random}`;

  // HMAC-SHA256 signature
  const hmac = crypto.createHmac("sha256", SESSION_SECRET || "dev-secret");
  hmac.update(data);
  const signature = hmac.digest("base64url").substring(0, 32);

  return `${data}.${signature}`;
}

/**
 * Verify token signature using constant-time comparison
 */
function verifyToken(token: string): boolean {
  if (!token || !SESSION_SECRET) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [timestamp, random, signature] = parts;
  const data = `${timestamp}.${random}`;

  // Recreate expected signature
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(data);
  const expectedSignature = hmac.digest("base64url").substring(0, 32);

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Set session cookie (call from /api/auth on successful login)
 */
export function createSessionResponse(response: NextResponse): NextResponse {
  const token = generateToken();

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

/**
 * Clear session cookie (for logout)
 */
export function clearSessionResponse(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

/**
 * Check if request is authenticated (use in API routes)
 */
export function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifyToken(token || "");
}

/**
 * Return 401 response
 */
export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: "Unauthorized. Please login first." },
    { status: 401 }
  );
}

/**
 * Helper to protect API routes - add at the start of protected routes
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }
  return null; // null means authenticated, continue
}
