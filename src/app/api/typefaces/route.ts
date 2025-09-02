import { getAllTypefaces } from '@/api/typefaces';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const typefaces = await getAllTypefaces();
    return NextResponse.json({ typefaces });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch typefaces' }, { status: 500 });
  }
}
