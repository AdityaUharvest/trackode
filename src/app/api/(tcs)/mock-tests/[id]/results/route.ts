import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockTest from '@/app/model/MoockTest';
import User from '@/app/model/User';
import Question from '@/app/model/MockQuestions';
import Section from '@/app/model/Section';

// Define TypeScript interfaces for your models
interface IQuestion {
  _id: mongoose.Types.ObjectId;
  mockTestId: mongoose.Types.ObjectId;
  section: string;
  correctAnswer: number;
  // Add other question properties
}

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  // Add other user properties
}

interface IQuizAttempt {
  _id: mongoose.Types.ObjectId;
  userId: string;
  quizId: string;
  quizTitle: string;
  answers: Record<string, Record<string, number>>;
  startedAt: Date;
  completedAt?: Date;
  // Add other attempt properties
}

interface IMockTest {
  _id: mongoose.Types.ObjectId;
  title: string;
  // Add other quiz properties
}

export async function GET(request: NextRequest, { params }: any) {
  try {
    const id = params.id;
    const quizId = id;
    
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    // Get the quiz details with proper typing
    const quiz = await MockTest.findById(quizId).lean<IMockTest>();
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    const section = await Section.find();
    console.log(section)
    let sections=<any>[]
    for(let i =0;i<section.length;i++){
      sections.push(section[i].value);
    }
    console.log(sections);

    // Fetch all questions with proper typing
    const allQuestions = await Question.find({ mockTestId: quizId }).lean<IQuestion[]>();

    // Create a map of correct answers
    const correctAnswersMap = new Map<string, number>();
    allQuestions.forEach((question) => {
      correctAnswersMap.set(question._id.toString(), question.correctAnswer);
    });

    // Get all attempts with proper typing
    const attempts = await QuizAttempt.find({ quizId }).lean<IQuizAttempt[]>();

    // Get all unique user IDs from attempts
    const userIds = [...new Set(attempts.map(attempt => attempt.userId))];

    // Fetch all users with proper typing
    const users = await User.find({ 
      _id: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) }
    }).lean<IUser[]>();

    // Create a user map
    const userMap = new Map<string, { name: string; email: string }>();
    users.forEach((user) => {
      userMap.set(user._id.toString(), {
        name: user.name,
        email: user.email
      });
    });

    // Process results
    const results = attempts.map((attempt) => {
      const sectionStats: Record<string, { 
        answered: number; 
        correct: number;
        totalQuestions: number;
      }> = {};

      // Initialize section stats
      sections.forEach((section:any) => {
        sectionStats[section] = {
          answered: 0,
          correct: 0,
          totalQuestions: allQuestions.filter(q => q.section === section).length
        };
      });

      let totalAnswered = 0;
      let totalCorrect = 0;
      const totalQuestions = allQuestions.length;

      // Process each section's answers
      sections.forEach((section:any) => {
        const sectionAnswers = attempt.answers[section] || {};
        const answered = Object.keys(sectionAnswers).length;
        let correct = 0;

        Object.entries(sectionAnswers).forEach(([questionId, userAnswerIndex]) => {
          const correctAnswerIndex = correctAnswersMap.get(questionId);
          if (typeof correctAnswerIndex === 'number' && 
              typeof userAnswerIndex === 'number' && 
              userAnswerIndex === correctAnswerIndex) {
            correct++;
          }
        });

        sectionStats[section] = { 
          answered,
          correct,
          totalQuestions: sectionStats[section].totalQuestions
        };

        totalAnswered += answered;
        totalCorrect += correct;
      });

      const userDetails = userMap.get(attempt.userId) || { 
        name: 'Unknown', 
        email: '' 
      };

      return {
        _id: attempt._id.toString(),  // Explicitly convert to string
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
        sectionStats
      };
    });

    // Sort by most recently completed first
    results.sort((a, b) => 
      (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
    );
    
    return NextResponse.json({
      quizId,
      quizTitle: quiz.title,
      totalParticipants: results.length,
      attempts: results
    });

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}