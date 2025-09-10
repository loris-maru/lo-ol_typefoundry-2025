import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const fontPath = path.join("/");

    // Construct the Sanity CDN URL
    const sanityUrl = `https://cdn.sanity.io/files/kszrpogt/production/${fontPath}`;

    // Fetch the font from Sanity CDN
    const response = await fetch(sanityUrl);

    if (!response.ok) {
      return new NextResponse("Font not found", { status: 404 });
    }

    const fontBuffer = await response.arrayBuffer();

    // Return the font with proper headers
    return new NextResponse(fontBuffer, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "font/woff2",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Font proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
