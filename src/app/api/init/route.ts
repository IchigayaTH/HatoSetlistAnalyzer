import { NextResponse } from 'next/server';
import { initializeStorage } from '@/lib/storageInit';

export async function POST() {
  try {
    await initializeStorage();
    return NextResponse.json({ message: 'Storage initialized successfully' });
  } catch (error) {
    console.error('Error initializing storage:', error);
    return NextResponse.json(
      { error: 'Failed to initialize storage', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to /api/init to initialize storage' });
}
