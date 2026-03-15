import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import User from '@/app/model/User';
import QuizAttempt from '@/app/model/QuizAttempt';
import Attempted from '@/app/model/Attempted';
import MockResult from '@/app/model/MockResult';
import MockTest from '@/app/model/MoockTest';
import Quiz from '@/app/model/Quiz';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeObjectId(value: unknown): string | null {
  if (!value) return null;
  const text = String(value);
  return Types.ObjectId.isValid(text) ? text : null;
}

function toDayLabel(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateDaysAgo(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
}

export async function GET(request: NextRequest) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const pageParam = Number.parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limitParam = Number.parseInt(request.nextUrl.searchParams.get('limit') || '25', 10);
    const q = (request.nextUrl.searchParams.get('q') || '').trim();
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 25;
    const skip = (page - 1) * limit;

    const regex = q ? new RegExp(escapeRegExp(q), 'i') : null;
    const userFilter = regex
      ? {
          $or: [
            { name: regex },
            { email: regex },
            { college: regex },
            { branch: regex },
            { phone: regex },
          ],
        }
      : {};

    const start7d = dateDaysAgo(7);
    const start30d = dateDaysAgo(30);
    const start14d = dateDaysAgo(14);

    const [
      totalUsers,
      newUsers7d,
      newUsers30d,
      pagedUsers,
      filteredTotal,
      recentMockUsers7d,
      recentQuizUsers7d,
      recentMockUsers30d,
      recentQuizUsers30d,
      mockAttemptTrendRaw,
      registrationTrendRaw,
      topMockRaw,
      topQuizRaw,
      topMockStudentsRaw,
      topQuizStudentsRaw,
      geoByCollegeRaw,
      geoByEmailDomainRaw,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: start7d } }),
      User.countDocuments({ createdAt: { $gte: start30d } }),
      User.find(userFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select({ name: 1, email: 1, phone: 1, college: 1, branch: 1, year: 1, createdAt: 1, updatedAt: 1 })
        .lean(),
      User.countDocuments(userFilter),
      QuizAttempt.distinct('userId', { startedAt: { $gte: start7d } }),
      Attempted.distinct('student', { attemptedAt: { $gte: start7d } }),
      QuizAttempt.distinct('userId', { startedAt: { $gte: start30d } }),
      Attempted.distinct('student', { attemptedAt: { $gte: start30d } }),
      QuizAttempt.aggregate([
        { $match: { startedAt: { $gte: start14d } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$startedAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: start14d } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      QuizAttempt.aggregate([
        {
          $group: {
            _id: '$quizId',
            attempts: { $sum: 1 },
          },
        },
        { $sort: { attempts: -1 } },
        { $limit: 8 },
      ]),
      Attempted.aggregate([
        {
          $group: {
            _id: '$quiz',
            attempts: { $sum: 1 },
          },
        },
        { $sort: { attempts: -1 } },
        { $limit: 8 },
      ]),
      MockResult.aggregate([
        {
          $group: {
            _id: '$userId',
            attempts: { $sum: 1 },
            avgPercentage: { $avg: '$percentage' },
            totalScore: { $sum: '$totalScore' },
          },
        },
        { $sort: { attempts: -1 } },
        { $limit: 50 },
      ]),
      Attempted.aggregate([
        {
          $addFields: {
            percentage: {
              $cond: [
                { $gt: ['$totalQuestions', 0] },
                { $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100] },
                0,
              ],
            },
          },
        },
        {
          $group: {
            _id: '$student',
            attempts: { $sum: 1 },
            avgPercentage: { $avg: '$percentage' },
            totalScore: { $sum: '$score' },
          },
        },
        { $sort: { attempts: -1 } },
        { $limit: 50 },
      ]),
      User.aggregate([
        {
          $group: {
            _id: {
              $ifNull: [
                {
                  $cond: [
                    { $gt: [{ $strLenCP: { $ifNull: ['$college', ''] } }, 0] },
                    '$college',
                    'Unknown',
                  ],
                },
                'Unknown',
              ],
            },
            users: { $sum: 1 },
          },
        },
        { $sort: { users: -1 } },
        { $limit: 8 },
      ]),
      User.aggregate([
        {
          $project: {
            domain: {
              $arrayElemAt: [
                { $split: ['$email', '@'] },
                1,
              ],
            },
          },
        },
        {
          $group: {
            _id: { $ifNull: ['$domain', 'unknown'] },
            users: { $sum: 1 },
          },
        },
        { $sort: { users: -1 } },
        { $limit: 8 },
      ]),
    ]);

    const active7dSet = new Set<string>();
    const active30dSet = new Set<string>();

    for (const raw of [...recentMockUsers7d, ...recentQuizUsers7d]) {
      const id = normalizeObjectId(raw);
      if (id) active7dSet.add(id);
    }

    for (const raw of [...recentMockUsers30d, ...recentQuizUsers30d]) {
      const id = normalizeObjectId(raw);
      if (id) active30dSet.add(id);
    }

    const pagedUserIds = pagedUsers
      .map((u: any) => normalizeObjectId(u?._id))
      .filter((id): id is string => Boolean(id));

    const [mockCountsByUserRaw, quizCountsByUserRaw] = await Promise.all([
      pagedUserIds.length
        ? QuizAttempt.aggregate([
            { $match: { userId: { $in: pagedUserIds } } },
            { $group: { _id: '$userId', attempts: { $sum: 1 } } },
          ])
        : Promise.resolve([]),
      pagedUserIds.length
        ? Attempted.aggregate([
            { $match: { student: { $in: pagedUserIds.map((id) => new Types.ObjectId(id)) } } },
            { $group: { _id: '$student', attempts: { $sum: 1 } } },
          ])
        : Promise.resolve([]),
    ]);

    const mockCountMap = new Map<string, number>();
    const quizCountMap = new Map<string, number>();

    for (const row of mockCountsByUserRaw as Array<{ _id: string; attempts: number }>) {
      mockCountMap.set(String(row._id), Number(row.attempts || 0));
    }
    for (const row of quizCountsByUserRaw as Array<{ _id: Types.ObjectId; attempts: number }>) {
      quizCountMap.set(String(row._id), Number(row.attempts || 0));
    }

    const users = pagedUsers.map((user: any) => {
      const id = String(user._id);
      return {
        _id: id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        college: user.college || '',
        branch: user.branch || '',
        year: user.year || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        mockAttempts: mockCountMap.get(id) || 0,
        quizAttempts: quizCountMap.get(id) || 0,
        isActive7d: active7dSet.has(id),
        isActive30d: active30dSet.has(id),
      };
    });

    const mockIds = (topMockRaw as Array<{ _id: Types.ObjectId; attempts: number }>)
      .map((row) => String(row._id))
      .filter((id) => Types.ObjectId.isValid(id));
    const quizIds = (topQuizRaw as Array<{ _id: Types.ObjectId; attempts: number }>)
      .map((row) => String(row._id))
      .filter((id) => Types.ObjectId.isValid(id));

    const [topMocksMeta, topQuizMeta] = await Promise.all([
      mockIds.length ? MockTest.find({ _id: { $in: mockIds } }).select({ title: 1 }).lean() : Promise.resolve([]),
      quizIds.length ? Quiz.find({ _id: { $in: quizIds } }).select({ name: 1 }).lean() : Promise.resolve([]),
    ]);

    const mockTitleMap = new Map<string, string>();
    const quizNameMap = new Map<string, string>();

    for (const row of topMocksMeta as Array<{ _id: Types.ObjectId; title?: string }>) {
      mockTitleMap.set(String(row._id), row.title || 'Untitled Mock');
    }
    for (const row of topQuizMeta as Array<{ _id: Types.ObjectId; name?: string }>) {
      quizNameMap.set(String(row._id), row.name || 'Untitled Quiz');
    }

    const topTrendingMocks = (topMockRaw as Array<{ _id: Types.ObjectId; attempts: number }>).map((row) => ({
      id: String(row._id),
      title: mockTitleMap.get(String(row._id)) || 'Untitled Mock',
      attempts: Number(row.attempts || 0),
    }));

    const topTrendingQuizzes = (topQuizRaw as Array<{ _id: Types.ObjectId; attempts: number }>).map((row) => ({
      id: String(row._id),
      title: quizNameMap.get(String(row._id)) || 'Untitled Quiz',
      attempts: Number(row.attempts || 0),
    }));

    const studentMap = new Map<string, { mockAttempts: number; quizAttempts: number; avgPctWeighted: number; totalAttempts: number }>();

    for (const row of topMockStudentsRaw as Array<{ _id: Types.ObjectId; attempts: number; avgPercentage: number }>) {
      const id = String(row._id);
      const attempts = Number(row.attempts || 0);
      const avgPct = Number(row.avgPercentage || 0);
      studentMap.set(id, {
        mockAttempts: attempts,
        quizAttempts: 0,
        avgPctWeighted: avgPct * attempts,
        totalAttempts: attempts,
      });
    }

    for (const row of topQuizStudentsRaw as Array<{ _id: Types.ObjectId; attempts: number; avgPercentage: number }>) {
      const id = String(row._id);
      const attempts = Number(row.attempts || 0);
      const avgPct = Number(row.avgPercentage || 0);
      const existing = studentMap.get(id);
      if (existing) {
        existing.quizAttempts += attempts;
        existing.avgPctWeighted += avgPct * attempts;
        existing.totalAttempts += attempts;
      } else {
        studentMap.set(id, {
          mockAttempts: 0,
          quizAttempts: attempts,
          avgPctWeighted: avgPct * attempts,
          totalAttempts: attempts,
        });
      }
    }

    const topStudentIds = [...studentMap.keys()]
      .sort((a, b) => {
        const sa = studentMap.get(a)!;
        const sb = studentMap.get(b)!;
        return sb.totalAttempts - sa.totalAttempts;
      })
      .slice(0, 12);

    const topStudentUsers = topStudentIds.length
      ? await User.find({ _id: { $in: topStudentIds.map((id) => new Types.ObjectId(id)) } })
          .select({ name: 1, email: 1 })
          .lean()
      : [];

    const topStudentUserMap = new Map<string, { name?: string; email?: string }>();
    for (const u of topStudentUsers as Array<{ _id: Types.ObjectId; name?: string; email?: string }>) {
      topStudentUserMap.set(String(u._id), { name: u.name, email: u.email });
    }

    const topStudents = topStudentIds.map((id) => {
      const data = studentMap.get(id)!;
      const avgAccuracy = data.totalAttempts > 0 ? Math.round(data.avgPctWeighted / data.totalAttempts) : 0;
      const profile = topStudentUserMap.get(id);
      return {
        userId: id,
        name: profile?.name || profile?.email || 'Unknown User',
        email: profile?.email || '',
        attempts: data.totalAttempts,
        mockAttempts: data.mockAttempts,
        quizAttempts: data.quizAttempts,
        avgAccuracy,
      };
    });

    const attemptTrendByDay = new Map<string, number>();
    const regTrendByDay = new Map<string, number>();

    for (let i = 13; i >= 0; i -= 1) {
      const day = dateDaysAgo(i);
      const key = toDayLabel(day);
      attemptTrendByDay.set(key, 0);
      regTrendByDay.set(key, 0);
    }

    for (const row of mockAttemptTrendRaw as Array<{ _id: string; count: number }>) {
      attemptTrendByDay.set(row._id, Number(row.count || 0));
    }
    for (const row of registrationTrendRaw as Array<{ _id: string; count: number }>) {
      regTrendByDay.set(row._id, Number(row.count || 0));
    }

    const mockAttemptTrend = [...attemptTrendByDay.entries()].map(([date, count]) => ({ date, count }));
    const userRegistrationTrend = [...regTrendByDay.entries()].map(([date, count]) => ({ date, count }));

    const geographyByCollege = (geoByCollegeRaw as Array<{ _id: string; users: number }>).map((row) => ({
      region: row._id || 'Unknown',
      users: Number(row.users || 0),
    }));

    const geographyByEmailDomain = (geoByEmailDomainRaw as Array<{ _id: string; users: number }>).map((row) => ({
      region: row._id || 'unknown',
      users: Number(row.users || 0),
    }));

    const totalPages = Math.max(1, Math.ceil(filteredTotal / limit));
    const safePage = Math.min(page, totalPages);

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        filteredUsers: filteredTotal,
        newUsers7d,
        newUsers30d,
        activeUsers7d: active7dSet.size,
        activeUsers30d: active30dSet.size,
      },
      users,
      topTrendingMocks,
      topTrendingQuizzes,
      topStudents,
      trends: {
        mockAttemptTrend,
        userRegistrationTrend,
      },
      geography: {
        byCollege: geographyByCollege,
        byEmailDomain: geographyByEmailDomain,
      },
      pagination: {
        page: safePage,
        limit,
        total: filteredTotal,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    });
  } catch (error) {
    console.error('Failed to load users insights:', error);
    return NextResponse.json({ success: false, message: 'Failed to load users insights' }, { status: 500 });
  }
}
