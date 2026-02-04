import { NextRequest, NextResponse } from "next/server";

const APP_PASSWORD = process.env.APP_PASSWORD || process.env.NEXT_PUBLIC_APP_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    console.log("Auth request, password received:", !!password, "APP_PASSWORD set:", !!APP_PASSWORD);

    if (!APP_PASSWORD) {
      return NextResponse.json({ error: "Password not configured" }, { status: 500 });
    }

    if (password === APP_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
  } catch (e) {
    console.error("Auth error:", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
