import { NextRequest, NextResponse } from "next/server";
import { createSessionResponse, clearSessionResponse, isAuthenticated } from "@/lib/auth";
import crypto from "crypto";

// Only use server-side APP_PASSWORD (removed NEXT_PUBLIC fallback)
const APP_PASSWORD = process.env.APP_PASSWORD;

/**
 * Simple in-memory rate limiter
 * For production with multiple instances, use Redis/Vercel KV
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // Max attempts
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in ms

function getClientIP(request: NextRequest): string {
  // Try various headers for real IP (behind proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  // Fallback - hash user agent as pseudo-identifier
  const ua = request.headers.get("user-agent") || "unknown";
  return crypto.createHash("md5").update(ua).digest("hex").substring(0, 16);
}

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; resetIn: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  // Clean up expired entries periodically
  if (loginAttempts.size > 1000) {
    for (const [key, value] of loginAttempts.entries()) {
      if (value.resetAt < now) {
        loginAttempts.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    // No record or expired - allow
    return { allowed: true, remainingAttempts: RATE_LIMIT_MAX, resetIn: 0 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    // Rate limited
    const resetIn = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remainingAttempts: 0, resetIn };
  }

  return { allowed: true, remainingAttempts: RATE_LIMIT_MAX - record.count, resetIn: 0 };
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || record.resetAt < now) {
    // New or expired record
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  } else {
    // Increment existing
    record.count++;
  }
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  // Check rate limit first
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many login attempts. Try again in ${rateLimit.resetIn} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const password = body?.password;

    if (!APP_PASSWORD) {
      return NextResponse.json(
        { error: "APP_PASSWORD not configured on server" },
        { status: 500 }
      );
    }

    // Constant-time comparison to prevent timing attacks
    const passwordBuffer = Buffer.from(password || "");
    const expectedBuffer = Buffer.from(APP_PASSWORD);

    let isValid = false;
    if (passwordBuffer.length === expectedBuffer.length) {
      try {
        isValid = crypto.timingSafeEqual(passwordBuffer, expectedBuffer);
      } catch {
        isValid = false;
      }
    }

    if (isValid) {
      // Success - clear rate limit for this IP
      clearAttempts(clientIP);
      const response = NextResponse.json({ success: true });
      return createSessionResponse(response);
    }

    // Failed attempt - record it
    recordFailedAttempt(clientIP);
    const updatedLimit = checkRateLimit(clientIP);

    return NextResponse.json(
      {
        success: false,
        error: "Incorrect password",
        remainingAttempts: updatedLimit.remainingAttempts,
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Check if already authenticated
export async function GET(request: NextRequest) {
  const authenticated = isAuthenticated(request);
  return NextResponse.json({ authenticated });
}

// Logout - clear session
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  return clearSessionResponse(response);
}
