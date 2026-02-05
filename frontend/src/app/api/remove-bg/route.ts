import { NextRequest, NextResponse } from "next/server";
import { uploadBuffer } from "@/lib/blob";
import { requireAuth } from "@/lib/auth";

const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY;

export async function POST(request: NextRequest) {
  // Check authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  if (!REMOVEBG_API_KEY) {
    return NextResponse.json(
      { error: "Remove.bg API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_url", imageUrl);

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVEBG_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 402) {
        return NextResponse.json(
          { error: "API limit reached", message: "Remove.bg API credits exhausted. Please top up your account at remove.bg" },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: errorData.errors?.[0]?.title || "Failed to remove background" },
        { status: response.status }
      );
    }

    // Get the processed image and upload to Vercel Blob
    const imageBuffer = await response.arrayBuffer();
    const result = await uploadBuffer(
      imageBuffer,
      `nobg-${Date.now()}.png`,
      "image/png"
    );

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error("Remove.bg error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
