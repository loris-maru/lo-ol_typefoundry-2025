import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sessionId, items, productType } = await req.json();

    console.log("=== ORDERS GENERATE API START ===");
    console.log("Session ID:", sessionId);
    console.log("Items:", items);

    if (!sessionId || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    // All Shop orders use "static" product type (pre-made files from bucket)
    // Future "Custom Font" section will use "custom" product type
    const determinedProductType = "static";

    console.log("Determined Product Type:", determinedProductType);

    // Call the new Vercel API
    const vercelApiUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/generate-order`
      : "http://localhost:3000/api/generate-order";

    console.log("Calling Vercel API:", vercelApiUrl);

    const res = await fetch(vercelApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, items, productType: determinedProductType }),
    });

    console.log("Vercel API response status:", res.status);

    if (!res.ok) {
      const msg = await res.text();
      console.error("Vercel API error response:", msg);
      return new NextResponse(`Vercel API error: ${msg}`, { status: 500 });
    }

    const data = await res.json(); // { downloadUrl }
    console.log("Vercel API response body:", data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Orders generate API error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
