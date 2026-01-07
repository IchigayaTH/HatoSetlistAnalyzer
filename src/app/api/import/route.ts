import { NextRequest, NextResponse } from 'next/server';
import { addMember, addSong, addEvent, addSetlist } from '@/lib/storage';
import MemoryStore from '@/lib/memoryStore';
import { Member, Song, Event, Setlist } from '@/types';

interface BackupData {
  version: string;
  exportedAt: string;
  data: {
    members: Member[];
    songs: Song[];
    events: Event[];
    setlists: Setlist[];
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/import - Importing data...');
    const backup: BackupData = await request.json();
    
    // Validate structure
    if (!backup.version || !backup.data) {
      return NextResponse.json(
        { error: 'Invalid backup file format', details: 'Missing version or data field' },
        { status: 400 }
      );
    }
    
    const { members = [], songs = [], events = [], setlists = [] } = backup.data;
    
    // Validate arrays
    if (!Array.isArray(members) || !Array.isArray(songs) || !Array.isArray(events) || !Array.isArray(setlists)) {
      return NextResponse.json(
        { error: 'Invalid backup file format', details: 'Data fields must be arrays' },
        { status: 400 }
      );
    }
    
    console.log('POST /api/import - Validating data:', { 
      members: members.length, 
      songs: songs.length, 
      events: events.length, 
      setlists: setlists.length 
    });
    
    // Import members
    for (const member of members) {
      try {
        await addMember(member);
      } catch (e) {
        console.error('Error importing member:', member.id, e);
      }
    }
    
    // Import songs
    for (const song of songs) {
      try {
        await addSong(song);
      } catch (e) {
        console.error('Error importing song:', song.id, e);
      }
    }
    
    // Import events
    for (const event of events) {
      try {
        await addEvent(event);
      } catch (e) {
        console.error('Error importing event:', event.id, e);
      }
    }
    
    // Import setlists
    for (const setlist of setlists) {
      try {
        await addSetlist(setlist);
      } catch (e) {
        console.error('Error importing setlist:', setlist.id, e);
      }
    }
    
    console.log('POST /api/import - Import completed successfully');
    
    return NextResponse.json({ 
      message: 'Data imported successfully',
      imported: {
        members: members.length,
        songs: songs.length,
        events: events.length,
        setlists: setlists.length
      }
    });
  } catch (error) {
    console.error('POST /api/import - Error:', error);
    return NextResponse.json(
      { error: 'Failed to import data', details: String(error) },
      { status: 500 }
    );
  }
}
