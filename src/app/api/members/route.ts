import { NextRequest, NextResponse } from 'next/server';
import { getAllData, addMember, updateMember, deleteMember } from '@/lib/storage';
import { Member } from '@/types';

export async function GET() {
  try {
    const data = getAllData();
    return NextResponse.json(data.members);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const member: Member = await request.json();
    const data = addMember(member);
    return NextResponse.json(data.members, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const member: Member = await request.json();
    const data = updateMember(member);
    return NextResponse.json(data.members);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { memberId } = await request.json();
    const data = deleteMember(memberId);
    return NextResponse.json(data.members);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 400 }
    );
  }
}
