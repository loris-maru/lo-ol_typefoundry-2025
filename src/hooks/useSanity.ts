"use client";

import { sanity } from "@/api/sanity";
import useSWR, { SWRConfiguration } from "swr";

/**
 * A global hook to fetch data from Sanity using GROQ.
 *
 * @param query   GROQ string (e.g., `*[_type == "post"]{title}`)
 * @param params  GROQ params object
 * @param config  SWR config overrides
 *
 * @example
 * const { data, isLoading, error } = useSanity<Post[]>(
 *   `*[_type == "post"]{_id, title, slug}`
 * );
 */
export function useSanity<T = unknown>(
  query: string | null,
  params?: Record<string, unknown>,
  config?: SWRConfiguration
) {
  // Key must be null to disable SWR when query is null/undefined
  const key = query ? ["sanity", query, params ?? {}] : null;

  const fetcher = async (
    _key: string,
    q: string,
    p: Record<string, unknown>
  ) => {
    return sanity.fetch<T>(q, p);
  };

  const {
    data,
    error,
    isLoading,
    mutate, // handy for optimistic updates or manual refresh
  } = useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000,
    ...config,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

// Example of usage
// "use client";

// import { useSanity } from "@/hooks/useSanity";

// type Post = {
//   _id: string;
//   title: string;
//   slug?: { current: string };
// };

// export default function PostsList() {
//   const { data, isLoading, error } = useSanity<Post[]>(
//     `*[_type == "post"] | order(_createdAt desc) { _id, title, slug }`
//   );

//   if (isLoading) return <p>Loading…</p>;
//   if (error) return <p>Failed to load posts.</p>;

//   return (
//     <ul>
//       {data?.map((p) => (
//         <li key={p._id}>{p.title}</li>
//       ))}
//     </ul>
//   );
// }
