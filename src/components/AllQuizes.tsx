import React from 'react'
import Attempted from '@/app/model/Attempted';
import {auth} from "@/auth"
import PerformanceChart from './PerformanceChart';
import QuizHistory from './QuizHistory';
export default async function AllQuizes() {
    const session = await auth();
    let results = [];
      try {
        results = await Attempted.find({ student: session?.user?.id })
          .populate('quiz')
          .sort({ attemptedAt: -1 })
      
          
        
      } catch (error) {
        console.error('Failed to fetch quiz attempts:', error);
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-red-600 p-8 bg-white rounded-lg shadow-sm">
              Error loading dashboard data. Please try refreshing the page.
            </div>
          </div>
        );
      }
      const chartData = results.map(result => ({
        date: new Date(result.attemptedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        percentage: Number(((result.score / result.totalQuestions) * 100).toFixed(1)),
        fullDate: new Date(result.attemptedAt).toLocaleDateString(),
        score: result.score,
        total: result.totalQuestions
      })).reverse();
  return (

    <div>
      <QuizHistory results={results}/>
      <PerformanceChart chartData={chartData}/>
    </div>
  )
}
