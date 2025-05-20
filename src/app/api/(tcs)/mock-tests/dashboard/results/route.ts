// app/api/mock-tests/dashboard/results/route.ts
import { NextResponse } from 'next/server';
import MockResult from '@/app/model/MockResult';
import connectDB from '@/lib/util';
import { auth } from '@/auth';

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    const userId = session?.user?.id;

    const results = await MockResult.find({ userId })
      .sort({ completedAt: -1 })
      .lean();

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching mock results:', error);
    return NextResponse.json(
      { message: 'Failed to fetch mock results' },
      { status: 500 }
    );
  }
}