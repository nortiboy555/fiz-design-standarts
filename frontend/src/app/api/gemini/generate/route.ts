import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { safeFetch } from "@/lib/url-validator";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_IMAGE_MODEL = "gemini-3-pro-image-preview";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface GeminiImage {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
}

async function generateSingleImage(
  prompt: string,
  width: number,
  height: number,
  referenceBase64: { mimeType: string; data: string } | null
): Promise<GeminiImage | null> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

  if (referenceBase64) {
    parts.push({
      inlineData: {
        mimeType: referenceBase64.mimeType,
        data: referenceBase64.data,
      },
    });
    parts.push({ text: prompt });
  } else {
    parts.push({ text: `Generate an image: ${prompt}` });
  }

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ["IMAGE"],
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error:", errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();

  const candidates = data.candidates || [];
  for (const candidate of candidates) {
    const candidateParts = candidate.content?.parts || [];
    for (const part of candidateParts) {
      if (part.inlineData?.data) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || "image/png",
          width: width || 1024,
          height: height || 1024,
        };
      }
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  // Check authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Get it from https://aistudio.google.com/apikey" },
        { status: 500 }
      );
    }

    const { prompt, width, height, referenceImageUrl, useReference, count = 1 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Get reference image once if needed
    let referenceBase64: { mimeType: string; data: string } | null = null;
    if (useReference && referenceImageUrl) {
      try {
        if (referenceImageUrl.startsWith("data:")) {
          const matches = referenceImageUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            referenceBase64 = {
              mimeType: matches[1],
              data: matches[2],
            };
          }
        } else {
          // Use safeFetch with SSRF protection
          const imgResponse = await safeFetch(referenceImageUrl, {}, 10000);
          if (imgResponse.ok) {
            const buffer = await imgResponse.arrayBuffer();
            referenceBase64 = {
              data: Buffer.from(buffer).toString("base64"),
              mimeType: imgResponse.headers.get("content-type") || "image/png",
            };
          }
        }
      } catch (e) {
        console.warn("Failed to get reference image (may be blocked by SSRF protection):", e);
      }
    }

    // Generate multiple images in parallel
    const numImages = Math.min(Math.max(1, count), 5);
    const promises: Promise<GeminiImage | null>[] = [];

    for (let i = 0; i < numImages; i++) {
      const variedPrompt =
        numImages > 1 ? `${prompt} (variation ${i + 1}, unique composition and style)` : prompt;

      promises.push(
        generateSingleImage(variedPrompt, width, height, referenceBase64).catch((err) => {
          console.error(`Image ${i + 1} generation failed:`, err);
          return null;
        })
      );
    }

    const results = await Promise.all(promises);
    const images = results.filter((img): img is GeminiImage => img !== null);

    if (images.length === 0) {
      throw new Error("No images generated");
    }

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Gemini generate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
