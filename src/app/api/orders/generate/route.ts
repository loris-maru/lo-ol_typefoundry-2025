import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    const { sessionId, items } = await req.json();

    if (!sessionId || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    // 1) Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    if (!session || session.payment_status !== "paid") {
      return new NextResponse("Session not found or unpaid.", { status: 403 });
    }

    // Optional: validate email, amount_total, or line_items against your cart contents here

    // 2) Forward to the Python worker (FastAPI)
    const workerUrl = process.env.FONT_WORKER_URL!;
    const workerSecret = process.env.FONT_WORKER_SECRET!; // shared secret

    const res = await fetch(`${workerUrl}/generate-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Worker-Auth": `Bearer ${workerSecret}`,
      },
      body: JSON.stringify({
        orderRef: session.id,
        customerEmail: session.customer_details?.email ?? null,
        items,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return new NextResponse(`Worker error: ${msg}`, { status: 500 });
    }

    const data = await res.json();
    // data = { downloadUrl: "https://..." }
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}
