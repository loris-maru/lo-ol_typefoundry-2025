import { getTypefaceBySlug } from "@/api/typefaces";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!params.slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const typeface = await getTypefaceBySlug(params.slug);

    if (!typeface) {
      return NextResponse.json(
        { error: "Typeface not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ typeface });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch typeface" },
      { status: 500 }
    );
  }
}
