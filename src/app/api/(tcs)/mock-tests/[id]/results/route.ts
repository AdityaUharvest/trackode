import { NextResponse, NextRequest } from 'next/server';
import mongoose, { Types } from 'mongoose';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockTest from '@/app/model/MoockTest';
import User from '@/app/model/User';
import Question from '@/app/model/MockQuestions';
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

interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

interface IQuizAttempt {
  _id: Types.ObjectId;
  userId: string;
  quizId: string;
  quizTitle: string;
  answers: Record<string, Record<string, number>>;
  startedAt: Date;
  completedAt?: Date;
  updatedAt?: Date;
}

interface IMockTest {
  _id: Types.ObjectId;
  title: string;
  createdBy: string;
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
    const { id } = await params;
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json({ error: 'Missing quiz ID' }, { status: 400 });
    }
    const quizId = id;

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Validate quizId
    if (!Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    // Get quiz details
    const quiz = await MockTest.findById(quizId).lean<IMockTest>();
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Fetch all questions
    const allQuestions = await Question.find({ mockTestId: quizId }).lean<IQuestion[]>();
    const questionsMap = new Map<string, IQuestion>();
    allQuestions.forEach(question => {
      questionsMap.set(question._id.toString(), question);
    });

    // Get all attempts
    const attempts = await QuizAttempt.find({ quizId }).lean<IQuizAttempt[]>();
    if (!attempts.length) {
      return NextResponse.json({
        quizId,
        quizTitle: quiz.title,
        totalParticipants: 0,
        attempts: [],
        createdBy: quiz.createdBy,
      });
    }

    // Get all unique user IDs
    const userIds = [...new Set(attempts.map(attempt => attempt.userId))];
    const users = await User.find({ 
      _id: { $in: userIds.map(id => new Types.ObjectId(id)) }
    }).lean<IUser[]>();
    const userMap = new Map<string, { name: string; email: string }>();
    users.forEach(user => {
      userMap.set(user._id.toString(), { name: user.name, email: user.email });
    });

    const results = await Promise.all(attempts.map(async (attempt) => {
      const objectIdTimestamp = new Types.ObjectId(attempt._id).getTimestamp();
      const safeStartedAt = attempt.startedAt || objectIdTimestamp;
      // For in-progress attempts, use last activity (updatedAt) or current time as end marker.
      const safeCompletedAt = attempt.completedAt || attempt.updatedAt || new Date();
      const sectionResults = computeSectionResults(allQuestions, questionsMap, attempt.answers || {});

      const totalScore = sectionResults.reduce((sum, section) => sum + section.correct, 0);
      const totalQuestions = allQuestions.length;
      const percentage = Math.round((totalScore / totalQuestions) * 100);
      const totalAnswered = sectionResults.reduce((sum, section) => sum + section.questions.length, 0);

      await MockResult.findOneAndUpdate(
        { attemptId: new Types.ObjectId(attempt._id) },
        {
          $set: {
            userId: new Types.ObjectId(attempt.userId),
            quizId: new Types.ObjectId(quizId),
            quizTitle: attempt.quizTitle,
            totalScore,
            totalQuestions,
            percentage,
            sections: sectionResults.map(section => ({
              sectionName: section.sectionName,
              correct: section.correct,
              total: section.total,
              questions: section.questions.map(q => ({
                questionId: new Types.ObjectId(q._id),
                userAnswer: q.userAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect: q.userAnswer === q.correctAnswer
              }))
            })),
            completedAt: safeCompletedAt
          },
          $setOnInsert: {
            attemptId: new Types.ObjectId(attempt._id)
          }
        },
        { upsert: true }
      );

      const userDetails = userMap.get(attempt.userId) || { name: 'Unknown', email: '' };

      return {
        _id: attempt._id.toString(),
        userId: attempt.userId,
        userName: userDetails.name,
        email: userDetails.email,
        quizTitle: attempt.quizTitle,
        startedAt: safeStartedAt,
        completedAt: safeCompletedAt,
        totalAnswered,
        totalCorrect: totalScore,
        totalQuestions,
        accuracy: percentage,
        sectionStats: sectionResults.map(section => ({
          sectionName: section.sectionName,
          answered: section.questions.length,
          correct: section.correct,
          totalQuestions: section.total
        }))
      };
    }));

    // Sort by most recently completed first
    results.sort((a, b) => 
      (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
    );

    return NextResponse.json({
      quizId,
      quizTitle: quiz.title,
      totalParticipants: results.length,
      attempts: results,
      createdBy: quiz.createdBy,
    });

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}