import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import QuizAttempt from '@/app/model/QuizAttempt';
import Question from '@/app/model/MockQuestions';
import { countAnsweredQuestions, countCorrectAnswers, getSafePercentage, resolveAttemptLifecycle, sumProctoringFlags } from '@/lib/mockAttemptMonitoring';

type AttemptDocument = {
  _id: Types.ObjectId;
  quizId: Types.ObjectId | string;
  userId?: string;
  userName?: string;
  email?: string;
  quizTitle?: string;
  startedAt?: Date;
  completedAt?: Date | null;
  updatedAt?: Date;
  answers?: Record<string, Record<string, number>>;
  quizDuration?: number;
  proctoring?: {
    fullscreenExitCount?: number;
    tabSwitchCount?: number;
    copyAttemptCount?: number;
    contextMenuCount?: number;
  };
};

type QuestionDocument = {
  _id: Types.ObjectId;
  mockTestId: Types.ObjectId;
  correctAnswer: number;
};

function parsePagination(request: NextRequest) {
  const pageParam = Number.parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
  const limitParam = Number.parseInt(request.nextUrl.searchParams.get('limit') || '25', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 25;
  return { page, limit };
}

export async function GET(request: NextRequest) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { page, limit } = parsePagination(request);
    const query = (request.nextUrl.searchParams.get('q') || '').trim().toLowerCase();
    const now = new Date();

    const attempts = await QuizAttempt.find({
      $or: [{ completedAt: null }, { completedAt: { $exists: false } }],
    })
      .sort({ updatedAt: -1, startedAt: -1 })
      .lean<AttemptDocument[]>();

    if (!attempts.length) {
      return NextResponse.json({
        success: true,
        items: [],
        summary: {
          liveAttempts: 0,
          avgAnswered: 0,
          avgProgress: 0,
          totalFlags: 0,
        },
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    const quizIds = Array.from(
      new Set(
        attempts
          .map((attempt) => String(attempt.quizId || ''))
          .filter((id) => Types.ObjectId.isValid(id))
      )
    ).map((id) => new Types.ObjectId(id));

    const questions = quizIds.length
      ? await Question.find({ mockTestId: { $in: quizIds } })
          .select({ _id: 1, mockTestId: 1, correctAnswer: 1 })
          .lean<QuestionDocument[]>()
      : [];

    const questionMetaByQuizId = questions.reduce((acc, question) => {
      const quizId = String(question.mockTestId);
      if (!acc.has(quizId)) {
        acc.set(quizId, {
          totalQuestions: 0,
          correctAnswerByQuestionId: new Map<string, number>(),
        });
      }

      const entry = acc.get(quizId)!;
      entry.totalQuestions += 1;
      entry.correctAnswerByQuestionId.set(String(question._id), question.correctAnswer);
      return acc;
    }, new Map<string, { totalQuestions: number; correctAnswerByQuestionId: Map<string, number> }>());

    const liveAttempts = attempts
      .map((attempt) => {
        const lifecycle = resolveAttemptLifecycle({
          startedAt: attempt.startedAt,
          lastActivityAt: attempt.updatedAt || attempt.startedAt,
          completedAt: attempt.completedAt,
          quizDurationMinutes: attempt.quizDuration,
          now,
        });

        if (lifecycle.status !== 'in-progress') {
          return null;
        }

        const quizMeta = questionMetaByQuizId.get(String(attempt.quizId)) || {
          totalQuestions: 0,
          correctAnswerByQuestionId: new Map<string, number>(),
        };
        const answeredCount = countAnsweredQuestions(attempt.answers || {});
        const currentScore = countCorrectAnswers(attempt.answers || {}, quizMeta.correctAnswerByQuestionId);
        const progressPercentage = getSafePercentage(answeredCount, quizMeta.totalQuestions);
        const accuracyPercentage = getSafePercentage(currentScore, answeredCount);
        const scorePercentage = getSafePercentage(currentScore, quizMeta.totalQuestions);
        const flags = sumProctoringFlags(attempt.proctoring);

        return {
          _id: String(attempt._id),
          quizId: String(attempt.quizId || ''),
          quizTitle: attempt.quizTitle || 'Untitled Mock',
          userId: attempt.userId || '',
          user: {
            name: attempt.userName || 'Unknown',
            email: attempt.email || '',
          },
          startedAt: lifecycle.startedAt?.toISOString(),
          lastActivityAt: lifecycle.lastActivityAt?.toISOString(),
          expectedEndAt: lifecycle.expectedEndAt?.toISOString(),
          answeredCount,
          currentScore,
          totalQuestions: quizMeta.totalQuestions,
          progressPercentage,
          scorePercentage,
          accuracyPercentage,
          fullscreenExitCount: flags.fullscreenExitCount,
          tabSwitchCount: flags.tabSwitchCount,
          copyAttemptCount: flags.copyAttemptCount,
          contextMenuCount: flags.contextMenuCount,
          proctoringFlags: flags.total,
        };
      })
      .filter((attempt): attempt is NonNullable<typeof attempt> => Boolean(attempt));

    const filteredAttempts = query
      ? liveAttempts.filter((attempt) => {
          const userName = (attempt.user.name || '').toLowerCase();
          const email = (attempt.user.email || '').toLowerCase();
          const quizTitle = (attempt.quizTitle || '').toLowerCase();
          return userName.includes(query) || email.includes(query) || quizTitle.includes(query);
        })
      : liveAttempts;

    const total = filteredAttempts.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const pagedItems = filteredAttempts.slice(start, start + limit);

    const avgAnswered = total
      ? Math.round(filteredAttempts.reduce((sum, attempt) => sum + attempt.answeredCount, 0) / total)
      : 0;
    const avgProgress = total
      ? Math.round(filteredAttempts.reduce((sum, attempt) => sum + attempt.progressPercentage, 0) / total)
      : 0;
    const totalFlags = filteredAttempts.reduce((sum, attempt) => sum + attempt.proctoringFlags, 0);

    return NextResponse.json({
      success: true,
      items: pagedItems,
      summary: {
        liveAttempts: total,
        avgAnswered,
        avgProgress,
        totalFlags,
      },
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    });
  } catch (error) {
    console.error('Failed to load in-progress mock attempts:', error);
    return NextResponse.json({ success: false, message: 'Failed to load in-progress mock attempts' }, { status: 500 });
  }
}