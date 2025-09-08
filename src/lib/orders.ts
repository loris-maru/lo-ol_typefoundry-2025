import { sanityWrite } from '@/lib/sanity/sanity.server';
import Stripe from 'stripe';

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
          fontId: i.f, fontFamilyId: i.FF, licenseType: i.L, userTier: i.T, qty: i.q ?? 1,
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