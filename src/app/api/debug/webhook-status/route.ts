import { NextResponse } from 'next/server';

export async function GET() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const sanityProjectId = process.env.SANITY_PROJECT_ID;
  const sanityWriteToken = process.env.SANITY_WRITE_TOKEN;

  return NextResponse.json({
    webhookSecret: webhookSecret ? 'SET' : 'NOT SET',
    stripeSecretKey: stripeSecretKey ? 'SET' : 'NOT SET',
    sanityProjectId: sanityProjectId || 'NOT SET',
    sanityWriteToken: sanityWriteToken ? 'SET' : 'NOT SET',
    webhookUrl: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/stripe` : 'NOT SET',
    message: 'Check these values in your Stripe webhook configuration'
  });
}
