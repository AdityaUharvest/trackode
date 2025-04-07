"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from "axios";
import { useTheme } from './ThemeContext';
import { useSession } from 'next-auth/react';
import PerformanceChart from './PerformanceChart';

interface Quiz {
  _id: string;
  name: string;
  description: string;
  totalRegistrations: number;
  totalPlayed: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  userPlayed: boolean;
  userScore?: number;
  maxScore?: number;
}

interface UserStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  highestScore: number;
  recentScore: number;
  ranking: number;
  totalPlayers: number;
  accuracyTrend: string;
}

const QuizDashboard = () => {
  const { theme } = useTheme();
  const { data: session, status } = useSession();
  const [quizResults, setQuizResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
    recentScore: 0,
    ranking: 0,
    totalPlayers: 0,
    accuracyTrend: 'stable'
  });

  // Theme-based styles
  const containerStyles = {
    light: 'bg-gray-50 text-gray-800',
    dark: 'bg-gray-900 text-gray-100'
  };

  const cardStyles = {
    light: 'bg-white border-gray-200',
    dark: 'bg-gray-800 border-gray-700'
  };

  const textStyles = {
    light: {
      primary: 'text-gray-800',
      secondary: 'text-gray-600',
      muted: 'text-gray-400'
    },
    dark: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-500'
    }
  };

  const inputStyles = {
    light: 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    dark: 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400'
  };

  const tableStyles = {
    light: {
      header: 'bg-gray-50 text-gray-500',
      row: 'hover:bg-gray-50',
      cell: 'text-gray-500'
    },
    dark: {
      header: 'bg-gray-700 text-gray-300',
      row: 'hover:bg-gray-700',
      cell: 'text-gray-400'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/total-quizes");
      setQuizzes(response.data.quizes);
      setFilteredQuizzes(response.data.quizes);
      
      // Calculate stats
      const totalQuizzes = quizzes.length;
      const percentages = quizResults.map(
        (result: any) => Number(((result?.score / result?.totalQuestions) * 100).toFixed(1))
      );
      console.log(quizResults.filter((r: any) => r.attempted).length)
      let accuracyTrend = 'stable';
      if (totalQuizzes >= 3) {
        const firstHalf = percentages.slice(0, Math.floor(percentages.length/2));
        const secondHalf = percentages.slice(Math.floor(percentages.length/2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        accuracyTrend = secondAvg > firstAvg ? 'improving' : secondAvg < firstAvg ? 'declining' : 'stable';
      }
      
      setUserStats({
        totalQuizzes: totalQuizzes,
        completedQuizzes: quizResults.filter((r: any) => r.attempted !== false).length,
        averageScore: totalQuizzes > 0 ? 
          Number((percentages.reduce((a, b) => a + b, 0) / totalQuizzes).toFixed(1)) : 0,
        highestScore: totalQuizzes > 0 ? 
          Math.max(...percentages.map(p => Number(p))) : 0,
        recentScore: totalQuizzes > 0 ? percentages[0] : 0,
        ranking: 42, // Replace with actual ranking logic
        totalPlayers: 500, // Replace with actual total players
        accuracyTrend: accuracyTrend
      });
    };

    fetchData();
  }, [quizResults]);

  useEffect(() => {
    const filtered = quizzes.filter(quiz =>
      quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const chartData = quizResults.map((result: any) => ({
    date: new Date(result.attemptedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    percentage: Number(((result.score / result.totalQuestions) * 100).toFixed(1)),
    fullDate: new Date(result.attemptedAt).toLocaleDateString(),
    score: result.score,
    quiz: result.quiz?.name,
    total: result.totalQuestions
  })).reverse();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <span className={`${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
        Live
      </span>
    ) : (
      <span className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
        Ended
      </span>
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <span className="text-green-500">↑</span>;
      case 'declining':
        return <span className="text-red-500">↓</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const getAchievementLevel = () => {
    const completionRate = (userStats.completedQuizzes / userStats.totalQuizzes) * 100;
    const averageScore = userStats.averageScore;

    if (completionRate >= 80 && averageScore >= 85) return 'Quiz Master';
    if (completionRate >= 60 || averageScore >= 70) return 'Advanced';
    if (completionRate >= 40 || averageScore >= 50) return 'Intermediate';
    if (completionRate >= 20 || averageScore >= 30) return 'Beginner';
    return 'Newbie';
  };

  useEffect(() => {
    const fetchQuizResults = async () => {
      const response = await axios.get("/api/attempted-public");
      setQuizResults(response.data);
      console.log(response.data);
      setLoading(false);
    };
    fetchQuizResults();
  }, []);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${containerStyles[theme]} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
          {/* Completion Rate */}
          <div className={`p-4 grid grid-cols-1 rounded-xl shadow-sm border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
            <h3 className={`text-lg  text-center font-semibold mb-4 ${textStyles[theme].primary}`}>Completion</h3>
            {/* Circular Progress */}
            <div className="relative ">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className={theme === 'dark' ? 'text-gray-700' : 'text-gray-200'}
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                {/* Progress circle */}
                <circle
                  className="text-blue-500"
                  strokeWidth="8"
                  strokeDasharray={`${(userStats.completedQuizzes / userStats.totalQuizzes) * 251} 251`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              {/* Center text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className={`text-2xl font-bold block ${textStyles[theme].primary}`}>
                  {userStats.totalQuizzes>0?Math.round((userStats.completedQuizzes / userStats.totalQuizzes) * 100):0}%
                </span>
                <span className={`text-xs block ${textStyles[theme].muted}`}>
                  {userStats.completedQuizzes>0?userStats.completedQuizzes:0} / {userStats.totalQuizzes}
                </span>
              </div>
              
            </div>
          </div>

          {/* Average Score */}
          <div className={`p-6 rounded-xl shadow-sm border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${textStyles[theme].primary}`}>Average Score</h3>
            <div className="flex items-end">
              <p className={`text-3xl font-bold mr-2 ${textStyles[theme].primary}`}>
                {userStats.averageScore}
              </p>
              <span className={textStyles[theme].muted}>%</span>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm mr-2 ${textStyles[theme].muted}`}>Trend:</span>
              {getTrendIcon(userStats.accuracyTrend)}
              <span className={`text-sm ml-1 capitalize ${textStyles[theme].secondary}`}>{userStats.accuracyTrend}</span>
            </div>
          </div>
          <div className={`p-6 rounded-xl shadow-sm border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${textStyles[theme].primary}`}>Achievement✨</h3>
            <div className="flex items-end">
              <p className={`text-xl font-bold mr-2 ${textStyles[theme].primary}`}>
                {getAchievementLevel()} ✅
              </p>
             
            </div>
            
          </div>

          {/* Highest Score */}
          <div className={`p-6 rounded-xl shadow-sm border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${textStyles[theme].primary}`}>Highest Score</h3>
            <div className="flex items-end">
              <p className={`text-3xl font-bold mr-2 ${textStyles[theme].primary}`}>
                {userStats.highestScore}
              </p>
              <span className={textStyles[theme].muted}>%</span>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${textStyles[theme].muted}`}>Your personal best</span>
            </div>
          </div>

          {/* Recent Performance */}
          <div className={`p-6 rounded-xl shadow-sm border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${textStyles[theme].primary}`}>Recent Score</h3>
            <div className="flex items-end">
              <p className={`text-3xl font-bold mr-2 ${
                userStats.recentScore >= 80 ? 'text-green-500' :
                userStats.recentScore >= 50 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {userStats.recentScore}
              </p>
              <span className={textStyles[theme].muted}>%</span>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${textStyles[theme].muted}`}>Latest attempt</span>
            </div>
          </div>
        </div>

        {/* Performance Chart Section */}
        <div className={`p-6 rounded-xl shadow-sm border mb-10 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${textStyles[theme].primary}`}>Performance Trend</h2>
          <div className="h-80">
            <PerformanceChart chartData={chartData} theme={theme} />
          </div>
        </div>

        {/* Quizzes Section */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-semibold ${textStyles[theme].primary}`}>Available Quizzes</h2>
              <input
                type="text"
                placeholder="Search quizzes..."
                className={`w-64 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputStyles[theme]}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={tableStyles[theme].header}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textStyles[theme].secondary}`}>Quiz</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textStyles[theme].secondary}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textStyles[theme].secondary}`}>Participants</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textStyles[theme].secondary}`}>Your Score</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${textStyles[theme].secondary}`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz._id} className={tableStyles[theme].row}>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${textStyles[theme].primary}`}>{quiz.name}</div>
                      <div className={`text-sm ${textStyles[theme].secondary}`}>{quiz.description}</div>
                      <div className={`text-xs mt-1 ${textStyles[theme].muted}`}>
                      {formatDate(quiz.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(quiz.active)}
                    </td>
                    <td className={`px-6 py-4 text-sm ${textStyles[theme].secondary}`}>
                      <div>{quiz.totalPlayed}</div>
                      <div className={`text-xs ${textStyles[theme].muted}`}>{quiz.totalRegistrations} registered</div>
                    </td>
                    <td className="px-6 py-4">
                      {quiz.userPlayed ? (
                        <div className="flex items-center">
                          <div className={`w-3 h-3 text-sm rounded-full mr-2 ${
                            quiz.userScore && quiz.maxScore 
                              ? (quiz.userScore / quiz.maxScore) >= 0.7 
                                ? 'bg-green-500' 
                                : (quiz.userScore / quiz.maxScore) >= 0.4 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                              : 'bg-gray-500'
                          }`}></div>
                          <span className={textStyles[theme].secondary}>
                            {quiz.userScore !== undefined && quiz.maxScore !== undefined 
                              ? `${quiz.userScore}/${quiz.maxScore} (${Math.round(
                                  (quiz.userScore / quiz.maxScore) * 100
                                )}%)`
                              : 'Completed'}
                          </span>
                        </div>
                      ) : (
                        <span className={textStyles[theme].muted}>Not attempted</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {quiz.active && quiz.userPlayed ? (
                        <Link href={`/quiz-play/${quiz?._id}`}>
                          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            quiz.userPlayed 
                              ? theme === 'dark' 
                                ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' 
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : theme === 'dark' 
                                ? 'bg-green-900 text-green-200 hover:bg-green-800' 
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}>
                            {quiz.userPlayed ? 'LeaderBoard | My Result' : 'Start Quiz'}
                          </button>
                        </Link>
                      ) : (
                        <button 
                          className="px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed bg-red-700 text-white "
                          disabled
                        >
                          {new Date(quiz.startDate) > new Date() ? 'Coming Soon' : 'Not Live'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDashboard;