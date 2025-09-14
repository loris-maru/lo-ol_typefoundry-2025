import "server-only";
import { Firestore } from "@google-cloud/firestore";

import { getGcpCredentials } from "./credentials";

let _db: Firestore | null = null;

export function getFirestore(): Firestore {
  if (_db) return _db;
  const { projectId, clientEmail, privateKey } = getGcpCredentials();
  _db = new Firestore({
    projectId,
    credentials: { client_email: clientEmail, private_key: privateKey },
    preferRest: true, // often smaller bundle & stable in serverless
  });
  return _db;
}
