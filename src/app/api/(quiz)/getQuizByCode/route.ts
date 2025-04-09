import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import Quiz from '@/app/model/Quiz';

export async function POST(request:NextRequest) {
  try {
    const { code } = await request.json();
    await connectDB();
    
    const quiz = await Quiz.findOne({ shareCode: code });
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    
    return NextResponse.json({ quizId: quiz._id });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}