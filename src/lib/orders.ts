import { createClient } from '@sanity/client';
import Stripe from 'stripe';

// Create Sanity write client
const sanityWrite = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'kszrpogt',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-08-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

function decodeCartFingerprint(s?: string) {
  try {
    if (!s) return null;
    return JSON.parse(Buffer.from(s, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export async function createOrderFromSession(session: Stripe.Checkout.Session) {
  const cartMini = decodeCartFingerprint(session.metadata?.cartFingerprint);

  const doc = await sanityWrite.create({
    _type: 'order',
    stripeSessionId: session.id,
    status: 'paid',
    email: session.customer_details?.email ?? '',
    totalPaid: (session.amount_total ?? 0) / 100,
    items: Array.isArray(cartMini)
      ? cartMini.map((i: any) => ({
          fontId: i.f, 
          fontFamilyId: i.FF, 
          licenseType: i.L, 
          userTier: i.T, 
          qty: i.q ?? 1,
          // Add additional fields from your schema
          weight: i.weight || 400,
          width: i.width || 100,
          slant: i.slant || 0,
          opticalSize: i.opticalSize || 100,
          isItalic: i.isItalic || false,
        }))
      : [],
  });

  return doc._id as string;
}

export async function markOrderFulfilled(orderId: string, downloadUrl: string, expiresAtISO: string) {
  await sanityWrite.patch(orderId)
    .set({ status: 'fulfilled', downloadUrl, expiresAt: expiresAtISO })
    .commit();
}