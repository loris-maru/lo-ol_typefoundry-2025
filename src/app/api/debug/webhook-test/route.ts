import { createOrderFromSession } from "@/lib/orders";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Test with a real session ID from your Stripe dashboard
    const testSessionId = "cs_test_1234567890"; // Replace with a real test session ID

    console.log("Testing order creation with session ID:", testSessionId);

    const orderId = await createOrderFromSession(testSessionId);

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order creation test completed",
    });
  } catch (error) {
    console.error("Webhook test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
