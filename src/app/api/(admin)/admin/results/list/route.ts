import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import User from '@/app/model/User';
import Quiz from '@/app/model/Quiz';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockResult from '@/app/model/MockResult';
import Attempted from '@/app/model/Attempted';

type ResultKind = 'attempt' | 'mock' | 'quiz';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parsePagination(request: NextRequest) {
  const pageParam = Number.parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
  const limitParam = Number.parseInt(request.nextUrl.searchParams.get('limit') || '25', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 25;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

async function searchUserIds(query: string): Promise<string[]> {
  if (!query) return [];
  const regex = new RegExp(escapeRegExp(query), 'i');
  const users = await User.find({ $or: [{ name: regex }, { email: regex }] })
    .select({ _id: 1 })
    .lean<Array<{ _id: Types.ObjectId }>>();
  return users.map((u) => String(u._id));
}

export async function GET(request: NextRequest) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const kindParam = request.nextUrl.searchParams.get('kind') || 'attempt';
    const kind = (['attempt', 'mock', 'quiz'].includes(kindParam) ? kindParam : 'attempt') as ResultKind;
    const q = (request.nextUrl.searchParams.get('q') || '').trim();
    const { page, limit, skip } = parsePagination(request);
    const regex = q ? new RegExp(escapeRegExp(q), 'i') : null;

    if (kind === 'attempt') {
      const matchedUserIds = await searchUserIds(q);

      const attemptFilter: Record<string, unknown> = {};
      if (regex) {
        const orConditions: Array<Record<string, unknown>> = [{ quizTitle: regex }];
        if (matchedUserIds.length > 0) {
          orConditions.push({ userId: { $in: matchedUserIds } });
        }
        attemptFilter.$or = orConditions;
      }

      const [total, attempts] = await Promise.all([
        QuizAttempt.countDocuments(attemptFilter),
        QuizAttempt.find(attemptFilter)
          .sort({ startedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

      const userIds = Array.from(
        new Set(
          attempts
            .map((attempt: any) => String(attempt.userId || '').trim())
            .filter((id) => Types.ObjectId.isValid(id))
        )
      );
      const users = userIds.length
        ? await User.find({ _id: { $in: userIds } }).select('name email').lean()
        : [];
      const userMap = users.reduce((acc, user: any) => {
        acc[String(user._id)] = { name: user.name, email: user.email };
        return acc;
      }, {} as Record<string, { name?: string; email?: string }>);

      const items = attempts.map((attempt: any) => {
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
        const userId = String(attempt.userId || '');

        return {
          ...attempt,
          quizId: String(attempt.quizId || ''),
          userId,
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

      const totalPages = Math.max(1, Math.ceil(total / limit));
      return NextResponse.json({
        success: true,
        kind,
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    }

    if (kind === 'mock') {
      const matchedUserIds = await searchUserIds(q);
      const mockFilter: Record<string, unknown> = {};
      if (regex) {
        const orConditions: Array<Record<string, unknown>> = [{ quizTitle: regex }];
        if (matchedUserIds.length > 0) {
          const objectIds = matchedUserIds
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id));
          if (objectIds.length > 0) {
            orConditions.push({ userId: { $in: objectIds } });
          }
        }
        mockFilter.$or = orConditions;
      }

      const [total, items] = await Promise.all([
        MockResult.countDocuments(mockFilter),
        MockResult.find(mockFilter)
          .sort({ completedAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'name email')
          .lean(),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));
      return NextResponse.json({
        success: true,
        kind,
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    }

    const matchedUserIds = await searchUserIds(q);
    const quizNameIds = regex
      ? (
          await Quiz.find({ name: regex })
            .select({ _id: 1 })
            .lean<Array<{ _id: Types.ObjectId }>>()
        ).map((quiz) => quiz._id)
      : [];

    const quizFilter: Record<string, unknown> = {};
    if (regex) {
      const orConditions: Array<Record<string, unknown>> = [{ title: regex }];
      if (matchedUserIds.length > 0) {
        const studentIds = matchedUserIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id));
        if (studentIds.length > 0) {
          orConditions.push({ student: { $in: studentIds } });
        }
      }
      if (quizNameIds.length > 0) {
        orConditions.push({ quiz: { $in: quizNameIds } });
      }
      quizFilter.$or = orConditions;
    }

    const [total, items] = await Promise.all([
      Attempted.countDocuments(quizFilter),
      Attempted.find(quizFilter)
        .sort({ attemptedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('student', 'name email')
        .populate('quiz', 'name')
        .lean(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return NextResponse.json({
      success: true,
      kind,
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Failed to load admin result list:', error);
    return NextResponse.json({ success: false, message: 'Failed to load result list' }, { status: 500 });
  }
}
