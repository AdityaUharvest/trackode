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
    const {shareCode} =await params;
    const session = await auth();
    const { section, answers } = await request.json();
    console.log(section, answers)
    // In a real app, you'd want to authenticate the user
    const quiz = await MockTest.findOne({ shareCode: shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    
    let attempt = await QuizAttempt.findOne({
      quizId: quiz._id,
      userId:session?.user?.id  // Replace with actual user ID in a real app
    });
    
    if (!attempt) {
      attempt = new QuizAttempt({
        quizId: quiz._id,
        userId: session?.user?.id, 
        quizTitle: quiz.title,
        quizDescription: quiz.description,
        startedAt: new Date(),
        answers: {}
      });
    }
    
    // Update answers for this section
    attempt.answers[section] = answers;
    console.log(attempt.answers)
    await attempt.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving answers:', error);
    return NextResponse.json(
      { message: 'Failed to save answers' },
      { status: 500 }
    );
  }
}