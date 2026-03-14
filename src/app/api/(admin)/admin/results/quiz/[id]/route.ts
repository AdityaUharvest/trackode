import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import Attempted from '@/app/model/Attempted';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing result id' }, { status: 400 });
    }

    await connectDB();

    const result = await Attempted.findById(id)
      .populate('student', 'name email')
      .populate('quiz', 'name')
      .lean();

    if (!result) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Failed to fetch quiz result details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch result details' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing result id' }, { status: 400 });
    }

    const body = await request.json();
    await connectDB();

    const existing = await Attempted.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    const totalQuestions = Number(body?.totalQuestions ?? existing.totalQuestions ?? 0);
    const score = Number(body?.score ?? existing.score ?? 0);

    existing.totalQuestions = Number.isNaN(totalQuestions) ? 0 : Math.max(0, Math.floor(totalQuestions));
    existing.score = Number.isNaN(score) ? 0 : Math.max(0, Math.min(existing.totalQuestions, Math.floor(score)));

    if (typeof body?.correctAnswers === 'number') {
      existing.correctAnswers = Math.max(0, Math.min(existing.totalQuestions, Math.floor(body.correctAnswers)));
    }

    if (typeof body?.incorrectAnswers === 'number') {
      existing.incorrectAnswers = Math.max(0, Math.floor(body.incorrectAnswers));
    }

    if (typeof body?.title === 'string') {
      existing.title = body.title.trim();
    }

    if (body?.attemptedAt) {
      const attemptedAt = new Date(body.attemptedAt);
      if (!Number.isNaN(attemptedAt.getTime())) {
        existing.attemptedAt = attemptedAt;
      }
    }

    await existing.save();

    const updated = await Attempted.findById(id)
      .populate('student', 'name email')
      .populate('quiz', 'name')
      .lean();

    return NextResponse.json({ success: true, result: updated, message: 'Result updated successfully' });
  } catch (error) {
    console.error('Failed to update quiz result:', error);
    return NextResponse.json({ success: false, message: 'Failed to update result' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing result id' }, { status: 400 });
    }

    await connectDB();

    const existing = await Attempted.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    await Attempted.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Failed to delete quiz result:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete result' }, { status: 500 });
  }
}
