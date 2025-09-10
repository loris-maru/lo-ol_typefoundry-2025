import { upsertOrderFromCheckoutSession } from "@/lib/orders";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    console.error("[webhook] constructEvent error:", e);
    return NextResponse.json({ error: `Webhook Error: ${e.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await upsertOrderFromCheckoutSession(session.id);
    }
    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("[webhook] handler error:", e);
    return NextResponse.json({ error: e?.message ?? "Unhandled error" }, { status: 500 });
  }
}