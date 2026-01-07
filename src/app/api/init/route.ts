import { NextResponse } from 'next/server';
import { initializeStorage } from '@/lib/storageInit';

export async function POST() {
  try {
    initializeStorage();
    return NextResponse.json({ message: 'Storage initialized successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initialize storage' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to /api/init to initialize storage' });
}
