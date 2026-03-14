import { NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import MockTest from '@/app/model/MoockTest';
import Quiz from '@/app/model/Quiz';
import QuizAttempt from '@/app/model/QuizAttempt';
import Attempted from '@/app/model/Attempted';
import MockResult from '@/app/model/MockResult';
import MockQuestion from '@/app/model/MockQuestions';

export async function GET() {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [mocks, quizzes, quizAttempts, mockResults, quizResults] = await Promise.all([
      MockTest.find().sort({ createdAt: -1 }).lean(),
      Quiz.find().sort({ createdAt: -1 }).populate('createdBy', 'name email').lean(),
      QuizAttempt.find().sort({ startedAt: -1 }).limit(500).lean(),
      MockResult.find().sort({ completedAt: -1 }).limit(200).populate('userId', 'name email').lean(),
      Attempted.find().sort({ attemptedAt: -1 }).limit(200).populate('student', 'name email').populate('quiz', 'name').lean(),
    ]);

    const attemptsByMockId = quizAttempts.reduce((acc, attempt: any) => {
      const key = String(attempt.quizId);
      acc[key] = (acc[key] || 0) + 1;
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
      const sections = sectionMap[key] || [];
      return {
        ...mock,
        attempts: attemptsByMockId[key] || 0,
        sections,
        sectionNames: sections.map((s) => s.name),
        questionCount: sections.reduce((sum, s) => sum + (s.count || 0), 0),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalMocks: mocks.length,
          totalQuizzes: quizzes.length,
          totalMockAttempts: quizAttempts.length,
          totalQuizAttempts: quizResults.length,
          totalMockResults: mockResults.length,
          publishedMocks: mocks.filter((m: any) => m.isPublished).length,
          activeQuizzes: quizzes.filter((q: any) => q.active).length,
        },
        mocks: mappedMocks,
        quizzes,
        mockResults,
        quizResults,
      },
    });
  } catch (error) {
    console.error('Failed to build super admin dashboard:', error);
    return NextResponse.json({ success: false, message: 'Failed to load dashboard' }, { status: 500 });
  }
}
