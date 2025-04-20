import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockTest from '@/app/model/MoockTest';
import Question from '@/app/model/MockQuestions';
import { auth } from '@/auth';
import Section from '@/app/model/Section';
// Define TypeScript interfaces for your models
interface IQuestion {
  _id: mongoose.Types.ObjectId;
  mockTestId: mongoose.Types.ObjectId;
  section: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface IQuizAttempt {
  _id: mongoose.Types.ObjectId;
  userId: string;
  quizId: string;
  quizTitle: string;
  answers: Record<string, Record<string, number>>;
  startedAt: Date;
  completedAt?: Date;
}

interface IMockTest {
  _id: mongoose.Types.ObjectId;
  title: string;
}

interface IQuestionResult {
  _id: string;
  text: string;
  options: string[];
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}

interface ISectionResult {
  sectionName: string;
  correct: number;
  total: number;
  questions: IQuestionResult[];
}

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;  // Removed await since params is synchronous
    const attemptId = id;
    
    // Get current session user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Validate attemptId
    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return NextResponse.json({ error: 'Invalid attempt ID' }, { status: 400 });
    }

    // Get the attempt with proper typing
    const attempt = await QuizAttempt.findOne({ _id: attemptId, userId }).lean<IQuizAttempt>();
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    const quizId = attempt.quizId;
    const quiz = await MockTest.findById(quizId).lean<IMockTest>();
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Get all questions for this quiz with explanations
    const allQuestions = await Question.find({ mockTestId: quizId }).lean<IQuestion[]>();
    const questionsMap = new Map<string, IQuestion>();
    allQuestions.forEach(question => {
      questionsMap.set(question._id.toString(), question);
    });

    // Process section-wise results with question details
    const section = await Section.find();
    
    let sections=<any>[]
    for(let i =0;i<section.length;i++){
      sections.push(section[i].value);
    }
    


    const sectionResults: ISectionResult[] = sections.map((sectionName:any) => {
      const sectionAnswers = attempt.answers[sectionName] || {};
      const sectionQuestions = allQuestions.filter(q => q.section === sectionName);
      
      const questions = Object.entries(sectionAnswers)
        .map(([questionId, userAnswerIndex]): IQuestionResult | null => {
          const question = questionsMap.get(questionId);
          if (!question) return null;

          return {
            _id: question._id.toString(),
            text: question.text,
            options: question.options,
            userAnswer: userAnswerIndex,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || ''
          };
        })
        .filter((q): q is IQuestionResult => q !== null);

      const correct = questions.reduce((sum, q) => sum + (q.userAnswer === q.correctAnswer ? 1 : 0), 0);
      const total = sectionQuestions.length;

      return {
        sectionName,
        correct,
        total,
        questions
      };
    });

    // Calculate totals
    const totalScore = sectionResults.reduce((sum, section) => sum + section.correct, 0);
    const totalQuestions = allQuestions.length;

    // Construct the response
    const result = {
      userName: session.user.name || 'User',
      quizTitle: attempt.quizTitle,
      completedAt: attempt.completedAt,
      totalScore,
      totalQuestions,
      sections: sectionResults
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching user quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}