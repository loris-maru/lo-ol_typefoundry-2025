import { createClient } from "@sanity/client";

export const sanityServer = createClient({
  projectId: "kszrpogt",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2023-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "published",
});
