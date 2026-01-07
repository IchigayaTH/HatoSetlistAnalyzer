import { NextRequest, NextResponse } from 'next/server';
import { getAllData, addSong, updateSong, deleteSong } from '@/lib/storage';
import { Song } from '@/types';

export async function GET() {
  try {
    const data = getAllData();
    return NextResponse.json(data.songs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const song: Song = await request.json();
    const data = addSong(song);
    return NextResponse.json(data.songs, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create song' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const song: Song = await request.json();
    const data = updateSong(song);
    return NextResponse.json(data.songs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update song' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { songId } = await request.json();
    const data = deleteSong(songId);
    return NextResponse.json(data.songs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete song' },
      { status: 400 }
    );
  }
}
