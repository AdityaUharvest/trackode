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
    const normalizedPercentages = attempts
      .map((attempt) => {
        const totalQuestions = Number(attempt.totalQuestions) || 0;
        const score = Number(attempt.score) || 0;
        if (totalQuestions <= 0) return 0;
        return (score / totalQuestions) * 100;
      });

    const averageScore =
      normalizedPercentages.reduce((sum, pct) => sum + pct, 0) /
      (normalizedPercentages.length || 1);
    const bestScore = Math.max(...normalizedPercentages);
    
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
    const rawDate = attempt.completedAt || attempt.updatedAt || attempt.startedAt;
    if (!rawDate) return;

    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) return;

    const dateStr = parsedDate.toISOString().split('T')[0];
    if (activityMap.has(dateStr)) {
      activityMap.set(dateStr, activityMap.get(dateStr) + 1);
    }
  });
  
  return Array.from(activityMap.entries()).map(([date, count]) => ({
    date,
    count
  }));
}