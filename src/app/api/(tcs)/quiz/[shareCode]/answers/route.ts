import { NextResponse ,NextRequest} from 'next/server';
import QuizAttempt from '@/app/model/QuizAttempt';
import connectDB from '@/lib/util';
import MockTest from '@/app/model/MoockTest';
import { auth } from '@/auth';

function hasUnsafeMongoPathChars(value: string): boolean {
  return value.includes('.') || value.includes('$');
}

export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    const {shareCode} =await params;
    const session = await auth();
    const { section, answers } = await request.json();
    
    // In a real app, you'd want to authenticate the user
    const quiz = await MockTest.findOne({ shareCode: shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }
    const setUpdates: Record<string, number> = {};
    for (const [questionId, answerIndex] of Object.entries(answers)) {
      if (hasUnsafeMongoPathChars(questionId)) continue;
      if (typeof answerIndex !== 'number' || !Number.isInteger(answerIndex)) continue;
      setUpdates[`answers.${section}.${questionId}`] = answerIndex;
    }

    if (Object.keys(setUpdates).length === 0) {
      return NextResponse.json(
        { message: 'No valid answers to save' },
        { status: 400 }
      );
    }

    const filter = {
      quizId: quiz._id,
      userId: session.user.id
    };
    const update = {
      $set: setUpdates,
      $setOnInsert: {
        quizId: quiz._id,
        userId: session.user.id,
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