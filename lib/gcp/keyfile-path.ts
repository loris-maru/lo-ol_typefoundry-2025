import "server-only";
import fs from "node:fs";
import path from "node:path";

import { env } from "../env";

let realizedPath: string | null = null;

export function getTempKeyfilePath(): string {
  if (realizedPath) return realizedPath;
  const p = path.join("/tmp", "gcp-key.json");
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, env.GOOGLE_SERVICE_ACCOUNT_JSON, { encoding: "utf8", mode: 0o600 });
  }
  realizedPath = p;
  return realizedPath;
}
