import { NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import MockTest from '@/app/model/MoockTest';
import Quiz from '@/app/model/Quiz';
import QuizAttempt from '@/app/model/QuizAttempt';
import Attempted from '@/app/model/Attempted';
import MockResult from '@/app/model/MockResult';
import MockQuestion from '@/app/model/MockQuestions';
import User from '@/app/model/User';
import { Types } from 'mongoose';

type SectionSummary = {
  name: string;
  count: number;
};

export async function GET() {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [mocks, quizzes, quizAttempts, mockResults, quizResults, totalMockAttempts, attemptAggregation] = await Promise.all([
      MockTest.find().sort({ createdAt: -1 }).lean(),
      Quiz.find().sort({ createdAt: -1 }).populate('createdBy', 'name email').lean(),
      QuizAttempt.find().sort({ startedAt: -1 }).lean(),
      MockResult.find().sort({ completedAt: -1 }).limit(200).populate('userId', 'name email').lean(),
      Attempted.find().sort({ attemptedAt: -1 }).limit(200).populate('student', 'name email').populate('quiz', 'name').lean(),
      QuizAttempt.countDocuments(),
      QuizAttempt.aggregate([
        {
          $group: {
            _id: '$quizId',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const attemptsByMockId = attemptAggregation.reduce((acc, item: any) => {
      const key = String(item?._id || '');
      if (key) {
        acc[key] = Number(item?.count || 0);
      }
      return acc;
    }, {} as Record<string, number>);

    const mockIds = mocks.map((mock: any) => mock._id);
    const sectionAggregation = await MockQuestion.aggregate([
      { $match: { mockTestId: { $in: mockIds } } },
      {
        $group: {
          _id: {
            mockTestId: '$mockTestId',
            section: '$section',
          },
          questionCount: { $sum: 1 },
        },
      },
    ]);

    const sectionMap = sectionAggregation.reduce((acc, item: any) => {
      const mockId = String(item._id?.mockTestId);
      const sectionName = String(item._id?.section || 'General').trim();
      if (!acc[mockId]) {
        acc[mockId] = [];
      }
      acc[mockId].push({
        name: sectionName || 'General',
        count: item.questionCount || 0,
      });
      return acc;
    }, {} as Record<string, Array<{ name: string; count: number }>>);

    const mappedMocks = mocks.map((mock: any) => {
      const key = String(mock._id);
      const sections: SectionSummary[] = sectionMap[key] || [];
      return {
        ...mock,
        attempts: attemptsByMockId[key] || 0,
        sections,
        sectionNames: sections.map((s) => s.name),
        questionCount: sections.reduce((sum, s) => sum + (s.count || 0), 0),
      };
    });

    const userIds = Array.from(
      new Set(
        quizAttempts
          .map((attempt: any) => String(attempt.userId || '').trim())
          .filter((id) => Types.ObjectId.isValid(id))
      )
    );

    const users = userIds.length
      ? await User.find({ _id: { $in: userIds } }).select('name email').lean()
      : [];

    const userMap = users.reduce((acc, user: any) => {
      acc[String(user._id)] = {
        name: user.name,
        email: user.email,
      };
      return acc;
    }, {} as Record<string, { name?: string; email?: string }>);

    const mockTitleById = mappedMocks.reduce((acc, mock: any) => {
      acc[String(mock._id)] = String(mock.title || '');
      return acc;
    }, {} as Record<string, string>);

    const mappedAttempts = quizAttempts.map((attempt: any) => {
      const quizId = String(attempt.quizId || '');
      const userId = String(attempt.userId || '');
      const answers = attempt.answers && typeof attempt.answers === 'object' ? attempt.answers : {};
      const proctoring = attempt.proctoring && typeof attempt.proctoring === 'object' ? attempt.proctoring : {};
      const fullscreenExitCount = Number(proctoring.fullscreenExitCount || 0);
      const tabSwitchCount = Number(proctoring.tabSwitchCount || 0);
      const copyAttemptCount = Number(proctoring.copyAttemptCount || 0);
      const contextMenuCount = Number(proctoring.contextMenuCount || 0);
      const answeredCount = Object.values(answers as Record<string, Record<string, number>>).reduce(
        (sum, sectionAnswers) => sum + Object.keys(sectionAnswers || {}).length,
        0
      );

      return {
        ...attempt,
        quizId,
        userId,
        quizTitle: attempt.quizTitle || mockTitleById[quizId] || 'Untitled Mock',
        user: {
          name: userMap[userId]?.name || attempt.userName || '',
          email: userMap[userId]?.email || attempt.email || '',
        },
        isCompleted: Boolean(attempt.completedAt),
        answeredCount,
        fullscreenExitCount,
        tabSwitchCount,
        copyAttemptCount,
        contextMenuCount,
        proctoringFlags: fullscreenExitCount + tabSwitchCount + copyAttemptCount + contextMenuCount,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalMocks: mocks.length,
          totalQuizzes: quizzes.length,
          totalMockAttempts,
          totalQuizAttempts: quizResults.length,
          totalMockResults: mockResults.length,
          publishedMocks: mocks.filter((m: any) => m.isPublished).length,
          activeQuizzes: quizzes.filter((q: any) => q.active).length,
        },
        mocks: mappedMocks,
        quizzes,
        quizAttempts: mappedAttempts,
        mockResults,
        quizResults,
      },
    });
  } catch (error) {
    console.error('Failed to build super admin dashboard:', error);
    return NextResponse.json({ success: false, message: 'Failed to load dashboard' }, { status: 500 });
  }
}
