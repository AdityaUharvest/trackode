import { NextResponse ,NextRequest} from 'next/server';
import QuizAttempt from '@/app/model/QuizAttempt';
import connectDB from '@/lib/util';
import MockTest from '@/app/model/MoockTest';
import Question from '@/app/model/MockQuestions';
import { auth } from '@/auth';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeSectionName(sectionName: string): string {
  return sectionName.trim().toLowerCase();
}

type QuestionMeta = {
  sectionName: string;
  normalizedSectionName: string;
  optionCount: number;
};

function sanitizeAnswers(
  input: unknown,
  questionMetaById: Map<string, QuestionMeta>
): Record<string, Record<string, number>> {
  if (!isRecord(input)) return {};

  const sanitized: Record<string, Record<string, number>> = {};
  for (const [sectionName, sectionValue] of Object.entries(input)) {
    if (sectionName.includes('.') || sectionName.includes('$')) continue;
    if (!isRecord(sectionValue) || !sectionName) continue;

    const normalizedSection = normalizeSectionName(sectionName);

    for (const [questionId, answerIndex] of Object.entries(sectionValue)) {
      if (questionId.includes('.') || questionId.includes('$')) continue;
      if (typeof answerIndex !== 'number' || !Number.isInteger(answerIndex)) continue;

      const questionMeta = questionMetaById.get(questionId);
      if (!questionMeta) continue;
      if (questionMeta.normalizedSectionName !== normalizedSection) continue;
      if (answerIndex < 0 || answerIndex >= questionMeta.optionCount) continue;

      if (!sanitized[questionMeta.sectionName]) {
        sanitized[questionMeta.sectionName] = {};
      }

      sanitized[questionMeta.sectionName][questionId] = answerIndex;
    }
  }

  return sanitized;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareCode?: string }> }
) {
  try {
    await connectDB();
    const { shareCode } = await params;
    if (!shareCode) {
      return NextResponse.json(
        { message: 'Missing share code' },
        { status: 400 }
      );
    }

    const { answers } = await request.json();
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const quiz = await MockTest.findOne({ shareCode: shareCode });
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }
    if (!quiz.isPublished) {
      return NextResponse.json(
        { message: 'Quiz is not published' },
        { status: 403 }
      );
    }

    const quizQuestions = await Question.find({ mockTestId: quiz._id })
      .select({ _id: 1, section: 1, options: 1 })
      .lean<Array<{ _id: unknown; section?: string; options?: string[] }>>();

    const questionMetaById = new Map<string, QuestionMeta>();
    quizQuestions.forEach((question) => {
      const sectionName = (question.section || '').trim();
      if (!sectionName) return;

      questionMetaById.set(String(question._id), {
        sectionName,
        normalizedSectionName: normalizeSectionName(sectionName),
        optionCount: Array.isArray(question.options) ? question.options.length : 0,
      });
    });

    const sanitizedAnswers = sanitizeAnswers(answers, questionMetaById);
    
    const completionSetPayload: Record<string, unknown> = {
      completedAt: new Date(),
    };
    if (Object.keys(sanitizedAnswers).length > 0) {
      completionSetPayload.answers = sanitizedAnswers;
    }

    const activeAttempt = await QuizAttempt.findOneAndUpdate(
      {
        quizId: quiz._id,
        userId,
        $or: [{ completedAt: null }, { completedAt: { $exists: false } }]
      },
      {
        $set: completionSetPayload
      },
      { new: true }
    );

    if (!activeAttempt) {
      const existingCompletedAttempt = await QuizAttempt.findOne({
        quizId: quiz._id,
        userId,
        completedAt: { $ne: null }
      }).sort({ completedAt: -1 });

      if (!existingCompletedAttempt) {
        await QuizAttempt.create({
          quizId: quiz._id,
          userId,
          quizTitle: quiz.title,
          quizDescription: quiz.description,
          startedAt: new Date(),
          completedAt: new Date(),
          answers: sanitizedAnswers,
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing quiz:', error);
    return NextResponse.json(
      { message: 'Failed to complete quiz' },
      { status: 500 }
    );
  }
}