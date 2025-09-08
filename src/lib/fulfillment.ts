import { markOrderFulfilled } from './orders';

// In production, push to SQS / PubSub / Cloud Tasks.
// Here we show a direct call for simplicity (replace with enqueue).
export async function enqueueFulfillment(payload: { orderId: string; stripeSessionId: string }) {
  // TODO: enqueue to your worker (AWS SQS, GCP Pub/Sub, etc.)
  // For now, call a local worker function (blocks request; replace ASAP).
  const res = await runLocalFulfillment(payload.orderId);
  await markOrderFulfilled(payload.orderId, res.signedUrl, res.expiresAt);
}

// Placeholder that pretends a background job ran and produced a signed URL.
async function runLocalFulfillment(orderId: string): Promise<{ signedUrl: string; expiresAt: string }> {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // +24h
  return {
    signedUrl: `https://example-downloads/secure/${orderId}.zip?sig=...`,
    expiresAt: expires,
  };
}