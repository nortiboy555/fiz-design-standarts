import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY;

interface RemoveBgAccountResponse {
  data: {
    attributes: {
      credits: {
        total: number;
        subscription: number;
        payg: number;
        enterprise: number;
      };
      api: {
        free_calls: number;
        sizes: string;
      };
    };
  };
}

export async function GET(request: NextRequest) {
  // Check authentication
  const authError = requireAuth(request);
  if (authError) return authError;

  if (!REMOVEBG_API_KEY) {
    return NextResponse.json(
      { error: "REMOVEBG_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.remove.bg/v1.0/account", {
      method: "GET",
      headers: {
        "X-Api-Key": REMOVEBG_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remove.bg account error:", errorText);
      return NextResponse.json(
        { error: `Failed to fetch account: ${response.status}` },
        { status: response.status }
      );
    }

    const data: RemoveBgAccountResponse = await response.json();

    return NextResponse.json({
      success: true,
      credits: {
        total: data.data.attributes.credits.total,
        subscription: data.data.attributes.credits.subscription,
        payg: data.data.attributes.credits.payg,
        enterprise: data.data.attributes.credits.enterprise || 0,
      },
      api: {
        freeCalls: data.data.attributes.api.free_calls,
        sizes: data.data.attributes.api.sizes,
      },
    });
  } catch (error) {
    console.error("Remove.bg account error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch account" },
      { status: 500 }
    );
  }
}
