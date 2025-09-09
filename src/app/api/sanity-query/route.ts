import { createClient } from '@sanity/client';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, params } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Create Sanity client directly here to ensure env vars are loaded
    const sanityClient = createClient({
      projectId: process.env.SANITY_PROJECT_ID || 'kszrpogt',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2024-08-01',
      useCdn: false,
      token: process.env.SANITY_READ_TOKEN
    });

    const result = await sanityClient.fetch(query, params || {});

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error in sanity-query API:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
