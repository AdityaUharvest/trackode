import { NextRequest, NextResponse } from 'next/server';
import Question from '@/app/model/questions';
import connectDB from '@/lib/util';

export async function GET(
  request: NextRequest,
  { params }: any
  ) {
  try {
    await connectDB();
    
    const { id } = params;
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
    
    const { section, questions } = await request.json();
    
    // Delete existing questions for this section
    await Question.deleteMany({ 
      mockTestId: params.id, 
      section 
    });
    
    // Prepare new questions
    const questionDocs = questions.map((q: any) => ({
      mockTestId: params.id,
      section,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      
      createdAt: new Date()
    }));
    
    // Save new questions
    await Question.insertMany(questionDocs);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving questions:', error);
    return NextResponse.json(
      { message: 'Failed to save questions' },
      { status: 500 }
    );
  }
}