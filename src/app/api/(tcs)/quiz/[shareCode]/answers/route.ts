import { NextResponse, NextRequest } from 'next/server';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockTest from '@/app/model/MoockTest';
import connectDB from '@/lib/util';
import { auth } from '@/auth';


export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    const { shareCode } = params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { section, answers, timeSpent, isSectionComplete } = await request.json();
    
    // Validate input
    if (!section || !answers || typeof timeSpent !== 'number') {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const quiz = await MockTest.findOne({ shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get client information for analytics
    

    let attempt = await QuizAttempt.findOne({
      quizId: quiz._id,
      userId: session.user.id,
      isCompleted: false
    });

    // Create new attempt if doesn't exist
    if (!attempt) {
      attempt = new QuizAttempt({
        quizId: quiz._id,
        userId: session.user.id,
        userName: session.user.name,
        email: session.user.email,
        quizTitle: quiz.title,
        quizDescription: quiz.description,
        quizType: quiz.type,
        quizDuration: quiz.durationMinutes,
        totalQuestions: quiz.questions?.length || 0,
        startedAt: new Date(),
        answers: {},
        sectionTimes: quiz.sections?.map((s: any) => ({
          sectionName: s.name,
          timeSpent: 0,
          timeLimit: s.timeLimit,
          completed: false
        })),
        
      });
    }

    // Update answers for this section
    attempt.answers[section] = answers;
    attempt.lastActivityAt = new Date();

    // Update section time tracking
    const sectionIndex = attempt.sectionTimes.findIndex(
      (s: any) => s.sectionName === section
    );
    
    if (sectionIndex >= 0) {
      attempt.sectionTimes[sectionIndex].timeSpent = timeSpent;
      attempt.sectionTimes[sectionIndex].completed = isSectionComplete || false;
    }

    // Update current section if moving to a new one
    if (isSectionComplete) {
      const nextSection = quiz.sections?.find(
        (s: any, i: number, arr: any[]) => 
          s.name === section && i < arr.length - 1
      )?.name;
      
      if (nextSection) {
        attempt.currentSection = nextSection;
      }
    }

    // Calculate total time spent
    attempt.timeSpent = Math.floor(
      (attempt.lastActivityAt.getTime() - attempt.startedAt.getTime()) / 1000
    );

    await attempt.save();

    return NextResponse.json({ 
      success: true,
      currentSection: attempt.currentSection
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { message: 'Failed to save quiz progress' },
      { status: 500 }
    );
  }
}

export async function PUT(this: any, 
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    const { shareCode } = params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const quiz = await MockTest.findOne({ shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    const attempt = await QuizAttempt.findOneAndUpdate(
      {
        quizId: quiz._id,
        userId: session.user.id,
        isCompleted: false
      },
      {
        isCompleted: true,
        completedAt: new Date(),
        timeSpent: Math.floor((new Date().getTime() - this.startedAt.getTime()) / 1000)
      },
      { new: true }
    );

    if (!attempt) {
      return NextResponse.json(
        { message: 'No active attempt found' },
        { status: 404 }
      );
    }

    // Calculate score and other analytics
    const score = calculateScore(attempt.answers, quiz.questions);
    
    return NextResponse.json({ 
      success: true,
      score,
      timeSpent: attempt.timeSpent
    });
  } catch (error) {
    console.error('Error completing quiz:', error);
    return NextResponse.json(
      { message: 'Failed to complete quiz' },
      { status: 500 }
    );
  }
}

// Helper function to calculate score
function calculateScore(answers: Record<string, any>, questions: any[]) {
  let correct = 0;
  let total = 0;

  Object.entries(answers).forEach(([section, sectionAnswers]) => {
    Object.entries(sectionAnswers).forEach(([questionId, answerIndex]) => {
      const question = questions.find(q => q._id.toString() === questionId);
      if (question && question.correctAnswer === answerIndex) {
        correct++;
      }
      total++;
    });
  });

  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0
  };
}