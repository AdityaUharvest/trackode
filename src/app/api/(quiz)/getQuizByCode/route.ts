import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/util';
import Quiz from '@/app/model/Quiz';
import { getAppSettings } from "@/lib/settings";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const settings = await getAppSettings();
    const session = await auth();
    const isSuperAdmin = session?.user?.isSuperAdmin;

    // 1. Check Maintenance Mode
    if (settings.maintenanceMode && !isSuperAdmin) {
        return NextResponse.json({ 
            success: false, 
            message: "System is under maintenance. Please try again later.",
            maintenance: true 
        }, { status: 503 });
    }

    // 2. Check if Quizzes are enabled
    if (!settings.quizzesEnabled && !isSuperAdmin) {
        return NextResponse.json({ 
            success: false, 
            message: "Quizzes are currently disabled by the administrator." 
        }, { status: 403 });
    }

    const { code } = await request.json();
    
    const quiz = await Quiz.findOne({ shareCode: code });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // 3. Check if Public Quiz Join is allowed (if quiz is public)
    if (quiz.public && !settings.allowPublicQuizJoin && !isSuperAdmin) {
        return NextResponse.json({ 
            success: false, 
            message: "Public quiz joining is currently disabled by the administrator." 
        }, { status: 403 });
    }
    
    return NextResponse.json({ quizId: quiz._id });
  } catch (error) {
    console.error('Error fetching quiz by code:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}