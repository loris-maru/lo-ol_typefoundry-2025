import "server-only";
import { Storage } from "@google-cloud/storage";

import { getGcpCredentials } from "./credentials";

let _storage: Storage | null = null;

export function getStorage(): Storage {
  if (_storage) return _storage;
  const { projectId, clientEmail, privateKey } = getGcpCredentials();
  _storage = new Storage({
    projectId,
    credentials: { client_email: clientEmail, private_key: privateKey },
  });
  return _storage;
}
