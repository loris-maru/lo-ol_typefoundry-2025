import { NextResponse } from "next/server";
import { getAllTypefaces, getTypefaceBySlug } from "@/app/api/typefaces";
import { sanityFetch } from "@/lib/sanity/sanityFetch";

export async function GET() {
  try {
    console.log("Debug: Testing typeface fetching");
    
    // Get all available slugs first
    const slugsQuery = '*[_type == "typefaces"]{"slug": slug.current, name, _id}';
    const availableSlugs = await sanityFetch<Array<{slug: string, name: string, _id: string}>>(slugsQuery);
    
    console.log("Available typefaces:", availableSlugs);
    
    // Test getting all typefaces
    const allTypefaces = await getAllTypefaces();
    console.log(`getAllTypefaces returned ${allTypefaces.length} items`);
    
    // Test with a specific slug if available
    let testResult = null;
    if (availableSlugs.length > 0) {
      const testSlug = availableSlugs[0].slug;
      console.log(`Testing with slug: ${testSlug}`);
      testResult = await getTypefaceBySlug(testSlug);
    }
    
    return NextResponse.json({
      status: "success",
      availableSlugs: availableSlugs,
      totalTypefaces: allTypefaces.length,
      testSlug: availableSlugs[0]?.slug || null,
      testResult: testResult ? "Found" : "Not found"
    });
  } catch (error) {
    console.error("Debug API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to test typeface fetching",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
