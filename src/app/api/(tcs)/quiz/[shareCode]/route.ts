import { NextResponse ,NextRequest} from 'next/server';
import MockTest from '@/app/model/MockTest';
import Question from '@/app/model/questions';
import connectDB from '@/lib/util';

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    
    const quiz = await MockTest.findOne({ shareCode: params.shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    const questions = await Question.find({ mockTestId: quiz._id });
    
    return NextResponse.json({ quiz, questions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}