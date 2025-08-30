import { sanityServer } from "@/api/sanity";

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: { perspective?: "published" | "previewDrafts" },
): Promise<T> {
  return sanityServer.fetch<T>(query, params ?? {}, {
    // you can override perspective when needed
    perspective: options?.perspective ?? "published",
  });
}
