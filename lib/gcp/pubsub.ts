import "server-only";
import { PubSub } from "@google-cloud/pubsub";

import { getGcpCredentials } from "./credentials";

let _pubsub: PubSub | null = null;

export function getPubSub(): PubSub {
  if (_pubsub) return _pubsub;
  const { projectId, clientEmail, privateKey } = getGcpCredentials();
  _pubsub = new PubSub({
    projectId,
    credentials: { client_email: clientEmail, private_key: privateKey },
  });
  return _pubsub;
}
