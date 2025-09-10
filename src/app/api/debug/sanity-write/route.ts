// src/app/api/debug/sanity-write/route.ts
import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

export async function GET() {
  try {
    const id = `debug.${Date.now()}`;
    const doc = await sanity.create({
      _id: id,
      _type: "order",
      stripeSessionId: `debug-${Date.now()}`,
      status: "paid",
      email: "debug@example.com",
      totalPaid: 1234,
      items: [],
    });
    return NextResponse.json({ ok: true, created: doc._id });
  } catch (e: any) {
    console.error("sanity-write debug error:", e);
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
