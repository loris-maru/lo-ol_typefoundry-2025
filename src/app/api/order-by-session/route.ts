import { createClient } from '@sanity/client';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    // Create Sanity client directly here to ensure env vars are loaded
    const sanityClient = createClient({
      projectId: process.env.SANITY_PROJECT_ID || 'kszrpogt',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2024-08-01',
      useCdn: false,
      token: process.env.SANITY_READ_TOKEN
    });

    console.log('API route Sanity client config:', {
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      hasReadToken: !!process.env.SANITY_READ_TOKEN,
      tokenPrefix: process.env.SANITY_READ_TOKEN?.substring(0, 10) + '...'
    });

    const order = await sanityClient.fetch(
      `*[_type=="order" && stripeSessionId==$sid][0]{ _id }`,
      { sid: sessionId }
    );

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order by session:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
