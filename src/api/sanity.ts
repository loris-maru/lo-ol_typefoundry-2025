import { createClient } from "@sanity/client";

if (!process.env.SANITY_API_READ_TOKEN) {
  console.warn("⚠️  Warning: SANITY_API_READ_TOKEN is not set. Sanity queries may fail.");
}

export const sanityServer = createClient({
  projectId: "kszrpogt",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2023-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "published",
});
