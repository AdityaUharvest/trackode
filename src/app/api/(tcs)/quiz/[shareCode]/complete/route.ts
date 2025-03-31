import { NextResponse ,NextRequest} from 'next/server';
import QuizAttempt from '@/app/model/QuizAttempt';
import connectDB from '@/lib/util';
import MockTest from '@/app/model/MockTest';
import { auth } from '@/auth';
export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    const { shareCode } = await params;
    const { answers } = await request.json();
    const session = await auth();
    const quiz = await MockTest.findOne({ shareCode: shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    // Update attempt with completion time
    const attempt = await QuizAttempt.findOneAndUpdate(
      {
        quizId: quiz._id,
        userId: session?.user?.id
         // Replace with actual user ID in a real app
      },
      {
        $set: {
          answers,
          completedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing quiz:', error);
    return NextResponse.json(
      { message: 'Failed to complete quiz' },
      { status: 500 }
    );
  }
}