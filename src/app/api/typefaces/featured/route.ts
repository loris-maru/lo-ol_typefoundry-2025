import { NextRequest, NextResponse } from "next/server";

import { getFeaturedTypefaces } from "@/api/typefaces";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    const typefaces = await getFeaturedTypefaces(limit);

    return NextResponse.json({ typefaces });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch featured typefaces" }, { status: 500 });
  }
}
