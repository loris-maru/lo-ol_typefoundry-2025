import "server-only";
import { env } from "../env";

type GcpCreds = {
  client_email: string;
  private_key: string;
  project_id?: string;
};

let _creds: GcpCreds | null = null;

export function getGcpCredentials(): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
} {
  if (_creds) {
    return {
      projectId: _creds.project_id ?? process.env.GOOGLE_CLOUD_PROJECT_ID!,
      clientEmail: _creds.client_email,
      privateKey: _creds.private_key,
    };
  }

  let keyFileContent: string;

  if (env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    // Use JSON content directly
    keyFileContent = env.GOOGLE_SERVICE_ACCOUNT_JSON;
  } else if (env.GOOGLE_CLOUD_KEY_FILE) {
    // Read the service account key file
    const fs = require("fs");
    keyFileContent = fs.readFileSync(env.GOOGLE_CLOUD_KEY_FILE, "utf8");
  } else {
    throw new Error("Either GOOGLE_CLOUD_KEY_FILE or GOOGLE_SERVICE_ACCOUNT_JSON must be provided");
  }

  const parsed = JSON.parse(keyFileContent) as GcpCreds;

  // Some CI tools strip newlines; handle \n-escaped keys just in case
  const fixedKey = parsed.private_key.replace(/\\n/g, "\n");

  _creds = { ...parsed, private_key: fixedKey };

  return {
    projectId: parsed.project_id ?? process.env.GOOGLE_CLOUD_PROJECT_ID!,
    clientEmail: parsed.client_email,
    privateKey: fixedKey,
  };
}
