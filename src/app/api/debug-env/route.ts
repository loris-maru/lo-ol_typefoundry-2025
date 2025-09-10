import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_WRITE_TOKEN: process.env.SANITY_WRITE_TOKEN ? "SET" : "NOT SET",
    SANITY_READ_TOKEN: process.env.SANITY_READ_TOKEN ? "SET" : "NOT SET",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "SET" : "NOT SET",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "SET" : "NOT SET",
    // Show first 10 characters of tokens for verification
    SANITY_WRITE_TOKEN_PREFIX: process.env.SANITY_WRITE_TOKEN?.substring(0, 10) + "...",
    SANITY_READ_TOKEN_PREFIX: process.env.SANITY_READ_TOKEN?.substring(0, 10) + "...",
  });
}
