import { NextResponse ,NextRequest} from 'next/server';
import MockTest from '@/app/model/MoockTest';
import Question from '@/app/model/MockQuestions';
import connectDB from '@/lib/util';

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    const { shareCode } = await params;

    
    const quiz = await MockTest.findOne({ shareCode: shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    const questions = await Question.find({ mockTestId: quiz._id }).lean();
    const shuffledQuestions = shuffleArray(questions);
    
    return NextResponse.json({ quiz, questions: shuffledQuestions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}