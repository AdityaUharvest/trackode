import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockTest from '@/app/model/MoockTest';
import User from '@/app/model/User';
import Question from '@/app/model/MockQuestions';
import Section from '@/app/model/Section';
import connectDB from '@/lib/util';

// Define TypeScript interfaces for your models
interface IQuestion {
  _id: mongoose.Types.ObjectId;
  mockTestId: mongoose.Types.ObjectId;
  section: string;
  correctAnswer: number;
}

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
}

interface IQuizAttempt {
  _id: mongoose.Types.ObjectId;
  userId: string;
  quizId: string;
  quizTitle: string;
  answers: Record<string, Record<string, number>>;
  startedAt: Date;
  completedAt?: Date;
}

interface IMockTest {
  _id: mongoose.Types.ObjectId;
  title: string;
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

// Function to generate email HTML for quiz results
const generateQuizResultEmail = (userName: string, quizTitle: string, attempt: any) => {
  const sectionStatsHtml = Object.entries(attempt.sectionStats)
    .map(([section, stats]: [string, any]) => {
      if (stats.answered === 0) return '';
      return `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 18px;">${section
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}</h3>
          <p>Answered: ${stats.answered}/${stats.totalQuestions}</p>
          <p>Correct: ${stats.correct}/${stats.answered}</p>
          <p>Accuracy: ${Math.round((stats.correct / stats.answered) * 100)}%</p>
        </div>
      `;
    })
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333; text-align: center;">Quiz Results for ${quizTitle}</h2>
      <p style="color: #555;">Dear ${userName},</p>
      <p style="color: #555;">Thank you for participating in the quiz. Below are your detailed results:</p>
      
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Overall Performance</h3>
        <p><strong>Total Answered:</strong> ${attempt.totalAnswered}/${attempt.totalQuestions}</p>
        <p><strong>Total Correct:</strong> ${attempt.totalCorrect}/${attempt.totalQuestions}</p>
        <p><strong>Accuracy:</strong> ${attempt.accuracy}%</p>
        <p><strong>Rank:</strong> ${attempt.rank || 'N/A'}</p>
        <p><strong>Time Taken:</strong> ${(
          (new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000
        ).toFixed(2)} minutes</p>
      </div>
      
      <h3 style="color: #333; font-size: 20px;">Section-wise Performance</h3>
      ${sectionStatsHtml}
      
      <p style="color: #555;">Keep practicing to improve your performance!</p>
      <p style="color: #555;">Best regards,<br />The Trackode Team</p>
      <p style="color: #888; font-size: 12px; text-align: center;">
        Visit: <a href="https://www.trackode.in" style="color: #007bff;">www.trackode.in</a>
      </p>
      <p style="color: #888; font-size: 12px; text-align: center;">
        <a href="https://www.linkedin.com/in/iamadityaupadhyay/" style="color: #007bff;">Best Regards Aditya Upadhyay</a>
      </p>

    </div>
  `;
};

// API Handler
export async function POST(request: NextRequest) {
  await connectDB();
  try {
    // Connect to MongoDB


    const { quizId } = await request.json();

    // Validate quizId
    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid quiz ID' },
        { status: 400 }
      );
    }

    // Get the quiz details
    const quiz = await MockTest.findById(quizId).lean<IMockTest>();
    if (!quiz) {
      return NextResponse.json(
        { success: false, message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Fetch sections
    const section = await Section.find();
    let sections: string[] = [];
    for (let i = 0; i < section.length; i++) {
      sections.push(section[i].value);
    }

    // Fetch all questions
    const allQuestions = await Question.find({ mockTestId: quizId }).lean<IQuestion[]>();

    // Create a map of correct answers
    const correctAnswersMap = new Map<string, number>();
    allQuestions.forEach((question) => {
      correctAnswersMap.set(question._id.toString(), question.correctAnswer);
    });

    // Get all attempts
    const attempts = await QuizAttempt.find({ quizId }).lean<IQuizAttempt[]>();

    // Get all unique user IDs from attempts
    const userIds = [...new Set(attempts.map((attempt) => attempt.userId))];

    // Fetch all users
    const users = await User.find({
      _id: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).lean<IUser[]>();

    // Create a user map
    const userMap = new Map<string, { name: string; email: string }>();
    users.forEach((user) => {
      userMap.set(user._id.toString(), {
        name: user.name,
        email: user.email,
      });
    });

    // Process results
    const results = attempts.map((attempt, index) => {
      const sectionStats: Record<
        string,
        { answered: number; correct: number; totalQuestions: number }
      > = {};

      // Initialize section stats
      sections.forEach((section) => {
        sectionStats[section] = {
          answered: 0,
          correct: 0,
          totalQuestions: allQuestions.filter((q) => q.section === section).length,
        };
      });

      let totalAnswered = 0;
      let totalCorrect = 0;
      const totalQuestions = allQuestions.length;

      // Process each section's answers
      sections.forEach((section) => {
        const sectionAnswers = attempt.answers[section] || {};
        const answered = Object.keys(sectionAnswers).length;
        let correct = 0;

        Object.entries(sectionAnswers).forEach(([questionId, userAnswerIndex]) => {
          const correctAnswerIndex = correctAnswersMap.get(questionId);
          if (
            typeof correctAnswerIndex === 'number' &&
            typeof userAnswerIndex === 'number' &&
            userAnswerIndex === correctAnswerIndex
          ) {
            correct++;
          }
        });

        sectionStats[section] = {
          answered,
          correct,
          totalQuestions: sectionStats[section].totalQuestions,
        };

        totalAnswered += answered;
        totalCorrect += correct;
      });

      const userDetails =
        userMap.get(attempt.userId) || { name: 'Unknown', email: '' };

      return {
        _id: attempt._id.toString(),
        userId: attempt.userId,
        userName: userDetails.name,
        email: userDetails.email,
        quizTitle: attempt.quizTitle,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        totalAnswered,
        totalCorrect,
        totalQuestions,
        accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
        sectionStats,
        rank: index + 1, // Add rank based on sorting
      };
    });

    // Sort by accuracy (descending) to assign ranks correctly
    results.sort((a, b) => b.accuracy - a.accuracy);

    // Send emails to each student
    const emailPromises = results.map(async (attempt, index) => {
      if (!attempt.email) {
        console.warn(`No email found for user: ${attempt.userName}`);
        return;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: attempt.email,
        subject: `Your Quiz Results for ${quiz.title}`,
        html: generateQuizResultEmail(attempt.userName, quiz.title, {
          ...attempt,
          rank: index + 1, // Update rank based on sorted order
        }),
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