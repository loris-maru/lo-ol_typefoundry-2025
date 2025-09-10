import { sanityServer, sanityWrite as sanityWriteClient } from "@/lib/sanity/sanity.server";
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || "kszrpogt";
const dataset = process.env.SANITY_DATASET || "production";

// Try multiple approaches for fetching data
export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  const clients = [
    { name: "Primary client", client: sanityServer },
    {
      name: "Public access client",
      client: createClient({
        projectId,
        dataset,
        apiVersion: "2024-08-01",
        useCdn: false,
        perspective: "published",
      }),
    },
    {
      name: "Production fallback",
      client: createClient({
        projectId,
        dataset: "production",
        apiVersion: "2024-08-01",
        useCdn: false,
        perspective: "published",
      }),
    },
  ];

  let lastError: any;

  for (const { name, client } of clients) {
    try {
      console.log(`🔍 Trying ${name}...`);
      const result = await client.fetch(query, params);
      console.log(`✅ ${name} succeeded`);
      return result;
    } catch (error: any) {
      console.log(`❌ ${name} failed:`, error.message);
      lastError = error;

      // If it's an auth error, try next client
      if (error.statusCode === 401) {
        continue;
      }

      // If it's a different error (like dataset not found), throw immediately
      if (error.statusCode === 404) {
        break;
      }
    }
  }

  console.error("All Sanity clients failed. Last error:", lastError);
  throw new Error(`Failed to fetch data from Sanity: ${lastError?.message || lastError}`);
}

export async function sanityFetchAll<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T[]> {
  try {
    const result = await sanityFetch<T[]>(query, params);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("sanityFetchAll error:", error);
    throw error;
  }
}

// Write operations using the write client
export async function sanityWrite<T>(
  operation: (client: typeof sanityWriteClient) => Promise<T>,
): Promise<T> {
  try {
    console.log("✍️ Executing write operation...");
    const result = await operation(sanityWriteClient);
    console.log("✅ Write operation succeeded");
    return result;
  } catch (error) {
    console.error("❌ Write operation failed:", error);
    throw error;
  }
}
