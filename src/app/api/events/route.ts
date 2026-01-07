import { NextRequest, NextResponse } from 'next/server';
import { getAllData, addEvent, updateEvent, deleteEvent } from '@/lib/storage';
import { Event } from '@/types';

export async function GET() {
  try {
    const data = getAllData();
    return NextResponse.json(data.events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const event: Event = await request.json();
    const data = addEvent(event);
    return NextResponse.json(data.events, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const event: Event = await request.json();
    const data = updateEvent(event);
    return NextResponse.json(data.events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { eventId } = await request.json();
    const data = deleteEvent(eventId);
    return NextResponse.json(data.events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 400 }
    );
  }
}
