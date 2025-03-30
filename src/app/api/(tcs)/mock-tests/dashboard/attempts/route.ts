import { NextResponse ,NextRequest} from 'next/server';
import QuizAttempt from '@/app/model/QuizAttempt';
import connectDB from '@/lib/util';
import { auth } from '@/auth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const session= await auth();
    // In a real app, you'd use the authenticated user's ID
    const userId = session?.user?.id;
    
    const attempts = await QuizAttempt.find({ userId })
      .populate('quizId', 'title')
      .sort({ completedAt: -1 })
      .lean();
    
    const formattedAttempts = attempts.map(attempt => ({
      _id: attempt._id,
      quizId: attempt.quizId._id,
      quizTitle: attempt.quizId.title,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      completedAt: attempt.completedAt,
      sectionScores: attempt.sectionScores
    }));
    
    return NextResponse.json(formattedAttempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json(
      { message: 'Failed to fetch attempts' },
      { status: 500 }
    );
  }
}