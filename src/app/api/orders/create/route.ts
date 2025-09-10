import { upsertOrderFromCheckoutSession } from "@/lib/orders";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }
    const orderId = await upsertOrderFromCheckoutSession(sessionId);
    return NextResponse.json({ ok: true, orderId });
  } catch (err: any) {
    console.error("[orders/create] ERROR:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
