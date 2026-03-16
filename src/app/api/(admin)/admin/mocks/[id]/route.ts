import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import MockTest from '@/app/model/MoockTest';
import { getSuperAdminSession } from '@/lib/superAdmin';

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const payload = await request.json();

    const updates: Record<string, unknown> = {};
    if (typeof payload.title === 'string') {
      updates.title = payload.title.trim();
    }
    if (typeof payload.description === 'string') {
      updates.description = payload.description;
    }
    if (typeof payload.public === 'boolean') {
      updates.public = payload.public;
    }
    if (['Easy', 'Medium', 'Hard'].includes(payload.difficulty)) {
      updates.difficulty = payload.difficulty;
    }
    if (typeof payload.autoSendResults === 'boolean') {
      updates.autoSendResults = payload.autoSendResults;
    }

    const mock = await MockTest.findByIdAndUpdate(id, updates, { new: true });
    if (!mock) {
      return NextResponse.json({ success: false, message: 'Mock not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, mock });
  } catch (error) {
    console.error('Failed to update mock:', error);
    return NextResponse.json({ success: false, message: 'Failed to update mock' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: any) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const deleted = await MockTest.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Mock not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Mock deleted' });
  } catch (error) {
    console.error('Failed to delete mock:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete mock' }, { status: 500 });
  }
}
