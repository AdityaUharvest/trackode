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

    type AttemptLean = { _id: unknown; completedAt?: Date | null; startedAt?: Date; answers?: Record<string, unknown>; proctoring?: { fullscreenExitCount?: number } };

    const [activeAttempt, latestCompletedAttempt] = await Promise.all([
        QuizAttempt.findOne({
            quizId: quiz._id,
            userId,
            $or: [{ completedAt: null }, { completedAt: { $exists: false } }]
        })
            .sort({ updatedAt: -1 })
            .select({ _id: 1, startedAt: 1, completedAt: 1, answers: 1, 'proctoring.fullscreenExitCount': 1 })
            .lean() as Promise<AttemptLean | null>,
        QuizAttempt.findOne({
            quizId: quiz._id,
            userId,
            completedAt: { $ne: null }
        })
            .sort({ completedAt: -1 })
            .select({ _id: 1, completedAt: 1 })
            .lean() as Promise<AttemptLean | null>
    ]);

    if (!activeAttempt && !latestCompletedAttempt) {
        return NextResponse.json({
            isAttempted: false,
            hasInProgress: false,
        });
    }

    // Auto-expire in-progress attempt if quiz duration has elapsed
    let effectiveActiveAttempt = activeAttempt;
    if (activeAttempt && quiz.durationMinutes) {
        const startedMs = activeAttempt.startedAt ? new Date(activeAttempt.startedAt).getTime() : 0;
        const expiredAt = startedMs + (quiz.durationMinutes as number) * 60 * 1000;
        if (startedMs > 0 && Date.now() > expiredAt) {
            await QuizAttempt.updateOne(
                { _id: activeAttempt._id, $or: [{ completedAt: null }, { completedAt: { $exists: false } }] },
                { $set: { completedAt: new Date() } }
            );
            // Treat the now-completed attempt as a completed one
            effectiveActiveAttempt = null;
            if (!latestCompletedAttempt) {
                return NextResponse.json({
                    isAttempted: true,
                    hasInProgress: false,
                    wasAutoCompleted: true,
                    attemptId: String(activeAttempt._id),
                    completedAt: new Date(),
                });
            }
        }
    }

    const referenceAttempt = effectiveActiveAttempt || latestCompletedAttempt;
    const hasInProgress = Boolean(effectiveActiveAttempt);
    const isCompleted = Boolean(latestCompletedAttempt);

    // Collect the section names that already have answers saved for an in-progress attempt
    const submittedSections: string[] = [];
    if (hasInProgress && effectiveActiveAttempt?.answers && typeof effectiveActiveAttempt.answers === 'object') {
        for (const sectionName of Object.keys(effectiveActiveAttempt.answers)) {
            const sectionObj = (effectiveActiveAttempt.answers as Record<string, unknown>)[sectionName];
            if (sectionObj && typeof sectionObj === 'object' && Object.keys(sectionObj).length > 0) {
                submittedSections.push(sectionName);
            }
        }
    }

    return NextResponse.json({
        isAttempted: isCompleted,
        hasInProgress,
        attemptId: referenceAttempt ? String(referenceAttempt._id) : null,
        completedAt: latestCompletedAttempt?.completedAt || null,
        submittedSections,
        fullscreenExitCount: effectiveActiveAttempt?.proctoring?.fullscreenExitCount ?? 0,
    });
}