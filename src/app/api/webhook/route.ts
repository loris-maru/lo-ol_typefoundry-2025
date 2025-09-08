export const runtime = 'nodejs';

import { enqueueFulfillment } from '@/lib/fulfillment';
import { createOrderFromSession } from '@/lib/orders';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' });

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse('Bad signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // 1) Create order in Sanity (status: paid)
    const orderId = await createOrderFromSession(session);

    // 2) Kick off fulfillment (async worker recommended)
    await enqueueFulfillment({ orderId, stripeSessionId: session.id });

    return NextResponse.json({ received: true });
  }

  // Optionally handle refunds, payment_failed, etc.
  return NextResponse.json({ ok: true });
}