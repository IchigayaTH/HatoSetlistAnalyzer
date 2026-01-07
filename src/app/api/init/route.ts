import { NextResponse } from 'next/server';
import { initializeStorage } from '@/lib/storageInit';

export async function POST() {
  try {
    console.log('POST /api/init - Initializing storage...');
    await initializeStorage();
    console.log('POST /api/init - Storage initialized successfully');
    return NextResponse.json({ message: 'Storage initialized successfully' });
  } catch (error) {
    console.error('POST /api/init - Error initializing storage:', error);
    return NextResponse.json(
      { error: 'Failed to initialize storage', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to /api/init to initialize storage' });
}
