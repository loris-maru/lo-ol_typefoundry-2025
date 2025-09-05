import { NextRequest, NextResponse } from "next/server";

import { getTypefaceBySlug } from "@/api/typefaces";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const typeface = await getTypefaceBySlug(slug);

    if (!typeface) {
      return NextResponse.json({ error: "Typeface not found" }, { status: 404 });
    }

    return NextResponse.json({ typeface });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch typeface" }, { status: 500 });
  }
}
