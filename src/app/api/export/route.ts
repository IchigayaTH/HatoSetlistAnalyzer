import { NextResponse } from 'next/server';
import { getAllData } from '@/lib/storage';

export async function GET() {
  try {
    console.log('GET /api/export - Exporting all data...');
    const data = await getAllData();
    
    // Create a backup object with timestamp
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        members: data.members,
        songs: data.songs,
        events: data.events,
        setlists: data.setlists
      }
    };
    
    console.log('GET /api/export - Exported successfully', { 
      members: data.members.length, 
      songs: data.songs.length, 
      events: data.events.length, 
      setlists: data.setlists.length 
    });
    
    return NextResponse.json(backup);
  } catch (error) {
    console.error('GET /api/export - Error:', error);
    return NextResponse.json(
      { error: 'Failed to export data', details: String(error) },
      { status: 500 }
    );
  }
}
