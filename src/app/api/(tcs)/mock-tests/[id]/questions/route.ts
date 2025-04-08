import { NextRequest, NextResponse } from 'next/server';
import Question from '@/app/model/MockQuestions';
import connectDB from '@/lib/util';

export async function GET(
  request: NextRequest,
  { params }:any
) {
  try {
    await connectDB();
    
    const { id } =await params;
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    const query: any = { mockTestId: id };
    if (section) query.section = section;
    
    const questions = await Question.find(query);
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }:any
) {
  try {
    await connectDB();
    
    const { id } =await params;
    const { section, questions } = await request.json();
    
    // Validate input
    if (!section || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Delete existing questions for this section
    await Question.deleteMany({ 
      mockTestId: id, 
      section 
    });
    
    // Prepare new questions without explanations
    const questionDocs = questions.map((q: any) => ({
      mockTestId: id,
      section,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      createdAt: new Date()
    }));
    
    // Save all questions at once
    await Question.insertMany(questionDocs);
    
    return NextResponse.json({ 
      success: true,
      count: questionDocs.length 
    });
  } catch (error) {
    console.error('Error saving questions:', error);
    return NextResponse.json(
      { message: 'Failed to save questions' },
      { status: 500 }
    );
  }
}