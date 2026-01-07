import { NextRequest, NextResponse } from 'next/server';
import { getAllData, addSetlist, updateSetlist, deleteSetlist } from '@/lib/storage';
import { Setlist } from '@/types';

export async function GET() {
  try {
    const data = getAllData();
    return NextResponse.json(data.setlists);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch setlists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const setlist: Setlist = await request.json();
    const data = addSetlist(setlist);
    return NextResponse.json(data.setlists, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create setlist' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const setlist: Setlist = await request.json();
    const data = updateSetlist(setlist);
    return NextResponse.json(data.setlists);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update setlist' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { setlistId } = await request.json();
    const data = deleteSetlist(setlistId);
    return NextResponse.json(data.setlists);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete setlist' },
      { status: 400 }
    );
  }
}
