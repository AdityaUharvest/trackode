import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/util';
import { getSuperAdminSession } from '@/lib/superAdmin';
import MockTest from '@/app/model/MoockTest';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockResult from '@/app/model/MockResult';
import User from '@/app/model/User';

type LeaderboardRow = {
  attemptId: string;
  userId: string;
  userName: string;
  email: string;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  rank: number;
};

const transporter = nodemailer.createTransport({
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

async function loadLeaderboard(quizId: string, request: NextRequest): Promise<{ leaderboardFinalized: boolean; rows: LeaderboardRow[] }> {
  const origin = request.nextUrl.origin;
  const response = await fetch(`${origin}/api/mock-tests/${quizId}/results?page=1&limit=1000`, { cache: 'no-store' });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to load leaderboard');
  }

  const rows: LeaderboardRow[] = Array.isArray(payload?.attempts)
    ? payload.attempts.map((attempt: any) => ({
        attemptId: String(attempt?._id || ''),
        userId: String(attempt?.userId || ''),
        userName: String(attempt?.userName || 'Participant'),
        email: String(attempt?.email || ''),
        totalCorrect: Number(attempt?.totalCorrect || 0),
        totalQuestions: Number(attempt?.totalQuestions || 0),
        accuracy: Number(attempt?.accuracy || 0),
        rank: Number(attempt?.rank || 0),
      }))
    : [];

  return {
    leaderboardFinalized: Boolean(payload?.leaderboardFinalized),
    rows,
  };
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    const { isAllowed } = await getSuperAdminSession();
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid mock id' }, { status: 400 });
    }

    const body = await request.json();
    const attemptId = String(body?.attemptId || '').trim();
    if (!attemptId || !Types.ObjectId.isValid(attemptId)) {
      return NextResponse.json({ success: false, message: 'Invalid attempt id' }, { status: 400 });
    }

    await connectDB();

    const quiz = await MockTest.findById(id).lean<any>();
    if (!quiz) {
      return NextResponse.json({ success: false, message: 'Mock not found' }, { status: 404 });
    }

    const attempt = await QuizAttempt.findById(attemptId).lean<any>();
    if (!attempt || String(attempt.quizId) !== String(id)) {
      return NextResponse.json({ success: false, message: 'Attempt not found for this mock' }, { status: 404 });
    }

    const { leaderboardFinalized, rows } = await loadLeaderboard(id, request);
    if (!leaderboardFinalized) {
      return NextResponse.json(
        { success: false, message: 'Leaderboard is still live. Certificates can be mailed after finalization.' },
        { status: 409 }
      );
    }

    const row = rows.find((item) => item.attemptId === attemptId);
    if (!row) {
      return NextResponse.json({ success: false, message: 'Participant is not in the finalized leaderboard' }, { status: 404 });
    }

    if (!row.email) {
      return NextResponse.json({ success: false, message: 'Participant email is not available' }, { status: 400 });
    }

    const quizObjectId = new Types.ObjectId(id);
    const userObjectId = new Types.ObjectId(row.userId);
    const certificateId = `TRK-${id.slice(-6).toUpperCase()}-${row.userId.slice(-6).toUpperCase()}`;
    const rank = Number(row.rank || 0);
    const badgeLabel: 'Winner' | 'Participant' = rank > 0 && rank <= 3 ? 'Winner' : 'Participant';

    const resultDoc = await MockResult.findOne({ attemptId: new Types.ObjectId(attemptId) }).lean<any>();
    const score = Number(resultDoc?.totalScore || row.totalCorrect || 0);
    const totalQuestions = Number(resultDoc?.totalQuestions || row.totalQuestions || 0);
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : Number(row.accuracy || 0);

    await User.updateOne(
      {
        _id: userObjectId,
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
          achievements: {
            type: 'certificate',
            certificateId,
            rank,
            positionLabel: `${getOrdinal(rank)} Position`,
            badgeLabel,
            quizTitle: quiz?.title || attempt?.quizTitle || 'Mock Test',
            quizId: quizObjectId,
            score,
            totalQuestions,
            percentage,
            date: attempt?.completedAt || new Date(),
          },
        },
      }
    );

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const verifyUrl = `${appBaseUrl}/certificate/verify/${encodeURIComponent(certificateId)}`;

    await transporter.sendMail({
      from: `"Trackode Team" <${process.env.OTP_EMAIL_USER}>`,
      to: row.email,
      subject: `Certificate Awarded: ${quiz?.title || attempt?.quizTitle || 'Mock Test'}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a; max-width: 640px; margin: 0 auto; padding: 20px;">
          <h2 style="margin-bottom: 8px;">Congratulations, ${row.userName || 'Participant'}!</h2>
          <p style="margin-top: 0; color: #334155;">Your certificate is ready for <strong>${quiz?.title || attempt?.quizTitle || 'Mock Test'}</strong>.</p>
          <div style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin: 16px 0; background: #f8fafc;">
            <p style="margin: 0 0 6px;"><strong>Rank:</strong> ${getOrdinal(rank)} Position</p>
            <p style="margin: 0 0 6px;"><strong>Status:</strong> ${badgeLabel}</p>
            <p style="margin: 0 0 6px;"><strong>Score:</strong> ${score}/${totalQuestions}</p>
            <p style="margin: 0 0 6px;"><strong>Accuracy:</strong> ${percentage}%</p>
            <p style="margin: 0;"><strong>Certificate ID:</strong> ${certificateId}</p>
          </div>
          <p style="color: #475569;">You can download your certificate from your profile.</p>
          <p style="color: #475569;">Verify certificate: <a href="${verifyUrl}">${verifyUrl}</a></p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Certificate email sent to ${row.email}`,
      certificateId,
    });
  } catch (error) {
    console.error('Failed to send certificate email:', error);
    return NextResponse.json({ success: false, message: 'Failed to send certificate email' }, { status: 500 });
  }
}
