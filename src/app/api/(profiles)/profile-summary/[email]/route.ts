import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import User from '@/app/model/User';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockResult from '@/app/model/MockResult';
import MockTest from '@/app/model/MoockTest';
import Attempted from '@/app/model/Attempted';
import Quiz from '@/app/model/Quiz';
import mongoose from 'mongoose';
import { auth } from '@/auth';

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function getAttemptStatus(attempt: any, durationMinutes: number) {
  const startedAt = toDate(attempt?.startedAt) || toDate(attempt?.createdAt);
  const completedAt = toDate(attempt?.completedAt);
  const updatedAt = toDate(attempt?.updatedAt) || startedAt;

  if (completedAt) {
    return 'completed' as const;
  }

  if (!updatedAt || durationMinutes <= 0) {
    return 'in-progress' as const;
  }

  const expectedEndAt = new Date(updatedAt.getTime() + durationMinutes * 60 * 1000);
  return Date.now() > expectedEndAt.getTime() ? 'left' as const : 'in-progress' as const;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email?: string }> }
) {
  try {
    await connectDB();

    const { email } = await params;
    const requestedUserId = decodeURIComponent(email || '').trim();
    if (!requestedUserId) {
      return NextResponse.json({ message: 'Missing user id' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(requestedUserId)) {
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    const user = await User.findById(requestedUserId).lean<any>();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userId = String(user._id);
    const session = await auth();
    const isOwner = String(session?.user?.id || '') === userId;
    const isPrivateProfile = !isOwner && user.public === false;

    const [mockAttempts, quizAttempts] = await Promise.all([
      QuizAttempt.find({ userId }).sort({ startedAt: -1 }).lean<any[]>(),
      Attempted.find({ student: user._id }).sort({ attemptedAt: -1 }).lean<any[]>(),
    ]);

    const mockAttemptIds = mockAttempts.map((attempt) => attempt._id);
    const mockIds = Array.from(new Set(mockAttempts.map((attempt) => String(attempt.quizId)).filter(Boolean)));
    const quizIds = Array.from(new Set(quizAttempts.map((attempt) => String(attempt.quiz)).filter(Boolean)));

    const allMockAttempts = mockIds.length
      ? await QuizAttempt.find({ quizId: { $in: mockIds } }).lean<any[]>()
      : [];
    const allMockAttemptIds = allMockAttempts.map((attempt) => attempt._id);

    const [mockResults, mockTests, quizzes, coParticipantAttempts, coParticipantQuizAttempts] = await Promise.all([
      allMockAttemptIds.length
        ? MockResult.find({ attemptId: { $in: allMockAttemptIds } }).lean<any[]>()
        : Promise.resolve([]),
      mockIds.length
        ? MockTest.find({ _id: { $in: mockIds } }).lean<any[]>()
        : Promise.resolve([]),
      quizIds.length
        ? Quiz.find({ _id: { $in: quizIds } }).lean<any[]>()
        : Promise.resolve([]),
      mockIds.length
        ? QuizAttempt.find({
          quizId: { $in: mockIds },
          userId: { $ne: userId },
        }).sort({ startedAt: -1 }).lean<any[]>()
        : Promise.resolve([]),
      quizIds.length
        ? Attempted.find({
          quiz: { $in: quizIds },
          student: { $ne: user._id },
        }).sort({ attemptedAt: -1 }).lean<any[]>()
        : Promise.resolve([]),
    ]);

    const mockResultByAttemptId = new Map(
      mockResults.map((result) => [String(result.attemptId), result])
    );
    const mockById = new Map(mockTests.map((mock) => [String(mock._id), mock]));
    const quizById = new Map(quizzes.map((quiz) => [String(quiz._id), quiz]));

    const mockHistory = mockAttempts.map((attempt) => {
      const mock = mockById.get(String(attempt.quizId));
      const resultDoc = mockResultByAttemptId.get(String(attempt._id));
      const startedAt = toDate(attempt.startedAt);
      const completedAt = toDate(attempt.completedAt);
      const durationMinutes = Number(mock?.durationMinutes || attempt.quizDuration || 0);
      const expectedEndAt = startedAt && durationMinutes > 0
        ? new Date(startedAt.getTime() + durationMinutes * 60 * 1000)
        : null;
      const status = completedAt
        ? 'completed'
        : expectedEndAt && Date.now() > expectedEndAt.getTime()
          ? 'left'
          : 'in-progress';
      const totalQuestions = Number(resultDoc?.totalQuestions || 0);
      const totalCorrect = Number(resultDoc?.totalScore || 0);
      const accuracy = totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : Number(resultDoc?.percentage || 0);

      return {
        attemptId: String(attempt._id),
        mockId: String(attempt.quizId),
        title: attempt.quizTitle || mock?.title || 'Mock Test',
        startedAt: attempt.startedAt || null,
        completedAt: attempt.completedAt || null,
        status,
        totalCorrect,
        totalQuestions,
        accuracy,
      };
    });

    const quizHistory = quizAttempts.map((attempt) => {
      const quiz = quizById.get(String(attempt.quiz));
      const totalQuestions = Number(attempt.totalQuestions || quiz?.totalQuestions || 0);
      const score = Number(attempt.score || 0);
      const percentage = totalQuestions > 0
        ? Math.round((score / totalQuestions) * 100)
        : 0;

      return {
        resultId: String(attempt._id),
        quizId: String(attempt.quiz),
        title: attempt.title || quiz?.name || 'Quiz',
        score,
        totalQuestions,
        correctAnswers: Number(attempt.correctAnswers || 0),
        incorrectAnswers: Number(attempt.incorrectAnswers || 0),
        percentage,
        attemptedAt: attempt.attemptedAt || null,
      };
    });

    const participantMetaById = new Map<
      string,
      {
        name?: string;
        email?: string;
        lastPlayedAt?: string | null;
        sharedMocks: Set<string>;
        sharedQuizzes: Set<string>;
      }
    >();

    for (const attempt of coParticipantAttempts) {
      const participantId = String(attempt.userId || '');
      if (!mongoose.Types.ObjectId.isValid(participantId) || participantId === userId) {
        continue;
      }

      const existing = participantMetaById.get(participantId) || {
        name: attempt.userName,
        email: attempt.email,
        lastPlayedAt: null,
        sharedMocks: new Set<string>(),
        sharedQuizzes: new Set<string>(),
      };

      existing.sharedMocks.add(String(attempt.quizId));
      existing.name = existing.name || attempt.userName;
      existing.email = existing.email || attempt.email;

      const lastPlayedAt = toDate(attempt.completedAt || attempt.startedAt);
      if (lastPlayedAt) {
        const currentLatest = toDate(existing.lastPlayedAt);
        if (!currentLatest || lastPlayedAt.getTime() > currentLatest.getTime()) {
          existing.lastPlayedAt = lastPlayedAt.toISOString();
        }
      }

      participantMetaById.set(participantId, existing);
    }

    for (const attempt of coParticipantQuizAttempts) {
      const participantId = String(attempt.student || '');
      if (!mongoose.Types.ObjectId.isValid(participantId) || participantId === userId) {
        continue;
      }

      const existing = participantMetaById.get(participantId) || {
        name: undefined,
        email: undefined,
        lastPlayedAt: null,
        sharedMocks: new Set<string>(),
        sharedQuizzes: new Set<string>(),
      };

      existing.sharedQuizzes.add(String(attempt.quiz));

      const lastPlayedAt = toDate(attempt.attemptedAt);
      if (lastPlayedAt) {
        const currentLatest = toDate(existing.lastPlayedAt);
        if (!currentLatest || lastPlayedAt.getTime() > currentLatest.getTime()) {
          existing.lastPlayedAt = lastPlayedAt.toISOString();
        }
      }

      participantMetaById.set(participantId, existing);
    }

    const participantIds = Array.from(participantMetaById.keys());
    const participantUsers = participantIds.length
      ? await User.find({ _id: { $in: participantIds } })
        .select('name email image college branch year public')
        .lean<any[]>()
      : [];
    const participantUserById = new Map(
      participantUsers.map((participant) => [String(participant._id), participant])
    );

    const participants = participantIds
      .map((participantId) => {
        const participantMeta = participantMetaById.get(participantId);
        const participantUser = participantUserById.get(participantId);

        return {
          id: participantId,
          email: participantUser?.email || participantMeta?.email || '',
          name: participantUser?.name || participantMeta?.name || 'User',
          image: participantUser?.image || '',
          college: participantUser?.college || '',
          branch: participantUser?.branch || '',
          year: participantUser?.year || '',
          sharedMocks: participantMeta?.sharedMocks.size || 0,
          sharedQuizzes: participantMeta?.sharedQuizzes.size || 0,
          lastPlayedAt: participantMeta?.lastPlayedAt || null,
          profileUrl: `/profile/${participantId}`,
        };
      })
      .sort((left, right) => {
        const leftTime = toDate(left.lastPlayedAt)?.getTime() || 0;
        const rightTime = toDate(right.lastPlayedAt)?.getTime() || 0;
        return rightTime - leftTime;
      });

    const highestMock = mockHistory.reduce(
      (best, item) => (item.accuracy > best.accuracy ? item : best),
      { title: '-', accuracy: 0, totalCorrect: 0, totalQuestions: 0 }
    );
    const highestQuiz = quizHistory.reduce(
      (best, item) => (item.percentage > best.percentage ? item : best),
      { title: '-', percentage: 0, score: 0, totalQuestions: 0 }
    );
    const topMockWins = mockIds.flatMap((mockId) => {
      const mock = mockById.get(mockId);
      const mockDuration = Number(mock?.durationMinutes || 0);
      const groupedAttempts = allMockAttempts.filter((attempt) => String(attempt.quizId) === mockId);
      if (!groupedAttempts.length) {
        return [];
      }

      const leaderboardRows = groupedAttempts.map((attempt) => {
        const resultDoc = mockResultByAttemptId.get(String(attempt._id));
        const totalQuestions = Number(resultDoc?.totalQuestions || 0);
        const totalCorrect = Number(resultDoc?.totalScore || 0);
        const accuracy = totalQuestions > 0
          ? Math.round((totalCorrect / totalQuestions) * 100)
          : Number(resultDoc?.percentage || 0);

        return {
          attemptId: String(attempt._id),
          userId: String(attempt.userId),
          title: attempt.quizTitle || mock?.title || 'Mock Test',
          totalCorrect,
          accuracy,
          status: getAttemptStatus(attempt, mockDuration),
          completedAt: toDate(attempt.completedAt),
          lastActivityAt: toDate(attempt.updatedAt) || toDate(attempt.startedAt),
        };
      });

      const isFinalized = leaderboardRows.every((row) => row.status !== 'in-progress');
      if (!isFinalized) {
        return [];
      }

      leaderboardRows.sort((left, right) => {
        if (right.totalCorrect !== left.totalCorrect) {
          return right.totalCorrect - left.totalCorrect;
        }
        if (right.accuracy !== left.accuracy) {
          return right.accuracy - left.accuracy;
        }
        return (right.completedAt?.getTime() || right.lastActivityAt?.getTime() || 0) -
          (left.completedAt?.getTime() || left.lastActivityAt?.getTime() || 0);
      });

      const leader = leaderboardRows[0];
      if (!leader || leader.userId !== userId || leader.totalCorrect <= 0) {
        return [];
      }

      return [{
        id: mockId,
        title: leader.title,
        kind: 'mock' as const,
      }];
    });

    const topQuizWins = (Array.isArray(user.achievements) ? user.achievements : [])
      .filter((achievement: any) => achievement?.type === 'certificate' && Number(achievement?.rank || 0) === 1)
      .map((achievement: any) => ({
        id: String(achievement.quizId),
        title: achievement.quizTitle || 'Quiz',
        kind: 'quiz' as const,
      }));

    const certificateCount = (Array.isArray(user.achievements) ? user.achievements : [])
      .filter((achievement: any) => achievement?.type === 'certificate').length;

    const topWinsMap = new Map();
    [...topMockWins, ...topQuizWins].forEach(item => {
      const key = item.id || item.title;
      if (!topWinsMap.has(key)) {
        topWinsMap.set(key, item);
      }
    });

    const topWins = Array.from(topWinsMap.values());

    const visibleMockHistory = isOwner ? mockHistory : isPrivateProfile ? [] : mockHistory.slice(0, 4);
    const visibleQuizHistory = isOwner ? quizHistory : isPrivateProfile ? [] : quizHistory.slice(0, 4);
    const visibleParticipants = isOwner ? participants : [];

    return NextResponse.json({
      profile: {
        _id: String(user._id),
        name: user.name || '',
        email: isOwner ? user.email || '' : '',
      },
      isOwner,
      isPrivateProfile,
      stats: {
        totalMocksPlayed: isPrivateProfile ? 0 : mockHistory.length,
        totalQuizzesPlayed: isPrivateProfile ? 0 : quizHistory.length,
        highestMock,
        highestQuiz,
        topFinishes: isPrivateProfile ? 0 : topWins.length,
        certificates: isOwner ? certificateCount : 0,
      },
      mockHistory: visibleMockHistory,
      quizHistory: visibleQuizHistory,
      participants: visibleParticipants,
      topWins: isPrivateProfile ? [] : topWins.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching profile summary:', error);
    return NextResponse.json({ message: 'Error fetching profile summary' }, { status: 500 });
  }
}
