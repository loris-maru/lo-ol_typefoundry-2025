import { typefaces } from "@/app/api/query/typefaces";
import { typeface } from "@/types/typefaces";
import { createClient } from '@sanity/client';

// Create Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'kszrpogt',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-08-01',
  useCdn: true, // Enable CDN for public data
  // Temporarily remove token to test public access
  // token: process.env.SANITY_READ_TOKEN,
});

export async function getAllTypefaces(): Promise<typeface[]> {
  try {
    const result = await sanityClient.fetch<typeface[]>(typefaces);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching all typefaces:", error);
    return [];
  }
}

export async function getTypefaceBySlug(slug: string): Promise<typeface | null> {
  try {
    // Use the existing typefaces query but filter by slug
    const query = `*[_type == "typefaces" && slug.current == $slug][0] ${typefaces.replace(
      '*[_type == "typefaces"][]',
      "",
    )}`;

    const result = await sanityClient.fetch<typeface>(query, { slug });
    return result || null;
  } catch (error) {
    console.error(`Error in getTypefaceBySlug for slug ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedTypefaces(limit: number = 6): Promise<typeface[]> {
  try {
    const query = `*[_type == "typefaces" && featured == true][0...${limit}] ${typefaces.replace(
      '*[_type == "typefaces"][]',
      "",
    )}`;
    const result = await sanityClient.fetch<typeface[]>(query);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching featured typefaces:", error);
    return [];
  }
}
