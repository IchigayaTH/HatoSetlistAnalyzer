import { NextRequest, NextResponse } from 'next/server';
import { getAllData, addEvent, updateEvent, deleteEvent } from '@/lib/storage';
import { Event } from '@/types';

export async function GET() {
  try {
    const data = getAllData();
    return NextResponse.json(data.events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: String(error) },
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
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event', details: String(error) },
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
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: String(error) },
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
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event', details: String(error) },
      { status: 400 }
    );
  }
}
