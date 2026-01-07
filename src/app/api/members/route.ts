import { NextRequest, NextResponse } from 'next/server';
import { getAllData, addMember, updateMember, deleteMember } from '@/lib/storage';
import { Member } from '@/types';

export async function GET() {
  try {
    const data = await getAllData();
    console.log('GET /api/members - Returning', data.members.length, 'members');
    return NextResponse.json(data.members);
  } catch (error) {
    console.error('GET /api/members - Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const member: Member = await request.json();
    console.log('POST /api/members - Adding member:', member.id);
    const data = await addMember(member);
    console.log('POST /api/members - Success, now have', data.members.length, 'members');
    return NextResponse.json(data.members, { status: 201 });
  } catch (error) {
    console.error('POST /api/members - Error:', error);
    return NextResponse.json(
      { error: 'Failed to create member', details: String(error) },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const member: Member = await request.json();
    console.log('PUT /api/members - Updating member:', member.id);
    const data = await updateMember(member);
    console.log('PUT /api/members - Success');
    return NextResponse.json(data.members);
  } catch (error) {
    console.error('PUT /api/members - Error:', error);
    return NextResponse.json(
      { error: 'Failed to update member', details: String(error) },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { memberId } = await request.json();
    console.log('DELETE /api/members - Deleting member:', memberId);
    const data = await deleteMember(memberId);
    console.log('DELETE /api/members - Success, now have', data.members.length, 'members');
    return NextResponse.json(data.members);
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member', details: String(error) },
      { status: 400 }
    );
  }
}
