import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import mongoose, { Types } from 'mongoose';
import MockTest from '@/app/model/MoockTest';
import MockResult from '@/app/model/MockResult';
import connectDB from '@/lib/util';
import QuizAttempt from '@/app/model/QuizAttempt';
// Define TypeScript interfaces
interface IMockTest {
  _id: Types.ObjectId;
  title: string;
}
interface IQuizAttempt {
  _id: Types.ObjectId;
  userId: string;
  quizId: string;
  quizTitle: string;
  answers: Record<string, Record<string, number>>;
  startedAt: Date;
  completedAt?: Date;
}


interface IStoredQuestionResult {
  questionId: Types.ObjectId;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

interface IStoredSectionResult {
  sectionName: string;
  correct: number;
  total: number;
  questions: IStoredQuestionResult[];
}

interface IMockResult {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  quizTitle: string;
  attemptId: Types.ObjectId;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  sections: IStoredSectionResult[];
  completedAt: Date;
}

interface IPopulatedUserId {
  name: string;
  email: string;
  _id: Types.ObjectId;
}

interface IPopulatedQuizId {
  title: string;
  _id: Types.ObjectId;
}

interface IPopulatedMockResult extends Omit<IMockResult, 'userId' | 'quizId'> {
  userId: IPopulatedUserId;
  quizId: IPopulatedQuizId;
}

// Configure nodemailer transporter
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

// Function to generate enhanced email HTML for quiz results
const generateQuizResultEmail = (userName: string, quizTitle: string, attempt: any) => {
  const timeTaken = attempt.completedAt && attempt.startedAt
    ? ((new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000).toFixed(2)
    : '0.00';

  const sectionStatsHtml = Object.entries(attempt.sectionStats)
    .map(([section, stats]: [string, any]) => {
      if (stats.answered === 0) return '';
      const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
      return `
<div style="
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
">
  <h3 style="
    color: #1a202c;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #edf2f7;
  ">
    ${section
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')}
  </h3>
  
  <div style="
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 14px;
    color: #4a5568;
  ">
    <!-- Answered/Correct Stats -->
    <div style="
      flex: 1;
      padding: 8px;
      background: #f8fafc;
      border-radius: 6px;
      min-width: 0;
    ">
      <p style="margin: 0 0 8px; font-weight: 500;">Answered: 
        <strong style="color: #2d3748;">${stats.answered}/${stats.totalQuestions}</strong>
      </p>
      <p style="margin: 0; font-weight: 500;">Correct: 
        <strong style="color: #2d3748;">${stats.correct}/${stats.answered}</strong>
      </p>
    </div>
    
    <!-- Section Accuracy -->
    <div style="
      flex: 1;
      padding: 8px;
      background: #f8fafc;
      border-radius: 6px;
      min-width: 0;
    ">
      <p style="margin: 0 0 8px; font-weight: 500;">
        Section Accuracy: <strong style="color: #2d3748;">${Math.round((stats.correct / stats.answered) * 100)}%</strong>
      </p>
      <div style="
        width: 100%;
        height: 6px;
        background: #e2e8f0;
        border-radius: 3px;
        margin-top: 8px;
      ">
        <div style="
          width: ${Math.round((stats.correct / stats.answered) * 100)}%;
          height: 100%;
          background: #4299e1;
          border-radius: 3px;
        "></div>
      </div>
    </div>
    
    <!-- Overall Accuracy -->
    <div style="
      flex: 1;
      padding: 8px;
      background: #f8fafc;
      border-radius: 6px;
      min-width: 0;
    ">
      <p style="margin: 0 0 8px; font-weight: 500;">
        Overall Accuracy: <strong style="color: #2d3748;">${Math.round((stats.correct / stats.totalQuestions) * 100)}%</strong>
      </p>
      <div style="
        width: 100%;
        height: 6px;
        background: #e2e8f0;
        border-radius: 3px;
        margin-top: 8px;
      ">
        <div style="
          width: ${Math.round((stats.correct / stats.totalQuestions) * 100)}%;
          height: 100%;
          background: #48bb78;
          border-radius: 3px;
        "></div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (max-width: 640px) {
    div[style*='display: flex; flex-wrap: wrap; gap: 12px;'] > div {
      flex: 1 1 100%;
      min-width: 0;
    }
    div[style*='display: flex; flex-wrap: wrap; gap: 12px;'] {
      gap: 8px;
    }
    h3[style*='font-size: 16px;'] {
      font-size: 14px;
    }
    div[style*='padding: 16px;'] {
      padding: 12px;
    }
    div[style*='font-size: 14px;'] {
      font-size: 13px;
    }
  }
</style>
`;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trackode Quiz Results</title>
    </head>
    <body style="margin: 0; padding: 0; background: #edf2f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
      <div style="max-width: 640px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">Your Quiz Results</h1>
          <p style="color: #e6f0ff; font-size: 16px; margin: 8px 0 0;">${quizTitle}</p>
        </div>

        <!-- Content -->
        <div style="padding: 24px;">
          <p style="color: #1a202c; font-size: 16px; margin: 0 0 8px;">
            Hello <strong>${userName}</strong>,
          </p>
          <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0 0 24px;">
            Congratulations on completing the quiz! Here's a detailed look at your performance to help you shine even brighter next time.
          </p>

          <!-- Overall Performance -->
          <div style="background: #f7fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h3 style="color: #1a202c; font-size: 18px; font-weight: 600; margin: 0 0 16px;">Overall Performance</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; font-size: 14px; color: #4a5568;">
              <div>
                <p style="margin: 0 0 8px;"><strong>Score:</strong> ${attempt.totalCorrect}/${attempt.totalQuestions}</p>
                <p style="margin: 0;"><strong>Rank:</strong> ${attempt.rank || 'N/A'}</p>
              </div>
              <div>
                <p style="margin: 0 0 8px;"><strong>Accuracy:</strong> ${attempt.accuracy}%</p>
                <p style="margin: 0;"><strong>Time Taken:</strong> ${timeTaken} min</p>
              </div>
            </div>
          </div>

          <!-- Section Performance -->
          <h3 style="color: #1a202c; font-size: 18px; font-weight: 600; margin: 0 0 16px;">Section-wise Performance</h3>
          <div>
            ${sectionStatsHtml}
          </div>

          <!-- Improvement Tips -->
          <div style="background: #e9f7fe; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <h3 style="color: #1a202c; font-size: 16px; font-weight: 600; margin: 0 0 12px;">Level Up Your Skills</h3>
            <ul style="color: #4a5568; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.5;">
              <li>Revisit questions you missed to understand key concepts.</li>
              <li>Take more practice quizzes to build confidence.</li>
              <li>Use our dashboard to track your progress over time.</li>
            </ul>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://trackode.in/programming-quizzes" style="display: inline-block; background: #4299e1; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              Explore More Quizzes
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #2d3748; padding: 16px; text-align: center;">
          
          <p style="color: #e2e8f0; font-size: 14px; margin: 0 0 8px;">
            Best regards, <strong>The Trackode Team</strong>
          </p>
          <p style="color: #a0aec0; font-size: 12px; margin: 0 0 8px;">
            <a href="https://trackode.in" style="color: #63b3ed; text-decoration: none;">Trackode - Every Quiz ups you to success</a>
          </p>
          <p style="color: #a0aec0; font-size: 12px; margin: 0;">
            <a href="https://www.linkedin.com/in/iamadityaupadhyay/" style="color: #63b3ed; text-decoration: none;">Aditya Upadhyay</a> |
            <a href="https://twitter.com/iamadiupadhyay" style="color: #63b3ed; text-decoration: none;">Twitter</a> |
            <a href="https://linkedin.com/company/trackode" style="color: #63b3ed; text-decoration: none;">LinkedIn</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// API Handler
export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const { quizId } = await request.json();

    // Validate quizId
    if (!quizId || !Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid quiz ID' },
        { status: 400 }
      );
    }

    // Get quiz details
    const quiz = await MockTest.findById(quizId).lean<IMockTest>();
    if (!quiz) {
      return NextResponse.json(
        { success: false, message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get all MockResults for the quiz
    const mockResults = await MockResult.find({ quizId: new Types.ObjectId(quizId) })
      .populate<{ userId: IPopulatedUserId; quizId: IPopulatedQuizId; }>('userId quizId')
      .lean() as unknown as IPopulatedMockResult[];

    if (!mockResults.length) {
      return NextResponse.json(
        { success: true, message: 'No results found for this quiz' },
        { status: 200 }
      );
    }

    // Get all attempts to retrieve startedAt timestamps
    const attemptIds = mockResults.map(result => result.attemptId);
    const attempts = await QuizAttempt.find({ _id: { $in: attemptIds } }).lean<IQuizAttempt[]>();
    const attemptMap = new Map<string, IQuizAttempt>();
    attempts.forEach(attempt => {
      attemptMap.set(attempt._id.toString(), attempt);
    });

    // Prepare results
    const results = mockResults.map((result, index) => {
      const attempt = attemptMap.get(result.attemptId.toString());
      return {
        _id: result.attemptId.toString(),
        userId: result.userId._id.toString(),
        userName: result.userId.name || 'Unknown',
        email: result.userId.email || '',
        quizTitle: result.quizTitle,
        startedAt: attempt?.startedAt || new Date(),
        completedAt: result.completedAt,
        totalAnswered: result.sections.reduce((sum, s) => sum + s.questions.length, 0),
        totalCorrect: result.totalScore,
        totalQuestions: result.totalQuestions,
        accuracy: result.percentage,
        sectionStats: result.sections.reduce((acc, section) => ({
          ...acc,
          [section.sectionName]: {
            answered: section.questions.length,
            correct: section.correct,
            totalQuestions: section.total
          }
        }), {}),
        rank: 0 // Will be updated after sorting
      };
    });

    // Sort by accuracy (descending) and assign ranks
    results.sort((a, b) => b.accuracy - a.accuracy);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    // Send emails to each participant
    const emailPromises = results.map(async (attempt) => {
      if (!attempt.email) {
        console.warn(`No email found for user: ${attempt.userName}`);
        return;
      }

      const mailOptions = {
        from: `"Trackode Team" <${process.env.OTP_EMAIL_USER}>`,
        to: attempt.email,
        subject: `Your Results for ${quiz.title} - Trackode`,
        html: generateQuizResultEmail(attempt.userName, quiz.title, attempt),
      };

      await transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    return NextResponse.json(
      { success: true, message: 'Quiz results sent successfully to all participants' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending quiz results:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send quiz results', error: (error as Error).message },
      { status: 500 }
    );
  }
}