import { sanityServer } from "@/api/sanity";

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const result = await sanityServer.fetch(query, params);
    return result;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    throw new Error(`Failed to fetch data from Sanity: ${error}`);
  }
}

export async function sanityFetchAll<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T[]> {
  try {
    const result = await sanityServer.fetch(query, params);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Sanity fetch error:", error);
    throw new Error(`Failed to fetch data from Sanity: ${error}`);
  }
}
