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
    events?: Array<{ type?: string; at?: Date; detail?: string }>;
  };
};

type QuestionDocument = {
  _id: Types.ObjectId;
  section: string;
  correctAnswer: number;
};

export async function GET(_: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid attempt id' }, { status: 400 });
    }

    await connectDB();

    const attempt = await QuizAttempt.findById(id).lean<AttemptDocument | null>();
    if (!attempt) {
      return NextResponse.json({ success: false, message: 'Attempt not found' }, { status: 404 });
    }

    const lifecycle = resolveAttemptLifecycle({
      startedAt: attempt.startedAt,
      lastActivityAt: attempt.updatedAt || attempt.startedAt,
      completedAt: attempt.completedAt,
      quizDurationMinutes: attempt.quizDuration,
      now: new Date(),
    });

    if (lifecycle.status !== 'in-progress') {
      return NextResponse.json({ success: false, message: 'Attempt is no longer in progress' }, { status: 409 });
    }

    if (!Types.ObjectId.isValid(String(attempt.quizId || ''))) {
      return NextResponse.json({ success: false, message: 'Mock metadata is missing' }, { status: 404 });
    }

    const questions = await Question.find({ mockTestId: new Types.ObjectId(String(attempt.quizId)) })
      .select({ _id: 1, section: 1, correctAnswer: 1 })
      .lean<QuestionDocument[]>();

    const correctAnswerByQuestionId = new Map<string, number>();
    const sectionMeta = new Map<string, { totalQuestions: number; answered: number; correct: number }>();

    questions.forEach((question) => {
      correctAnswerByQuestionId.set(String(question._id), question.correctAnswer);
      const key = question.section || 'General';
      if (!sectionMeta.has(key)) {
        sectionMeta.set(key, { totalQuestions: 0, answered: 0, correct: 0 });
      }
      sectionMeta.get(key)!.totalQuestions += 1;
    });

    Object.entries(attempt.answers || {}).forEach(([rawSectionName, sectionAnswers]) => {
      const key = rawSectionName || 'General';
      if (!sectionMeta.has(key)) {
        sectionMeta.set(key, { totalQuestions: 0, answered: 0, correct: 0 });
      }
      const current = sectionMeta.get(key)!;

      Object.entries(sectionAnswers || {}).forEach(([questionId, answerIndex]) => {
        current.answered += 1;
        const correctAnswer = correctAnswerByQuestionId.get(questionId);
        if (typeof correctAnswer === 'number' && correctAnswer === answerIndex) {
          current.correct += 1;
        }
      });
    });

    const answeredCount = countAnsweredQuestions(attempt.answers || {});
    const currentScore = countCorrectAnswers(attempt.answers || {}, correctAnswerByQuestionId);
    const totalQuestions = questions.length;
    const progressPercentage = getSafePercentage(answeredCount, totalQuestions);
    const scorePercentage = getSafePercentage(currentScore, totalQuestions);
    const accuracyPercentage = getSafePercentage(currentScore, answeredCount);
    const flags = sumProctoringFlags(attempt.proctoring);

    const result = {
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
      totalQuestions,
      progressPercentage,
      scorePercentage,
      accuracyPercentage,
      fullscreenExitCount: flags.fullscreenExitCount,
      tabSwitchCount: flags.tabSwitchCount,
      copyAttemptCount: flags.copyAttemptCount,
      contextMenuCount: flags.contextMenuCount,
      proctoringFlags: flags.total,
      recentEvents: Array.isArray(attempt.proctoring?.events)
        ? attempt.proctoring.events.slice(-10).reverse().map((event) => ({
            type: event.type || '',
            at: event.at?.toISOString?.() || null,
            detail: event.detail || '',
          }))
        : [],
      sectionStats: Array.from(sectionMeta.entries())
        .map(([sectionName, section]) => ({
          sectionName,
          answered: section.answered,
          correct: section.correct,
          unanswered: Math.max(0, section.totalQuestions - section.answered),
          totalQuestions: section.totalQuestions,
          progressPercentage: getSafePercentage(section.answered, section.totalQuestions),
          accuracyPercentage: getSafePercentage(section.correct, section.answered),
        }))
        .sort((a, b) => a.sectionName.localeCompare(b.sectionName)),
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Failed to load in-progress attempt detail:', error);
    return NextResponse.json({ success: false, message: 'Failed to load in-progress attempt detail' }, { status: 500 });
  }
}