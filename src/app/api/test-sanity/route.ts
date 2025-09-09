import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("=== TESTING SANITY CONNECTION ===");
    console.log("Environment variables:", {
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      hasWriteToken: !!process.env.SANITY_WRITE_TOKEN,
      writeTokenPrefix: process.env.SANITY_WRITE_TOKEN?.substring(0, 10) + '...'
    });

    // Create Sanity client directly here to ensure env vars are loaded
    const sanityWrite = createClient({
      projectId: process.env.SANITY_PROJECT_ID || 'kszrpogt',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2024-08-01',
      useCdn: false,
      token: process.env.SANITY_WRITE_TOKEN
    });

    // Try to create a simple test document
    const testDoc = await sanityWrite.create({
      _type: 'testDocument',
      message: 'Test document created at ' + new Date().toISOString(),
      testField: 'This is a test'
    });

    console.log("✅ Test document created successfully:", testDoc);

    return NextResponse.json({ 
      success: true, 
      documentId: testDoc._id,
      message: 'Sanity connection working!'
    });
  } catch (error) {
    console.error("❌ Sanity test failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}
