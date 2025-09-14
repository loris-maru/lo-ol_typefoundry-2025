// server-only: never import from client components
import "server-only";
import { z } from "zod";

const EnvSchema = z
  .object({
    GOOGLE_CLOUD_PROJECT_ID: z.string().min(1),
    GOOGLE_CLOUD_KEY_FILE: z.string().optional(),
    GOOGLE_SERVICE_ACCOUNT_JSON: z.string().optional(),
  })
  .refine((data) => data.GOOGLE_CLOUD_KEY_FILE || data.GOOGLE_SERVICE_ACCOUNT_JSON, {
    message: "Either GOOGLE_CLOUD_KEY_FILE or GOOGLE_SERVICE_ACCOUNT_JSON must be provided",
  });

export const env = EnvSchema.parse({
  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_KEY_FILE: process.env.GOOGLE_CLOUD_KEY_FILE,
  GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
});
