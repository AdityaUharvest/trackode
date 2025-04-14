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
        <span className="w-2 h-2 animate-ping bg-green-500 rounded-full mr-1"></span>
        
      </span>
    ) : (
      <span className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
        <span className="w-2 h-2 bg-red-500 animate-ping rounded-full mr-1"></span>
        
      </span>
    );
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
    <div className={`min-h-screen ${containerStyles[theme]} transition-colors duration-300 `}>
  <div className="mx-auto ">
    {/* Quizzes Section - Compact Design */}
    <div className={`rounded-lg shadow-sm border overflow-hidden ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
      {/* Search Header */}
      <div className={`p-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <input
          type="text"
          placeholder="Search quizzes..."
          className={`w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${inputStyles[theme]}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Compact Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={tableStyles[theme].header}>
            <tr>
              <th className={`p-2 text-left text-xs font-medium uppercase ${textStyles[theme].secondary}`}>Quiz</th>
              <th className={`p-2 text-left text-xs font-medium uppercase ${textStyles[theme].secondary}`}>Play</th>
              <th className={`p-2 text-left text-xs font-medium uppercase ${textStyles[theme].secondary}`}>Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz._id} className={tableStyles[theme].row}>
                {/* Quiz Name and Description */}
                <td className="p-2">
                  <div className="flex items-center">
                    <span className="mr-1">{getStatusBadge(quiz.active)}</span>
                    <div>
                      <div className={`text-xs font-medium ${textStyles[theme].primary} truncate`} title={quiz.name}>
                        {quiz.name}
                      </div>
                      
                    </div>
                  </div>
                </td>
                
                {/* Combined Stats Cell */}
                <td className="p-2">
                  <div className={`text-xs ${textStyles[theme].secondary}`}>
                   
                    <div>📝 {quiz.totalRegistrations}</div>
                    
                  </div>
                </td>
                
                {/* Action Button */}
                <td className="p-2">
                  {quiz.active ? (
                    <Link href={`/quiz-play/${quiz?._id}`}>
                      <button className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${
                        quiz.userPlayed 
                          ? theme === 'dark' 
                            ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' 
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : theme === 'dark' 
                            ? 'bg-green-900 text-green-200 hover:bg-green-800' 
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}>
                        {quiz.userPlayed ? 'Results' : 'Start'}
                        {quiz.userPlayed && (
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          quiz.userScore && quiz.maxScore 
                            ? (quiz.userScore / quiz.maxScore) >= 0.7 
                              ? 'bg-green-500' 
                              : (quiz.userScore / quiz.maxScore) >= 0.4 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            : 'bg-gray-500'
                        }`}></div>
                        {quiz.userScore !== undefined && quiz.maxScore !== undefined 
                          ? `${Math.round((quiz.userScore / quiz.maxScore) * 100)}%`
                          : '✓'}
                      </div>
                    )}
                      </button>
                    </Link>
                  ) : (
                    <button 
                      className="px-2 py-1 text-xs rounded-md font-medium cursor-not-allowed bg-red-700 text-white"
                      disabled
                    >
                      {new Date(quiz.startDate) > new Date() ? 'Soon' : 'Closed'}
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