import { NextResponse ,NextRequest} from 'next/server';
import MockTest from '@/app/model/MoockTest';
import Question from '@/app/model/MockQuestions';
import connectDB from '@/lib/util';
import { auth } from '@/auth';

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

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    
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
    
    const questions = await Question.find({ mockTestId: quiz._id }).lean();
    const shuffledQuestions = shuffleArray(questions);

    const safeQuestions = shuffledQuestions.map((question: any) => ({
      _id: question._id,
      section: question.section,
      text: question.text,
      options: question.options,
    }));
    
    return NextResponse.json({ quiz, questions: safeQuestions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}