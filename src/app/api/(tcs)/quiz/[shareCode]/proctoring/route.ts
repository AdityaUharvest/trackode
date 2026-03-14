import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/util';
import MockTest from '@/app/model/MoockTest';
import QuizAttempt from '@/app/model/QuizAttempt';

type ProctoringEventType = 'fullscreen_exit' | 'tab_hidden' | 'copy_attempt' | 'context_menu';

const incrementKeyByType: Record<ProctoringEventType, string> = {
  fullscreen_exit: 'proctoring.fullscreenExitCount',
  tab_hidden: 'proctoring.tabSwitchCount',
  copy_attempt: 'proctoring.copyAttemptCount',
  context_menu: 'proctoring.contextMenuCount',
};

function isValidEventType(value: unknown): value is ProctoringEventType {
  return typeof value === 'string' && value in incrementKeyByType;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareCode?: string }> }
) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { shareCode } = await params;
    if (!shareCode) {
      return NextResponse.json({ message: 'Missing share code' }, { status: 400 });
    }

    const body = await request.json();
    const eventType = body?.eventType;
    const detail = typeof body?.detail === 'string' ? body.detail.slice(0, 250) : '';

    if (!isValidEventType(eventType)) {
      return NextResponse.json({ message: 'Invalid event type' }, { status: 400 });
    }

    const quiz = await MockTest.findOne({ shareCode }).lean();
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }
    if (!quiz.isPublished) {
      return NextResponse.json({ message: 'Quiz is not published' }, { status: 403 });
    }

    const filter = {
      quizId: quiz._id,
      userId: session.user.id,
      $or: [{ completedAt: null }, { completedAt: { $exists: false } }],
    };

    const now = new Date();

    const activeAttempt = await QuizAttempt.findOne(filter).select({ _id: 1 }).lean();

    if (!activeAttempt) {
      const completedAttempt = await QuizAttempt.findOne({
        quizId: quiz._id,
        userId: session.user.id,
        completedAt: { $ne: null },
      })
        .select({ _id: 1 })
        .lean();

      if (completedAttempt) {
        return NextResponse.json({ success: true, skipped: true });
      }
    }

    await QuizAttempt.findOneAndUpdate(
      filter,
      {
        $inc: { [incrementKeyByType[eventType]]: 1 },
        $set: { 'proctoring.lastViolationAt': now },
        $push: {
          'proctoring.events': {
            type: eventType,
            at: now,
            detail,
          },
        },
        $setOnInsert: {
          quizId: quiz._id,
          userId: session.user.id,
          quizTitle: quiz.title,
          quizDescription: quiz.description,
          startedAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to store proctoring event:', error);
    return NextResponse.json({ message: 'Failed to store proctoring event' }, { status: 500 });
  }
}
