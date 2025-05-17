import { NextResponse, NextRequest } from 'next/server';
import mongoose, { Types } from 'mongoose';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockTest from '@/app/model/MoockTest';
import Question from '@/app/model/MockQuestions';
import { auth } from '@/auth';
import Section from '@/app/model/Section';
import MockResult from '@/app/model/MockResult';

// Define TypeScript interfaces
interface IQuestion {
  _id: Types.ObjectId;
  mockTestId: Types.ObjectId;
  section: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface IQuizAttempt {
  _id: Types.ObjectId;
  userId: string;
  quizId: string;
  quizTitle: string;
  answers: Record<string, Record<string, number>>;
  startedAt: Date;
  completedAt?: Date;
}

interface IMockTest {
  _id: Types.ObjectId;
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

interface IStoredQuestionResult {
  questionId: Types.ObjectId;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

interface IStoredSectionResult {
  sectionName: string;
  correct: number;
  total: number;
  questions: IStoredQuestionResult[];
}

interface IMockResult {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  quizTitle: string;
  attemptId: Types.ObjectId;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  sections: IStoredSectionResult[];
  completedAt: Date;
  overallFeedback?: {
    content: string;
    generatedAt: Date;
  };
  sectionFeedbacks?: Array<{
    sectionName: string;
    feedback: string;
    generatedAt: Date;
  }>;
  questionFeedbacks?: Array<{
    questionId: Types.ObjectId;
    explanation: string;
    generatedAt: Date;
  }>;
}

// Interfaces for populated documents
interface IPopulatedUserId {
  name: string;
  _id: Types.ObjectId;
}

interface IPopulatedQuizId {
  title: string;
  _id: Types.ObjectId;
}

interface IPopulatedMockResult extends Omit<IMockResult, 'userId' | 'quizId'> {
  userId: IPopulatedUserId;
  quizId: IPopulatedQuizId;
}

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = params;
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
    if (!Types.ObjectId.isValid(attemptId)) {
      return NextResponse.json({ error: 'Invalid attempt ID' }, { status: 400 });
    }

    // First check if we already have a stored result
    const existingResult = await MockResult.findOne({ 
      attemptId: new Types.ObjectId(attemptId)
    }).populate<{ userId: IPopulatedUserId, quizId: IPopulatedQuizId }>('userId quizId')
      .lean() as IPopulatedMockResult | null;

    if (existingResult) {
      // Get all questions to populate text, options, and explanations
      const allQuestions = await Question.find({ 
        mockTestId: existingResult.quizId._id 
      }).lean<IQuestion[]>();

      // Create a map for quick lookup
      const questionsMap = new Map<string, IQuestion>();
      allQuestions.forEach(question => {
        questionsMap.set(question._id.toString(), question);
      });

      // Transform the stored result
      const transformedResult = {
        userName: existingResult.userId.name || 'User',
        quizTitle: existingResult.quizTitle,
        completedAt: existingResult.completedAt,
        totalScore: existingResult.totalScore,
        totalQuestions: existingResult.totalQuestions,
        sections: existingResult.sections.map((section) => ({
          sectionName: section.sectionName,
          correct: section.correct,
          total: section.total,
          questions: section.questions.map((q) => {
            const questionData = questionsMap.get(q.questionId.toString());
            return {
              _id: q.questionId.toString(),
              text: questionData?.text || '',
              options: questionData?.options || [],
              userAnswer: q.userAnswer,
              correctAnswer: q.correctAnswer,
              explanation: questionData?.explanation || ''
            };
          })
        })),
        overallFeedback: existingResult.overallFeedback?.content || null,
        sectionFeedbacks: existingResult.sectionFeedbacks || [],
        questionFeedbacks: existingResult.questionFeedbacks || []
      };

      return NextResponse.json(transformedResult);
    }

    // If no existing result, proceed with calculation
    const attempt = await QuizAttempt.findOne({ 
      _id: new Types.ObjectId(attemptId), 
      userId 
    }).lean<IQuizAttempt>();
    
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
    const sections = await Section.find();
    const sectionNames = sections.map(section => section.value);

    const sectionResults: ISectionResult[] = sectionNames.map((sectionName) => {
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
    const percentage = Math.round((totalScore / totalQuestions) * 100);

    // Construct the response
    const result = {
      userName: session.user.name || 'User',
      quizTitle: attempt.quizTitle,
      completedAt: attempt.completedAt,
      totalScore,
      totalQuestions,
      sections: sectionResults,
      overallFeedback: null,
      sectionFeedbacks: [],
      questionFeedbacks: []
    };

    // Store the result in database for future requests
    await MockResult.create({
      userId: new Types.ObjectId(userId),
      quizId: new Types.ObjectId(quizId),
      quizTitle: attempt.quizTitle,
      attemptId: new Types.ObjectId(attemptId),
      totalScore,
      totalQuestions,
      percentage,
      sections: sectionResults.map((section) => ({
        sectionName: section.sectionName,
        correct: section.correct,
        total: section.total,
        questions: section.questions.map((q) => ({
          questionId: new Types.ObjectId(q._id),
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: q.userAnswer === q.correctAnswer
        }))
      })),
      completedAt: attempt.completedAt || new Date(),
      overallFeedback: undefined,
      sectionFeedbacks: undefined,
      questionFeedbacks: undefined
    } as IMockResult);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching user quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}