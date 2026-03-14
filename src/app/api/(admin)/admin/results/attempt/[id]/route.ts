import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import QuizAttempt from '@/app/model/QuizAttempt';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing attempt id' }, { status: 400 });
    }

    await connectDB();

    const existing = await QuizAttempt.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Attempt not found' }, { status: 404 });
    }

    await QuizAttempt.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Attempt deleted successfully' });
  } catch (error) {
    console.error('Failed to delete mock attempt:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete attempt' }, { status: 500 });
  }
}
