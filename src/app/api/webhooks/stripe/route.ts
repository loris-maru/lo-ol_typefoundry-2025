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

// import { headers } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// import { createOrderFromSession } from "@/lib/orders";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(request: NextRequest) {
//   console.log("=== WEBHOOK RECEIVED ===");
//   const body = await request.text();
//   const headersList = await headers();
//   const signature = headersList.get("stripe-signature");

//   console.log("Webhook body length:", body.length);
//   console.log("Signature present:", !!signature);

//   if (!signature) {
//     console.error("No signature provided");
//     return NextResponse.json({ error: "No signature provided" }, { status: 400 });
//   }

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     console.log("Webhook event type:", event.type);
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err);
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   try {
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session;
        
//         console.log("Processing checkout.session.completed for session:", session.id);
//         console.log("Session payment status:", session.payment_status);
//         console.log("Session amount total:", session.amount_total);
//         console.log("Session customer email:", session.customer_details?.email);
        
//         try {
//           const orderId = await createOrderFromSession(session.id);
//           console.log("Order created successfully with ID:", orderId);
//         } catch (error) {
//           console.error("Failed to create order:", error);
//           console.error("Error details:", error instanceof Error ? error.stack : error);
//           return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
//         }
        
//         break;
//       }

//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;
//         console.log("Payment intent succeeded:", paymentIntent.id);
//         break;
//       }

//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;
//         console.log("Payment intent failed:", paymentIntent.id);
//         break;
//       }

//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
//   }
// }
