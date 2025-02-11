import React from 'react';
import { auth } from "@/auth";
import connectDB from "@/lib/util";
import Attempted from "@/app/model/Attempted";
import PerformanceChart from "@/components/PerformanceChart";
import QuizHistory from "@/components/QuizHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import FormattedDateTime from '@/components/FormattedDateTime';

// In your dashboard component:

export default async function StudentDashboard() {
  await connectDB();
  const session = await auth();
  
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Please login to view dashboard</h2>
          <a 
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login Now
          </a>
        </div>
      </div>
    );
  }

  let quizResults = [];
  try {
    quizResults = await Attempted.find({ student: session.user.id })
      .populate('quiz')
      .sort({ attemptedAt: -1 })
      .limit(5);
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
  console.log(quizResults[0].attemptedAt)

  // Calculate quiz statistics
  const totalQuizzes = quizResults.length;
  const percentages = quizResults.map(
    result => Number(((result.score / result.totalQuestions) * 100).toFixed(1))
  );
  const averagePercentage = totalQuizzes > 0 ? 
    (percentages.reduce((a, b) => a + Number(b), 0) / totalQuizzes).toFixed(1) : 0;
  const highestPercentage = totalQuizzes > 0 ? 
    Math.max(...percentages.map(p => Number(p))).toFixed(1) : 0;
  const recentPercentage = totalQuizzes > 0 ? percentages[0] : 0;

  const chartData = quizResults.map(result => ({
    date: new Date(result.attemptedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    percentage: Number(((result.score / result.totalQuestions) * 100).toFixed(1)),
    fullDate: new Date(result.attemptedAt).toLocaleDateString(),
    score: result.score,
    total: result.totalQuestions
  })).reverse();

  let accuracyTrend = 'stable';
  if (totalQuizzes >= 6) {
    const firstThree = percentages.slice(-3).reduce((a, b) => a + Number(b), 0) / 3;
    const lastThree = percentages.slice(0, 3).reduce((a, b) => a + Number(b), 0) / 3;
    accuracyTrend = lastThree > firstThree ? 'improving' : lastThree < firstThree ? 'declining' : 'stable';
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-300 flex items-center gap-3">
            <span className="bg-blue-600 p-3 rounded-lg">
              📊
            </span>
            Student Dashboard
          </h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-gray-700">
              Quizzes
            </TabsTrigger>
            {/* <TabsTrigger value="assignments" className="data-[state=active]:bg-gray-700">
              Assignments
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-gray-700">
              Attendance
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-blue-600">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-blue-600 text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-gray-300 text-base">Overall Progress</h3>
                    <p className="text-xl font-bold">
                      {totalQuizzes > 0 ? `${highestPercentage}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-green-600">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">✍️</span>
                  </div>
                  <div>
                    <h3 className="text-gray-300 text-base">Pending Tasks</h3>
                    <p className="text-xl font-bold">0 (feature coming soon)</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-purple-600">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-purple-600 text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-gray-300 text-base">Attendance Rate</h3>
                    <p className="text-xl font-bold">100% (feature coming soon)</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-orange-600">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <span className="text-orange-600 text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-gray-300 text-base">Next Due</h3>
                    <p className="text-xl font-bold">1 days (feature coming soon)</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity Timeline */}
            <Card className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {quizResults.map((quiz, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                    <div>
                      <p className="text-gray-300">Completed Quiz: {quiz.quiz.name}</p>
                      <p className="text-sm text-gray-400">
                      <FormattedDateTime date={quiz.attemptedAt} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-blue-600">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-blue-600 text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-gray-300 text-base">Total Quizzes Taken</h3>
                    <p className="text-xl font-bold">{totalQuizzes}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-green-600">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-gray-300 text-base">Highest Score</h3>
                    <p className="text-xl font-bold">
                      {totalQuizzes > 0 ? `${highestPercentage}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-purple-600">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-purple-600 text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-gray-300 text-base">Average Performance</h3>
                    <p className="text-xl font-bold">
                      {totalQuizzes > 0 ? `${averagePercentage}%` : 'N/A'}
                      {accuracyTrend !== 'stable' && (
                        <span className={`text-sm ml-2 ${
                          accuracyTrend === 'improving' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({accuracyTrend} ↗)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-orange-600">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <span className="text-orange-600 text-xl">⏱</span>
                  </div>
                  <div>
                    <h3 className="text-gray-300 text-base">Recent Performance</h3>
                    <p className="text-xl font-bold">
                      {totalQuizzes > 0 ? `${recentPercentage}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <PerformanceChart chartData={chartData} />
            <QuizHistory results={quizResults} />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Pending Assignments</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Research Paper on React Hooks</h4>
                      <p className="text-sm text-gray-400">Due in 3 days</p>
                    </div>
                    <span className="px-3 py-1 text-sm bg-yellow-500 text-black rounded-full">
                      In Progress
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Monthly Attendance Overview</h3>
              <div className="grid grid-cols-7 gap-2">
                {Array(31).fill(0).map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                      Math.random() > 0.1 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}