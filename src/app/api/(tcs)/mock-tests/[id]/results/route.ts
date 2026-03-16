import { NextResponse, NextRequest } from 'next/server';
import mongoose, { Types } from 'mongoose';
import nodemailer from 'nodemailer';
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
  durationMinutes?: number;
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

type AttemptStatus = 'completed' | 'in-progress' | 'left';

type LeaderboardAttempt = {
  userId: string;
  userName: string;
  email: string;
  quizTitle: string;
  completedAt: Date | null;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
};

const mailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: process.env.EMAIL_SERVICE || 'gmail',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.OTP_EMAIL_USER,
    pass: process.env.OTP_EMAIL_PASSWORD,
  },
});

function getOrdinal(rank: number) {
  const mod10 = rank % 10;
  const mod100 = rank % 100;
  if (mod10 === 1 && mod100 !== 11) return `${rank}st`;
  if (mod10 === 2 && mod100 !== 12) return `${rank}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${rank}rd`;
  return `${rank}th`;
}

async function sendCertificateNotificationEmail(params: {
  email: string;
  userName: string;
  quizTitle: string;
  certificateId: string;
  rank: number;
  score: number;
  totalQuestions: number;
  percentage: number;
}) {
  if (!params.email || !process.env.OTP_EMAIL_USER || !process.env.OTP_EMAIL_PASSWORD) {
    return;
  }

  const badgeLabel = params.rank <= 3 ? 'Winner' : 'Participant';
  const rankLabel = getOrdinal(params.rank);
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trackode.in';
  const verifyUrl = `${appBaseUrl}/certificate/verify/${encodeURIComponent(params.certificateId)}`;
  const subject = `Certificate Awarded: ${params.quizTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a; max-width: 640px; margin: 0 auto; padding: 20px;">
      <h2 style="margin-bottom: 8px;">Congratulations, ${params.userName || 'Participant'}!</h2>
      <p style="margin-top: 0; color: #334155;">You have received a certificate for <strong>${params.quizTitle}</strong>.</p>
      <div style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin: 16px 0; background: #f8fafc;">
        <p style="margin: 0 0 6px;"><strong>Rank:</strong> ${rankLabel} Position</p>
        <p style="margin: 0 0 6px;"><strong>Status:</strong> ${badgeLabel}</p>
        <p style="margin: 0 0 6px;"><strong>Certificate ID:</strong> ${params.certificateId}</p>
        <p style="margin: 0 0 6px;"><strong>Score:</strong> ${params.score}/${params.totalQuestions}</p>
        <p style="margin: 0;"><strong>Accuracy:</strong> ${params.percentage}%</p>
      </div>
      <p style="color: #475569;">You can now view and download this certificate from your profile on Trackode.</p>
      <p style="color: #475569;">Verify certificate: <a href="${verifyUrl}">${verifyUrl}</a></p>
    </div>
  `;

  await mailTransporter.sendMail({
    from: `"Trackode Team" <${process.env.OTP_EMAIL_USER}>`,
    to: params.email,
    subject,
    html,
  });
}

