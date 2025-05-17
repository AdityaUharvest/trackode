// app/api/mock-tests/[id]/feedback/route.ts
import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import MockResult from '@/app/model/MockResult';
import { auth } from '@/auth';

interface FeedbackRequest {
  type: 'overall' | 'section' | 'question';
  content: string;
  sectionName?: string;
  questionId?: string;
}

export async function POST(request: NextRequest, { params }: any) {
  try {

    const { id} = params;
    const { type, content, sectionName, questionId } = await request.json() as FeedbackRequest;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid attempt ID' }, { status: 400 });
    }

    let updateQuery: any;
    const now = new Date();

    switch (type) {
      case 'overall':
        updateQuery = {
          $set: {
            overallFeedback: {
              content,
              generatedAt: now
            }
          }
        };
        break;

      case 'section':
        if (!sectionName) {
          return NextResponse.json({ error: 'Section name is required' }, { status: 400 });
        }
        updateQuery = {
          $push: {
            sectionFeedbacks: {
              sectionName,
              feedback: content,
              generatedAt: now
            }
          }
        };
        break;

      case 'question':
        if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
          return NextResponse.json({ error: 'Valid question ID is required' }, { status: 400 });
        }
        updateQuery = {
          $push: {
            questionFeedbacks: {
              questionId: new mongoose.Types.ObjectId(questionId),
              explanation: content,
              generatedAt: now
            }
          }
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 });
    }

    const result = await MockResult.findOneAndUpdate(
      { attemptId: new mongoose.Types.ObjectId(id) },
      updateQuery,
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}