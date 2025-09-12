import { NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export async function POST(req: Request) {
  try {
    const { sessionId, items } = await req.json();

    if (!sessionId || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    // 1) Verify Stripe Checkout Session is paid
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return new NextResponse("Unpaid or invalid Stripe session", { status: 403 });
    }

    // 2) Call Cloud Run worker
    const res = await fetch(`${process.env.FONT_WORKER_URL}/generate-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Worker-Auth": `Bearer ${process.env.WORKER_SHARED_SECRET!}`,
      },
      body: JSON.stringify({ sessionId, items }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return new NextResponse(`Worker error: ${msg}`, { status: 500 });
    }

    const data = await res.json(); // { downloadUrl }
    return NextResponse.json(data);
  } catch (e: unknown) {
    console.error(e);
    return new NextResponse("Server error", { status: 500 });
  }
}
