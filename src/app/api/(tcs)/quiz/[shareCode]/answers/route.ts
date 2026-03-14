import { NextResponse ,NextRequest} from 'next/server';
import QuizAttempt from '@/app/model/QuizAttempt';
import connectDB from '@/lib/util';
import MockTest from '@/app/model/MoockTest';
import Question from '@/app/model/MockQuestions';
import { auth } from '@/auth';

function hasUnsafeMongoPathChars(value: string): boolean {
  return value.includes('.') || value.includes('$');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareCode?: string }> }
) {
  try {
    await connectDB();
    const { shareCode } = await params;
    if (!shareCode) {
      return NextResponse.json(
        { message: 'Missing share code' },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { section, answers } = await request.json();
    if (typeof section !== 'string' || !section.trim() || !answers || typeof answers !== 'object') {
      return NextResponse.json(
        { message: 'Invalid section answers payload' },
        { status: 400 }
      );
    }
    const sectionName = section.trim();
    if (hasUnsafeMongoPathChars(sectionName)) {
      return NextResponse.json(
        { message: 'Invalid section name' },
        { status: 400 }
      );
    }
    
    // In a real app, you'd want to authenticate the user
    const quiz = await MockTest.findOne({ shareCode: shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }
    if (!quiz.isPublished) {
      return NextResponse.json(
        { message: 'Quiz is not published' },
        { status: 403 }
      );
    }

    // Reject saves once the quiz duration has fully expired for this user's attempt
    const existingAttempt = await QuizAttempt.findOne({
      quizId: quiz._id,
      userId,
      $or: [{ completedAt: null }, { completedAt: { $exists: false } }],
    }).select({ startedAt: 1 }).lean<{ startedAt?: Date }>();

    // Block entirely if the user already has a completed attempt for this quiz.
    const alreadyCompleted = await QuizAttempt.exists({
      quizId: quiz._id,
      userId,
      completedAt: { $ne: null },
    });
    if (alreadyCompleted) {
      return NextResponse.json(
        { message: 'Quiz already completed' },
        { status: 409 }
      );
    }

    if (existingAttempt?.startedAt && quiz.durationMinutes) {
      const expiredAt = new Date(existingAttempt.startedAt).getTime() + (quiz.durationMinutes as number) * 60 * 1000;
      if (Date.now() > expiredAt) {
        return NextResponse.json(
          { message: 'Quiz time has expired' },
          { status: 410 }
        );
      }
    }

    const sectionQuestions = await Question.find({ mockTestId: quiz._id })
      .select({ _id: 1, section: 1, options: 1 })
      .lean<Array<{ _id: unknown; section?: string; options?: string[] }>>();

    const normalizedSection = sectionName.toLowerCase();
    const questionMetaById = new Map<string, { optionCount: number }>();

    sectionQuestions.forEach((question) => {
      const questionSection = (question.section || '').trim().toLowerCase();
      if (questionSection !== normalizedSection) return;

      questionMetaById.set(String(question._id), {
        optionCount: Array.isArray(question.options) ? question.options.length : 0,
      });
    });

    const setUpdates: Record<string, number> = {};
    for (const [questionId, answerIndex] of Object.entries(answers)) {
      if (hasUnsafeMongoPathChars(questionId)) continue;
      if (typeof answerIndex !== 'number' || !Number.isInteger(answerIndex)) continue;

      const questionMeta = questionMetaById.get(questionId);
      if (!questionMeta) continue;
      if (answerIndex < 0 || answerIndex >= questionMeta.optionCount) continue;

      setUpdates[`answers.${sectionName}.${questionId}`] = answerIndex;
    }

    if (Object.keys(setUpdates).length === 0) {
      return NextResponse.json(
        { message: 'No valid answers to save' },
        { status: 400 }
      );
    }

    const filter = {
      quizId: quiz._id,
      userId,
      $or: [{ completedAt: null }, { completedAt: { $exists: false } }]
    };
    const update = {
      $set: setUpdates,
      $setOnInsert: {
        quizId: quiz._id,
        userId,
        quizTitle: quiz.title,
        quizDescription: quiz.description,
        startedAt: new Date()
      }
    };

    try {
      await QuizAttempt.findOneAndUpdate(filter, update, { upsert: true, new: true });
    } catch (writeError: any) {
      if (writeError?.code === 11000) {
        await QuizAttempt.updateOne(filter, { $set: setUpdates });
      } else {
        throw writeError;
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving answers:', error);
    return NextResponse.json(
      { message: 'Failed to save answers' },
      { status: 500 }
    );
  }
} 