import { NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import Quiz from '@/app/model/Quiz';
import { getSuperAdminSession } from '@/lib/superAdmin';

export async function POST(_request: Request, { params }: any) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ success: false, message: 'Quiz not found' }, { status: 404 });
    }

    quiz.active = !quiz.active;
    await quiz.save();

    return NextResponse.json({
      success: true,
      message: quiz.active ? 'Quiz published' : 'Quiz unpublished',
      quiz,
    });
  } catch (error) {
    console.error('Failed to toggle quiz status:', error);
    return NextResponse.json({ success: false, message: 'Failed to toggle quiz' }, { status: 500 });
  }
}
