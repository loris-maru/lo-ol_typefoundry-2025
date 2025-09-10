import { createClient } from "@sanity/client";
import "server-only";

export const sanityServer = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "kszrpogt",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_READ_TOKEN,
});

export const sanityWrite = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "kszrpogt",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
