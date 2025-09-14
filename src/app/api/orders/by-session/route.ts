import { NextRequest, NextResponse } from "next/server";
import { sanityWrite } from "@/lib/orders";

console.log("=== USING SANITY WRITE CLIENT FOR READING ===");
console.log("Project ID:", process.env.SANITY_PROJECT_ID);
console.log("Dataset:", process.env.SANITY_DATASET);
console.log("API Version:", process.env.SANITY_API_VERSION || "2025-01-01");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId parameter" }, { status: 400 });
    }

    console.log("=== FETCH ORDER BY SESSION ===");
    console.log("Session ID:", sessionId);

    // Query Sanity for the order with more debugging
    console.log("Querying Sanity with sessionId:", sessionId);

    // First, let's check if any orders exist at all
    const allOrders = await sanityWrite.fetch(`*[_type == "order"]`);
    console.log("All orders in Sanity:", allOrders.length);

    // Then query for our specific order
    const order = await sanityWrite.fetch(
      `*[_type == "order" && stripeSessionId == $sessionId][0]`,
      { sessionId },
    );

    console.log("Sanity query result:", order);

    // Let's also try a broader query to see what's in Sanity
    const ordersWithSessionId = await sanityWrite.fetch(
      `*[_type == "order" && defined(stripeSessionId)]`,
    );
    console.log(
      "Orders with stripeSessionId:",
      ordersWithSessionId.map((o: any) => ({ id: o._id, sessionId: o.stripeSessionId })),
    );

    if (!order) {
      console.log("Order not found in Sanity");
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Found order:", order._id);
    console.log("Order items count:", order.items?.length || 0);
    console.log("Order items:", order.items);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
