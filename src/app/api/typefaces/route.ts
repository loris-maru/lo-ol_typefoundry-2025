import { NextResponse } from "next/server";

import { getAllTypefaces } from "@/app/api/typefaces";

export async function GET() {
  try {
    const typefaces = await getAllTypefaces();
    return NextResponse.json({ typefaces });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch typefaces" }, { status: 500 });
  }
}
