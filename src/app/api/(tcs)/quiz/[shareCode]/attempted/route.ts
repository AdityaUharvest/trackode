// checking if the user has played this or not 
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/util';
import QuizAttempt from '@/app/model/QuizAttempt';
import { auth } from '@/auth';
import MockTest from '@/app/model/MoockTest';
export async function GET(req: NextRequest, { params }: any) {
    const { shareCode } = await params;
    await connectDB();
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({
            isAttempted: false,
            hasInProgress: false,
        });
    }

    const quiz = await MockTest.findOne({ shareCode });
    if (!quiz) {
        return NextResponse.json({
            isAttempted: false,
            hasInProgress: false,
        });
    }

    const attempt = (await QuizAttempt.findOne({ quizId: quiz._id, userId })
        .sort({ updatedAt: -1 })
        .lean()) as { _id: unknown; completedAt?: Date | null } | null;
    if (!attempt) {
        return NextResponse.json({
            isAttempted: false,
            hasInProgress: false,
        });
    }

    const isCompleted = Boolean(attempt.completedAt);

    return NextResponse.json({
        isAttempted: isCompleted,
        hasInProgress: !isCompleted,
        attemptId: String(attempt._id),
        completedAt: attempt.completedAt || null,
    });
}