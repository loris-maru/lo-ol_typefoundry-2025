import { typefaces } from "@/api/query/typefaces";
import { sanityFetch, sanityFetchAll } from "@/api/sanityFetch";
import { typeface } from "@/types/typefaces";

export async function getAllTypefaces(): Promise<typeface[]> {
  return sanityFetchAll<typeface>(typefaces);
}

export async function getTypefaceBySlug(
  slug: string
): Promise<typeface | null> {
  try {
    // Use the existing typefaces query but filter by slug
    const query = `*[_type == "typefaces" && slug.current == $slug][0] ${typefaces.replace(
      '*[_type == "typefaces"][]',
      ""
    )}`;

    const result = await sanityFetch<typeface>(query, { slug });
    return result || null;
  } catch (error) {
    console.error("Error in getTypefaceBySlug:", error);
    return null;
  }
}

export async function getFeaturedTypefaces(
  limit: number = 6
): Promise<typeface[]> {
  const query = `*[_type == "typefaces" && featured == true][0...${limit}] ${typefaces.replace(
    '*[_type == "typefaces"][]',
    ""
  )}`;
  return sanityFetchAll<typeface>(query);
}
