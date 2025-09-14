import { typefaces } from "@/app/api/query/typefaces";
import { sanityFetch, sanityFetchAll } from "@/lib/sanity/sanityFetch";
import { typeface } from "@/types/typefaces";

export async function getAllTypefaces(): Promise<typeface[]> {
  try {
    console.log("Fetching all typefaces...");
    const result = await sanityFetchAll<typeface>(typefaces);
    console.log(`Found ${result.length} typefaces`);
    return result;
  } catch (error) {
    console.error("Error fetching all typefaces:", error);
    return [];
  }
}

export async function getTypefaceBySlug(slug: string): Promise<typeface | null> {
  try {
    // Build proper query by replacing the array selector with single item filter
    const query = typefaces.replace(
      '*[_type == "typefaces"][]',
      '*[_type == "typefaces" && slug.current == $slug][0]',
    );

    console.log(`Fetching typeface with slug: ${slug}`);
    console.log(`Using query: ${query}`);

    const result = await sanityFetch<typeface>(query, { slug });
    console.log(`Query result for ${slug}:`, result ? "Found" : "Not found");

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
    console.log(`Fetching featured typefaces with limit: ${limit}`);

    const result = await sanityFetchAll<typeface>(query);
    console.log(`Found ${result.length} featured typefaces`);

    return result;
  } catch (error) {
    console.error("Error fetching featured typefaces:", error);
    return [];
  }
}
