// app/api/mock-tests/dashboard/results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import MockResult from '@/app/model/MockResult';
import connectDB from '@/lib/util';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const userId = session?.user?.id;
    const pageParam = Number.parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limitParam = Number.parseInt(request.nextUrl.searchParams.get('limit') || '20', 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 20;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      MockResult.find({ userId })
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MockResult.countDocuments({ userId }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data: results,
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
    console.error('Error fetching mock results:', error);
    return NextResponse.json(
      { message: 'Failed to fetch mock results' },
      { status: 500 }
    );
  }
}