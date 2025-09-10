import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "kszrpogt",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-08-01",
  useCdn: true,
  // Temporarily remove token to test public access
  // token: process.env.SANITY_READ_TOKEN,
});

export async function GET() {
  try {
    console.log("Debug: Testing Sanity connection");
    console.log("Project ID:", process.env.SANITY_PROJECT_ID);
    console.log("Dataset:", process.env.SANITY_DATASET);
    console.log("Has token:", !!process.env.SANITY_READ_TOKEN);

    // Test basic connection
    const basicQuery = await sanityClient.fetch(
      '*[_type == "typefaces"]{_id, name, "slug": slug.current}[0...5]',
    );
    console.log("Basic query result:", basicQuery);

    // Get all slugs
    const slugs = await sanityClient.fetch('*[_type == "typefaces"]{"slug": slug.current}');
    console.log("Available slugs:", slugs);

    return NextResponse.json({
      connection: "success",
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      hasToken: !!process.env.SANITY_READ_TOKEN,
      basicQuery,
      availableSlugs: slugs,
    });
  } catch (error) {
    console.error("Debug API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to connect to Sanity",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