async function awardCertificatesForFinalizedLeaderboard(
  quizId: string,
  quizTitle: string,
  leaderboard: LeaderboardAttempt[]
) {
  const quizObjectId = new Types.ObjectId(quizId);

  for (let index = 0; index < leaderboard.length; index += 1) {
    const row = leaderboard[index];
    if (!Types.ObjectId.isValid(row.userId)) {
      continue;
    }

    const rank = index + 1;
    const badgeLabel: 'Winner' | 'Participant' = rank <= 3 ? 'Winner' : 'Participant';
    const certificateDate = row.completedAt || new Date();
    const certificateId = `TRK-${quizId.slice(-6).toUpperCase()}-${row.userId.slice(-6).toUpperCase()}`;
    const payload = {
      type: 'certificate' as const,
      certificateId,
      rank,
      positionLabel: `${getOrdinal(rank)} Position`,
      badgeLabel,
      quizTitle: quizTitle || row.quizTitle || 'Mock Test',
      quizId: quizObjectId,
      score: Number(row.totalCorrect || 0),
      totalQuestions: Number(row.totalQuestions || 0),
      percentage: Number(row.accuracy || 0),
      date: certificateDate,
    };

    const updateResult = await User.updateOne(
      {
        _id: new Types.ObjectId(row.userId),
        achievements: {
          $not: {
            $elemMatch: {
              type: 'certificate',
              quizId: quizObjectId,
            },
          },
        },
      },
      {
        $push: {
          achievements: payload,
        },
      }
    );

    if (updateResult.modifiedCount > 0) {
      try {
        await sendCertificateNotificationEmail({
          email: row.email,
          userName: row.userName,
          quizTitle: payload.quizTitle,
          certificateId: payload.certificateId,
          rank,
          score: payload.score,
          totalQuestions: payload.totalQuestions,
          percentage: payload.percentage,
        });
      } catch (mailError) {
        console.error('Certificate email failed:', mailError);
      }
    }
  }
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
    const pageParam = Number.parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limitParam = Number.parseInt(request.nextUrl.searchParams.get('limit') || '25', 10);
    const queryParam = (request.nextUrl.searchParams.get('q') || '').trim().toLowerCase();
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 25;

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

    // Include both completed and in-progress attempts in the list.
    // Only completed attempts are persisted in MockResult as final results.
    const attempts = await QuizAttempt.find({ quizId }).lean<IQuizAttempt[]>();
    if (!attempts.length) {
      return NextResponse.json({
        quizId,
        quizTitle: quiz.title,
        totalParticipants: 0,
        completedParticipants: 0,
        leftParticipants: 0,
        inProgressParticipants: 0,
        leaderboardFinalized: true,
        attempts: [],
        topPerformers: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
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
      const safeCompletedAt = attempt.completedAt || null;
      const lastActivityAt = attempt.updatedAt || safeStartedAt;
      const quizDurationMinutes = Math.max(0, Number(quiz.durationMinutes || 0));
      const expectedEndAt =
        quizDurationMinutes > 0
          ? new Date(lastActivityAt.getTime() + quizDurationMinutes * 60 * 1000)
          : null;
      const hasLikelyLeft =
        !safeCompletedAt &&
        Boolean(expectedEndAt && Date.now() > expectedEndAt.getTime());
      const status: AttemptStatus = safeCompletedAt
        ? 'completed'
        : hasLikelyLeft
        ? 'left'
        : 'in-progress';
      const sectionResults = computeSectionResults(allQuestions, questionsMap, attempt.answers || {});

      const totalScore = sectionResults.reduce((sum, section) => sum + section.correct, 0);
      const totalQuestions = allQuestions.length;
      const percentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
      const totalAnswered = sectionResults.reduce((sum, section) => sum + section.questions.length, 0);

      const getMailSent = (doc: unknown) => {
        if (!doc) return false;
        if (Array.isArray(doc)) {
          const first = doc[0] as { mailSent?: boolean } | undefined;
          return Boolean(first?.mailSent);
        }
        return Boolean((doc as { mailSent?: boolean }).mailSent);
      };

      let mailSent = false;
      if (safeCompletedAt) {
        const mr = await MockResult.findOneAndUpdate(
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
          { upsert: true, new: true }
        ).lean();
        mailSent = getMailSent(mr);
      } else {
        const mr = await MockResult.findOne({ attemptId: new Types.ObjectId(attempt._id) }).lean();
        mailSent = getMailSent(mr);
      }

      const userDetails = userMap.get(attempt.userId) || { name: 'Unknown', email: '' };

      return {
        _id: attempt._id.toString(),
        userId: attempt.userId,
        userName: userDetails.name,
        email: userDetails.email,
        quizTitle: attempt.quizTitle,
        startedAt: safeStartedAt,
        completedAt: safeCompletedAt,
        lastActivityAt,
        expectedEndAt,
        status,
        totalAnswered,
        totalCorrect: totalScore,
        totalQuestions,
        accuracy: percentage,
        mailSent,
        sectionStats: sectionResults.map(section => ({
          sectionName: section.sectionName,
          answered: section.questions.length,
          correct: section.correct,
          totalQuestions: section.total
        }))
      };
    }));

    const completedParticipants = results.filter((attempt) => attempt.status === 'completed').length;
    const leftParticipants = results.filter((attempt) => attempt.status === 'left').length;
    const inProgressParticipants = results.filter((attempt) => attempt.status === 'in-progress').length;
    const allAttemptsClosed = inProgressParticipants === 0;

    if (allAttemptsClosed) {
      // Final leaderboard mode: highest score first once no one is in progress.
      results.sort((a, b) => {
        if ((b.totalCorrect || 0) !== (a.totalCorrect || 0)) {
          return (b.totalCorrect || 0) - (a.totalCorrect || 0);
        }
        if ((b.accuracy || 0) !== (a.accuracy || 0)) {
          return (b.accuracy || 0) - (a.accuracy || 0);
        }
        return (b.completedAt?.getTime() || b.lastActivityAt?.getTime() || 0) -
          (a.completedAt?.getTime() || a.lastActivityAt?.getTime() || 0);
      });

      await awardCertificatesForFinalizedLeaderboard(
        quizId,
        quiz.title,
        results.map((attempt) => ({
          userId: attempt.userId,
          userName: attempt.userName,
          email: attempt.email,
          quizTitle: attempt.quizTitle,
          completedAt: attempt.completedAt,
          totalCorrect: attempt.totalCorrect,
          totalQuestions: attempt.totalQuestions,
          accuracy: attempt.accuracy,
        }))
      );
    } else {
      // Live monitoring mode: sort by score even while attempts are still in progress.
      results.sort((a, b) => {
        if ((b.totalCorrect || 0) !== (a.totalCorrect || 0)) {
          return (b.totalCorrect || 0) - (a.totalCorrect || 0);
        }
        if ((b.accuracy || 0) !== (a.accuracy || 0)) {
          return (b.accuracy || 0) - (a.accuracy || 0);
        }
        return (b.completedAt?.getTime() || b.lastActivityAt?.getTime() || 0) -
          (a.completedAt?.getTime() || a.lastActivityAt?.getTime() || 0);
      });
    }

    const visibleResults = queryParam
      ? results.filter((attempt) => {
          const userName = (attempt.userName || '').toLowerCase();
          const email = (attempt.email || '').toLowerCase();
          return userName.includes(queryParam) || email.includes(queryParam);
        })
      : results;

    const rankedResults = visibleResults.map((attempt, index) => ({
      ...attempt,
      rank: index + 1,
    }));
    const visibleCount = visibleResults.length;
    const visibleAvgAccuracy =
      visibleCount > 0
        ? Math.round(visibleResults.reduce((sum, attempt) => sum + (attempt.accuracy || 0), 0) / visibleCount)
        : 0;
    const visibleAvgAnswered =
      visibleCount > 0
        ? Math.round(visibleResults.reduce((sum, attempt) => sum + (attempt.totalAnswered || 0), 0) / visibleCount)
        : 0;
    const visibleCompletions = visibleResults.filter((attempt) => attempt.status === 'completed').length;

    const total = rankedResults.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const pagedAttempts = rankedResults.slice(start, start + limit);

    return NextResponse.json({
      quizId,
      quizTitle: quiz.title,
      totalParticipants: total,
      completedParticipants,
      leftParticipants,
      inProgressParticipants,
      leaderboardFinalized: allAttemptsClosed,
      attempts: pagedAttempts,
      topPerformers: rankedResults.slice(0, 3),
      summary: {
        participants: visibleCount,
        avgAccuracy: visibleAvgAccuracy,
        avgAnswered: visibleAvgAnswered,
        totalQuestions: allQuestions.length,
        completions: visibleCompletions,
      },
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
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