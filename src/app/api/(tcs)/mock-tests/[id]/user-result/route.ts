import { NextResponse, NextRequest } from 'next/server';
import mongoose, { Types } from 'mongoose';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockTest from '@/app/model/MoockTest';
import Question from '@/app/model/MockQuestions';
import { auth } from '@/auth';
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
  durationMinutes: number;
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

function normalizeSectionName(sectionName: string): string {
  return (sectionName || '').trim().toLowerCase();
}

function buildSectionNameMap(allQuestions: IQuestion[], attemptAnswers: Record<string, Record<string, number>> = {}) {
  const canonicalByNormalized = new Map<string, string>();

  allQuestions.forEach((question) => {
    const normalized = normalizeSectionName(question.section);
    if (normalized && !canonicalByNormalized.has(normalized)) {
      canonicalByNormalized.set(normalized, question.section);
    }
  });

  Object.keys(attemptAnswers).forEach((sectionName) => {
    const normalized = normalizeSectionName(sectionName);
    if (normalized && !canonicalByNormalized.has(normalized)) {
      canonicalByNormalized.set(normalized, sectionName);
    }
  });

  return canonicalByNormalized;
}

function computeSectionResults(
  allQuestions: IQuestion[],
  questionsMap: Map<string, IQuestion>,
  attemptAnswers: Record<string, Record<string, number>> = {}
): ISectionResult[] {
  const canonicalByNormalized = buildSectionNameMap(allQuestions, attemptAnswers);

  return Array.from(canonicalByNormalized.entries()).map(([normalizedSectionName, canonicalSectionName]) => {
    const sectionAnswers = Object.entries(attemptAnswers).reduce<Record<string, number>>((acc, [rawSectionName, answersByQuestion]) => {
      if (normalizeSectionName(rawSectionName) === normalizedSectionName) {
        return { ...acc, ...(answersByQuestion || {}) };
      }
      return acc;
    }, {});

    const sectionQuestions = allQuestions.filter((q) => normalizeSectionName(q.section) === normalizedSectionName);
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

    return {
      sectionName: canonicalSectionName,
      correct,
      total: sectionQuestions.length,
      questions
    };
  }).sort((a, b) => a.sectionName.localeCompare(b.sectionName));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    
    const { id: attemptId } = await params;
    if (!attemptId || attemptId === 'undefined' || attemptId === 'null') {
      return NextResponse.json({ error: 'Missing attempt ID' }, { status: 400 });
    }
    
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

    // Auto-complete the attempt if the quiz duration has elapsed and it was never completed
    // (covers tab-close / network-drop abandonment where /complete was never called)
    let effectiveAttempt: IQuizAttempt = attempt;
    if (!attempt.completedAt && attempt.startedAt && quiz.durationMinutes) {
      const expiredAt = new Date(attempt.startedAt).getTime() + (quiz.durationMinutes as number) * 60 * 1000;
      if (Date.now() > expiredAt) {
        const autoCompletedAt = new Date();
        await QuizAttempt.updateOne(
          { _id: new Types.ObjectId(attemptId) },
          { $set: { completedAt: autoCompletedAt } }
        );
        effectiveAttempt = { ...attempt, completedAt: autoCompletedAt };
      }
    }

    if (!effectiveAttempt.completedAt) {
      return NextResponse.json({ error: 'Result is available only after quiz completion' }, { status: 409 });
    }

    // Get all questions for this quiz with explanations
    const allQuestions = await Question.find({ mockTestId: quizId }).lean<IQuestion[]>();
    const questionsMap = new Map<string, IQuestion>();
    allQuestions.forEach(question => {
      questionsMap.set(question._id.toString(), question);
    });

    const sectionResults = computeSectionResults(allQuestions, questionsMap, effectiveAttempt.answers || {});

    // Calculate totals
    const totalScore = sectionResults.reduce((sum, section) => sum + section.correct, 0);
    const totalQuestions = allQuestions.length;
    const percentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    // Construct the response
    const result = {
      quizId: String(quizId),
      attemptId: String(attemptId),
      userName: session.user.name || 'User',
      quizTitle: effectiveAttempt.quizTitle,
      completedAt: effectiveAttempt.completedAt,
      totalScore,
      totalQuestions,
      sections: sectionResults,
      overallFeedback: existingResult?.overallFeedback?.content || null,
      sectionFeedbacks: existingResult?.sectionFeedbacks || [],
      questionFeedbacks: existingResult?.questionFeedbacks || []
    };

    await MockResult.findOneAndUpdate(
      { attemptId: new Types.ObjectId(attemptId) },
      {
        $set: {
          userId: new Types.ObjectId(userId),
          quizId: new Types.ObjectId(quizId),
          quizTitle: effectiveAttempt.quizTitle,
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
          completedAt: effectiveAttempt.completedAt
        },
        $setOnInsert: {
          attemptId: new Types.ObjectId(attemptId)
        }
      },
      { upsert: true }
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching user quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}