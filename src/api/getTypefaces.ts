import { sanity } from "@/api/sanity";
import { typefaceBySlugQuery } from "./query/typefaceBySlug";

export async function getTypeface(slug: string) {
  return sanity.fetch(typefaceBySlugQuery, { slug });
}
