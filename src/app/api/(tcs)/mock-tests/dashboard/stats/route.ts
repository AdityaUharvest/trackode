import { NextResponse ,NextRequest} from 'next/server';

import QuizAttempt from '@/app/model/QuizAttempt';
import connectDB from '@/lib/util';
import { auth } from '@/auth';
export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await auth();
    // In a real app, you'd use the authenticated user's ID
    const userId = session?.user?.id;
    
    const attempts = await QuizAttempt.find({ userId }).lean();
    
    if (attempts.length === 0) {
      return NextResponse.json({
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        sectionPerformance: [],
        recentActivity: []
      });
    }
    
    // Calculate stats
    const totalAttempts = attempts.length;
    const averageScore = attempts.reduce((sum, attempt) => 
      sum + (attempt.score / attempt.totalQuestions) * 100, 0) / totalAttempts;
    const bestScore = Math.max(...attempts.map(attempt => 
      (attempt.score / attempt.totalQuestions) * 100
    ));
    
    // Calculate section performance
    const sectionPerformance = calculateSectionPerformance(attempts);
    
    // Calculate recent activity (last 7 days)
    const recentActivity = calculateRecentActivity(attempts);
    
    return NextResponse.json({
      totalAttempts,
      averageScore,
      bestScore,
      sectionPerformance,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

function calculateSectionPerformance(attempts: any[]) {
  // Group by section and calculate accuracy
  const sectionMap = new Map();
  
  attempts.forEach(attempt => {
    Object.entries(attempt.sectionScores || {}).forEach(([section, scores]: [string, any]) => {
      if (!sectionMap.has(section)) {
        sectionMap.set(section, { correct: 0, total: 0 });
      }
      sectionMap.get(section).correct += scores.correct;
      sectionMap.get(section).total += scores.total;
    });
  });
  
  return Array.from(sectionMap.entries()).map(([section, { correct, total }]) => ({
    section,
    accuracy: total > 0 ? (correct / total) * 100 : 0
  }));
}

function calculateRecentActivity(attempts: any[]) {
  const activityMap = new Map();
  const today = new Date();
  
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    activityMap.set(dateStr, 0);
  }
  
  // Count attempts per day
  attempts.forEach(attempt => {
    const dateStr = new Date(attempt.completedAt).toISOString().split('T')[0];
    if (activityMap.has(dateStr)) {
      activityMap.set(dateStr, activityMap.get(dateStr) + 1);
    }
  });
  
  return Array.from(activityMap.entries()).map(([date, count]) => ({
    date,
    count
  }));
}