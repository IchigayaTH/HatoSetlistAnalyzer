import { NextRequest, NextResponse } from 'next/server';
import { getAllData, addSetlist, updateSetlist, deleteSetlist } from '@/lib/storage';
import { Setlist } from '@/types';

export async function GET() {
  try {
    const data = getAllData();
    return NextResponse.json(data.setlists);
  } catch (error) {
    console.error('Error fetching setlists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch setlists', details: String(error) },
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
    console.error('Error creating setlist:', error);
    return NextResponse.json(
      { error: 'Failed to create setlist', details: String(error) },
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
    console.error('Error updating setlist:', error);
    return NextResponse.json(
      { error: 'Failed to update setlist', details: String(error) },
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
    console.error('Error deleting setlist:', error);
    return NextResponse.json(
      { error: 'Failed to delete setlist', details: String(error) },
      { status: 400 }
    );
  }
}
