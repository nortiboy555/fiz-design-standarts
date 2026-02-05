import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAuth } from "@/lib/auth";
import { safeFetch } from "@/lib/url-validator";

export async function POST(request: NextRequest) {
  // Check authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const { url, filename } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Fetch image from URL with SSRF protection
    let response: Response;
    try {
      response = await safeFetch(url, {}, 10000); // 10 second timeout
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "URL fetch blocked" },
        { status: 400 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: 400 }
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";
    const finalFilename = filename || `image-${Date.now()}.png`;

    // Upload to Vercel Blob
    const blob = await put(`images/${finalFilename}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Upload from URL error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
