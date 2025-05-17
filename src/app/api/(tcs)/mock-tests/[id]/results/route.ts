import { NextResponse, NextRequest } from 'next/server';
import mongoose, { Types } from 'mongoose';
import QuizAttempt from '@/app/model/QuizAttempt';
import MockTest from '@/app/model/MoockTest';
import User from '@/app/model/User';
import Question from '@/app/model/MockQuestions';
import Section from '@/app/model/Section';
import MockResult from '@/app/model/MockResult';

// Define TypeScript interfaces
interface IQuestion {
  _id: Types.ObjectId;
  mockTestId: Types.ObjectId;
  section: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
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

interface IMockTest {
  _id: Types.ObjectId;
  title: string;
  createdBy: string;
}

interface IQuestionResult {
  _id: string;
  text: string;
  options: string[];
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}

interface ISectionResult {
  sectionName: string;
  correct: number;
  total: number;
  questions: IQuestionResult[];
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

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const quizId = id;

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Validate quizId
    if (!Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    // Get quiz details
    const quiz = await MockTest.findById(quizId).lean<IMockTest>();
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Get all sections
    const sections = await Section.find();
    const sectionNames = sections.map(section => section.value);

    // Fetch all questions
    const allQuestions = await Question.find({ mockTestId: quizId }).lean<IQuestion[]>();
    const questionsMap = new Map<string, IQuestion>();
    allQuestions.forEach(question => {
      questionsMap.set(question._id.toString(), question);
    });

    // Get all attempts
    const attempts = await QuizAttempt.find({ quizId }).lean<IQuizAttempt[]>();
    if (!attempts.length) {
      return NextResponse.json({
        quizId,
        quizTitle: quiz.title,
        totalParticipants: 0,
        attempts: [],
        createdBy: quiz.createdBy,
      });
    }

    // Get all unique user IDs
    const userIds = [...new Set(attempts.map(attempt => attempt.userId))];
    const users = await User.find({ 
      _id: { $in: userIds.map(id => new Types.ObjectId(id)) }
    }).lean<IUser[]>();
    const userMap = new Map<string, { name: string; email: string }>();
    users.forEach(user => {
      userMap.set(user._id.toString(), { name: user.name, email: user.email });
    });

    // Get existing MockResults
    const existingResults = await MockResult.find(
      {
        quizId: new Types.ObjectId(quizId),

        attemptId: { $in: attempts.map(attempt => new Types.ObjectId(attempt._id)) }
      }
    ).populate<{ userId: IPopulatedUserId; quizId: IPopulatedQuizId; }>('userId quizId')
      .lean() as unknown as IPopulatedMockResult[];
    
    const existingResultsMap = new Map<string, IPopulatedMockResult>();
    existingResults.forEach(result => {
      existingResultsMap.set(result.attemptId.toString(), result);
    });

    const results = await Promise.all(attempts.map(async (attempt) => {
      const attemptId = attempt._id.toString();
      const existingResult = existingResultsMap.get(attemptId);

      if (existingResult) {
        return {
          _id: attempt._id.toString(),
          userId: attempt.userId,
          userName: existingResult.userId.name || 'Unknown',
          email: existingResult.userId.email || '',
          quizTitle: existingResult.quizTitle,
          startedAt: attempt.startedAt,
          completedAt: attempt.completedAt,
          totalAnswered: existingResult.sections.reduce((sum, s) => sum + s.questions.length, 0),
          totalCorrect: existingResult.totalScore,
          totalQuestions: existingResult.totalQuestions,
          accuracy: existingResult.percentage,
          sectionStats: existingResult.sections.map(section => ({
            sectionName: section.sectionName,
            answered: section.questions.length,
            correct: section.correct,
            totalQuestions: section.total
          }))
        };
      }

      // Process new result
      const sectionResults: ISectionResult[] = sectionNames.map(sectionName => {
        const sectionAnswers = attempt.answers[sectionName] || {};
        const sectionQuestions = allQuestions.filter(q => q.section === sectionName);
        
        const questions = Object.entries(sectionAnswers)
          .map(([questionId, userAnswerIndex]): IQuestionResult | null => {
            const question = questionsMap.get(questionId);
            if (!question) return null;
            return {
              _id: question._id.toString(),
              text: question.text,
              options: question.options,
              userAnswer: userAnswerIndex,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation || ''
            };
          })
          .filter((q): q is IQuestionResult => q !== null);

        const correct = questions.reduce((sum, q) => sum + (q.userAnswer === q.correctAnswer ? 1 : 0), 0);
        const total = sectionQuestions.length;

        return { sectionName, correct, total, questions };
      });

      const totalScore = sectionResults.reduce((sum, section) => sum + section.correct, 0);
      const totalQuestions = allQuestions.length;
      const percentage = Math.round((totalScore / totalQuestions) * 100);
      const totalAnswered = sectionResults.reduce((sum, section) => sum + section.questions.length, 0);

      // Store new result
      await MockResult.create({
        userId: new Types.ObjectId(attempt.userId),
        quizId: new Types.ObjectId(quizId),
        quizTitle: attempt.quizTitle,
        attemptId: new Types.ObjectId(attempt._id),
        totalScore,
        totalQuestions,
        percentage,
        sections: sectionResults.map(section => ({
          sectionName: section.sectionName,
          correct: section.correct,
          total: section.total,
          questions: section.questions.map(q => ({
            questionId: new Types.ObjectId(q._id),
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.userAnswer === q.correctAnswer
          }))
        })),
        completedAt: attempt.completedAt || new Date()
      } as IMockResult);

      const userDetails = userMap.get(attempt.userId) || { name: 'Unknown', email: '' };

      return {
        _id: attempt._id.toString(),
        userId: attempt.userId,
        userName: userDetails.name,
        email: userDetails.email,
        quizTitle: attempt.quizTitle,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        totalAnswered,
        totalCorrect: totalScore,
        totalQuestions,
        accuracy: percentage,
        sectionStats: sectionResults.map(section => ({
          sectionName: section.sectionName,
          answered: section.questions.length,
          correct: section.correct,
          totalQuestions: section.total
        }))
      };
    }));

    // Sort by most recently completed first
    results.sort((a, b) => 
      (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
    );

    return NextResponse.json({
      quizId,
      quizTitle: quiz.title,
      totalParticipants: results.length,
      attempts: results,
      createdBy: quiz.createdBy,
    });

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}