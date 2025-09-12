import { NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export async function POST(req: Request) {
  try {
    const { sessionId, items } = await req.json();

    console.log("=== ORDERS GENERATE API START ===");
    console.log("Using Stripe key:", process.env.STRIPE_SECRET_KEY?.substring(0, 20) + "...");
    console.log("Session ID:", sessionId);
    console.log("Worker URL:", process.env.FONT_WORKER_URL);

    if (!sessionId || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError: unknown) {
      console.error("Stripe session retrieval error:", stripeError);
      if (
        stripeError &&
        typeof stripeError === "object" &&
        "code" in stripeError &&
        stripeError.code === "resource_missing"
      ) {
        const isLiveKey = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
        const isTestSession = sessionId.startsWith("cs_test_");

        if (isLiveKey && isTestSession) {
          return new NextResponse(
            "Cannot use live Stripe key with test session. Please use test key or create live session.",
            { status: 400 },
          );
        }

        return new NextResponse("Stripe session not found or expired", { status: 404 });
      }
      throw stripeError;
    }

    if (!session || session.payment_status !== "paid") {
      return new NextResponse("Unpaid or invalid Stripe session", { status: 403 });
    }

    console.log("Session payment status:", session.payment_status);
    console.log("Session amount total:", session.amount_total);

    if (!process.env.FONT_WORKER_URL) {
      console.error("FONT_WORKER_URL environment variable is not set");
      return new NextResponse("Font worker URL not configured", { status: 500 });
    }

    const res = await fetch(`${process.env.FONT_WORKER_URL}/generate-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Worker-Auth": `Bearer ${process.env.WORKER_SHARED_SECRET!}`,
      },
      body: JSON.stringify({ sessionId, items }),
    });

    console.log("Worker response status:", res.status);
    console.log("Worker response headers:", Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const msg = await res.text();
      console.error("Worker error response:", msg);
      return new NextResponse(`Worker error: ${msg}`, { status: 500 });
    }

    const data = await res.json(); // { downloadUrl }
    console.log("Worker response body:", data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Orders generate API error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
