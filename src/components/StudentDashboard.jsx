"use client"
import React, { useEffect,useState } from 'react';
import PerformanceChart from "@/components/PerformanceChart";
import QuizHistory from "@/components/QuizHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import FormattedDateTime from '@/components/FormattedDateTime';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import QuizDashboard from './QuizesToPlay';
import { useTheme } from '@/components/ThemeContext';
import SkeletonLoader from '@/components/skeleton/student';
export default function StudentDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const [quizResults, setQuizResults] = React.useState([]);
  const [loading, setLoading]= React.useState(true);
    
  const [attempts, setAttempts] = useState([]);
    
    // Theme-based styles
    const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const tableHeaderBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
    const tableRowHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const attemptsRes = await axios.get('/api/mock-tests/dashboard/attempts');
         
          setAttempts(attemptsRes.data);
          console.log(attemptsRes.data)
          
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } 
      };
  
      if (session) {
        fetchData();
      }
    }, [session]);
  console.log(attempts)
  useEffect(() => {
    const fetchQuizResults = async () => {
      const response = await axios.get("/api/attempted");
      setQuizResults(response.data);
      setLoading(false);
    };
    fetchQuizResults();
  }, []);

  if (status === "loading" || loading) {
    return <SkeletonLoader theme={theme} />; // Display the skeleton while loading
  }

 

  // Calculate quiz statistics
  const totalQuizzes = quizResults.length;
  const percentages = quizResults.map(
    result => Number(((result?.score / result?.totalQuestions) * 100).toFixed(1))
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
    quiz: result.quiz?.name,
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
        <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} flex items-center gap-3`}>
            <span className={`${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} p-1 rounded-lg`}>
              📊
            </span>
            Student Dashboard
          </h1>
        </div>

        <Tabs defaultValue="quizzes" className="space-y-6">
          <TabsList className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} p-1 rounded-lg`}>
           <TabsTrigger value="quizzes" className={`data-[state=active]:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}>
              Quiz Histories
            </TabsTrigger>
            
            
            <TabsTrigger value="mocks" className={`data-[state=active]:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}>
              Mocks
            </TabsTrigger>
            <TabsTrigger value="available-quizzes" className={`data-[state=active]:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}>
            Free Available quizzes
            </TabsTrigger>
            <TabsTrigger value="overview" className={`data-[state=active]:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}>
              Overview
            </TabsTrigger>
            
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border-l-4 border-blue-600`}>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-blue-600 text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-base`}>Overall Progress</h3>
                    <p className="text-sm font-bold">
                      {totalQuizzes > 0 ? `${averagePercentage}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border-l-4 border-blue-600`}>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-base`}>Highest Score</h3>
                    <p className="text-sm font-bold">
                      {totalQuizzes > 0 ? `${highestPercentage}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border-l-4 border-blue-600`}>
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <span className="text-orange-600 text-xl">⏱</span>
                  </div>
                  <div>
                    <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-base`}>Recent Performance</h3>
                    <p className="text-sm font-bold">
                      {totalQuizzes > 0 ? `${recentPercentage}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border-l-4 border-blue-600`}>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-purple-600 text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-base`}>Average Performance</h3>
                    <p className="text-sm font-bold">
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

              {/* Repeat for other cards */}
            </div>

            {/* Recent Activity Timeline */}
            <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Recent Activity</h3>
              <div className="space-y-4">
                {quizResults.map((quiz, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                    <div>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Completed Quiz: {quiz.quiz?.name}</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
              <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border-l-4 border-blue-600`}>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-blue-600 text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-base`}>Total Quizzes Taken</h3>
                    <p className="text-xl font-bold">{totalQuizzes}</p>
                  </div>
                </div>
              </Card>

              {/* Repeat for other cards */}
            </div>

            <PerformanceChart chartData={chartData} theme={theme} />
            <QuizHistory results={quizResults} theme={theme} />
          </TabsContent>
          

          <TabsContent value="mocks" className="space-y-6">

           <ResultsTab 
              attempts={attempts} 
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              secondaryText={secondaryText}
              tableHeaderBg={tableHeaderBg}
              tableRowHover={tableRowHover}
            />
          </TabsContent>
          <TabsContent value="available-quizzes" className="space-y-2">

           <QuizDashboard/>
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  );
}
function ResultsTab({ attempts, cardBg, borderColor, textColor, secondaryText, tableHeaderBg, tableRowHover }) {
  
  return (
    <div>
      

      {attempts.length === 0 ? (
        <div className={`text-center py-12 ${textColor}`}>
          <p className={`mb-4 ${secondaryText}`}>You haven't taken any mock tests yet</p>
          {/* <Link
            href="/mock-tests"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Mock Tests
          </Link> */}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={tableHeaderBg}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                    Test
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                    Date
                  </th>
                  
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                    Details
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                    LeaderBoard
                  </th>
                </tr>
              </thead>
              <tbody className={`${cardBg} divide-y ${borderColor}`}>
                {attempts.map((attempt) => (
                  <tr key={attempt._id} className={tableRowHover}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${textColor}`}>{attempt.quizTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${secondaryText}`}>
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`mock-tests/${attempt._id}/user-results`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Detailed Result
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      Not Released Yet
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}