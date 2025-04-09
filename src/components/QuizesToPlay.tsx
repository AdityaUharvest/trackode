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
  section?: string;
  level?: string;
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

interface SectionLevels {
  [section: string]: {
    Easy: Quiz[];
    Medium: Quiz[];
    Hard: Quiz[];
    Other: Quiz[];
  }
}

type QuizFilter = 'all' | 'active' | 'completed' | 'ended';

const QuizDashboard = () => {
  const { theme } = useTheme();
  const { data: session, status } = useSession();
  const [quizResults, setQuizResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [organizedQuizzes, setOrganizedQuizzes] = useState<SectionLevels>({});
  const [difficultyFilter, setDifficultyFilter] = useState('all');
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
  const [activeFilter, setActiveFilter] = useState<QuizFilter>('all');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [showStats, setShowStats] = useState(false);
  const [showPerformanceChart, setShowPerformanceChart] = useState(false);

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

  // Function to organize quizzes by section and level
  const organizeQuizzesBySectionAndLevel = (quizList: Quiz[]) => {
    const organized: SectionLevels = {};
    
    quizList.forEach(quiz => {
      const match = quiz.name.match(/\(([^)]+)\)\s*-\s*(\w+)/);
      
      if (match) {
        const section = match[1].trim();
        const level = match[2].trim();
        
        if (!organized[section]) {
          organized[section] = {
            Easy: [],
            Medium: [],
            Hard: [],
            Other: []
          };
        }
        
        if (['Easy', 'Medium', 'Hard'].includes(level)) {
          organized[section][level as 'Easy' | 'Medium' | 'Hard'].push({
            ...quiz,
            section,
            level
          });
        } else {
          organized[section].Other.push({
            ...quiz,
            section,
            level: 'Other'
          });
        }
      } else {
        const section = "Uncategorized";
        if (!organized[section]) {
          organized[section] = {
            Easy: [],
            Medium: [],
            Hard: [],
            Other: []
          };
        }
        organized[section].Other.push({
          ...quiz,
          section,
          level: 'Other'
        });
      }
    });
    
    return organized;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/total-quizes");
      const quizData = response.data.quizes;
      setQuizzes(quizData);
      setFilteredQuizzes(quizData);
      
      const organized = organizeQuizzesBySectionAndLevel(quizData);
      setOrganizedQuizzes(organized);
      
      // Initialize expanded sections
      const expanded: {[key: string]: boolean} = {};
      Object.keys(organized).forEach(section => {
        expanded[section] = false;
      });
      setExpandedSections(expanded);
      
      // Calculate stats
      const totalQuizzes = quizData.length;
      const percentages = quizResults.map(
        (result: any) => Number(((result?.score / result?.totalQuestions) * 100).toFixed(1))
      
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
        ranking: 42,
        totalPlayers: 500,
        accuracyTrend: accuracyTrend
      });
    };

    fetchData();
  }, [quizResults]);

  useEffect(() => {
    let filtered = quizzes;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    switch (activeFilter) {
      case 'active':
        filtered = filtered.filter(quiz => quiz.active);
        break;
      case 'completed':
        filtered = filtered.filter(quiz => quiz.userPlayed);
        break;
      case 'ended':
        filtered = filtered.filter(quiz => !quiz.active && new Date(quiz.endDate) < new Date());
        break;
    }
    
    setFilteredQuizzes(filtered);
    const organized = organizeQuizzesBySectionAndLevel(filtered);
    setOrganizedQuizzes(organized);
  }, [searchTerm, quizzes, activeFilter]);

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

  const getStatusBadge = (active: boolean, endDate: Date) => {
    if (active) {
      return (
        <span className={`${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Live
        </span>
      );
    } else if (new Date(endDate) > new Date()) {
      return (
        <span className={`${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
          Coming Soon
        </span>
      );
    } else {
      return (
        <span className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
          <span className="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
          Ended
        </span>
      );
    }
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

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Easy':
        return theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'Medium':
        return theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default:
        return theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchQuizResults = async () => {
      const response = await axios.get("/api/attempted-public");
      setQuizResults(response.data);
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
        {/* Stats Section - Only show if completed quizzes > 0 */}
        {userStats.completedQuizzes > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
            >
              <span className="font-medium">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showStats ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {/* Completion Rate */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  <h3 className={`text-lg text-center font-semibold mb-4 ${textStyles[theme].primary}`}>
                    Completion
                  </h3>
                  <div className="relative h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className={theme === 'dark' ? 'text-gray-700' : 'text-gray-200'}
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="8"
                        strokeDasharray={`${
                          (userStats.completedQuizzes / userStats.totalQuizzes) * 251
                        } 251`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className={`text-2xl font-bold block ${textStyles[theme].primary}`}>
                        {userStats.totalQuizzes > 0
                          ? Math.round((userStats.completedQuizzes / userStats.totalQuizzes) * 100)
                          : 0}
                        %
                      </span>
                      <span className={`text-xs block ${textStyles[theme].muted}`}>
                        {userStats.completedQuizzes > 0 ? userStats.completedQuizzes : 0} /{' '}
                        {userStats.totalQuizzes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Average Score */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                    Average Score
                  </h3>
                  <div className="flex items-end mb-2">
                    <p className={`text-3xl font-bold mr-2 ${textStyles[theme].primary}`}>
                      {userStats.averageScore}
                    </p>
                    <span className={textStyles[theme].muted}>%</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm mr-2 ${textStyles[theme].muted}`}>Trend:</span>
                    {getTrendIcon(userStats.accuracyTrend)}
                    <span
                      className={`text-sm ml-1 capitalize ${
                        userStats.accuracyTrend === 'up'
                          ? 'text-green-500'
                          : userStats.accuracyTrend === 'down'
                          ? 'text-red-500'
                          : textStyles[theme].secondary
                      }`}
                    >
                      {userStats.accuracyTrend}
                    </span>
                  </div>
                </div>

                {/* Achievement */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                    Achievement
                  </h3>
                  <div className="flex items-center">
                    <p className={`text-xl font-bold mr-2 ${textStyles[theme].primary}`}>
                      {getAchievementLevel()}
                    </p>
                    <span className="text-xl">✨</span>
                  </div>
                </div>

                {/* Highest Score */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                    Highest Score
                  </h3>
                  <div className="flex items-end mb-2">
                    <p className={`text-3xl font-bold mr-2 ${textStyles[theme].primary}`}>
                      {userStats.highestScore}
                    </p>
                    <span className={textStyles[theme].muted}>%</span>
                  </div>
                  <div>
                    <span className={`text-sm ${textStyles[theme].muted}`}>Your personal best</span>
                  </div>
                </div>

                {/* Recent Performance */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                    Recent Score
                  </h3>
                  <div className="flex items-end mb-2">
                    <p
                      className={`text-3xl font-bold mr-2 ${
                        userStats.recentScore >= 80
                          ? 'text-green-500'
                          : userStats.recentScore >= 50
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {userStats.recentScore}
                    </p>
                    <span className={textStyles[theme].muted}>%</span>
                  </div>
                  <div>
                    <span className={`text-sm ${textStyles[theme].muted}`}>Latest attempt</span>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Chart Section */}
            <div className="mb-8">
              <button
                onClick={() => setShowPerformanceChart(!showPerformanceChart)}
                className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                <span className="font-medium">
                  {showPerformanceChart ? 'Hide Performance Chart' : 'Show Performance Chart'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${showPerformanceChart ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPerformanceChart && (
                <div className={`p-6 rounded-xl shadow-sm border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'
                }`}>
                  <h2 className={`text-xl font-semibold mb-4 ${textStyles[theme].primary}`}>Performance Trend</h2>
                  <div className="h-80">
                    <PerformanceChart chartData={chartData} theme={theme} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quizzes Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Visible on large screens */}
          <div className="lg:w-64 flex-shrink-0">
            <div className={`sticky top-4 p-4 rounded-xl border ${
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <h3 className={`font-semibold mb-4 ${textStyles[theme].primary}`}>Filters</h3>
              
              {/* Search Input */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${textStyles[theme].secondary}`}>
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white' 
                      : 'bg-white border-gray-300 focus:ring-blue-400 text-gray-800'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${textStyles[theme].secondary}`}>
                  Status
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Quizzes' },
                    { value: 'active', label: 'Active' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'ended', label: 'Ended' }
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setActiveFilter(filter.value as QuizFilter)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeFilter === filter.value
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-blue-100 text-blue-800 shadow-md'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${textStyles[theme].secondary}`}>
                  Difficulty
                </label>
                <div className="space-y-2">
                  {['All', 'Easy', 'Medium', 'Hard', 'Other'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficultyFilter(level.toLowerCase())}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        difficultyFilter === level.toLowerCase()
                          ? theme === 'dark'
                            ? `${
                                level === 'Easy' ? 'bg-green-700 text-white' :
                                level === 'Medium' ? 'bg-yellow-600 text-white' :
                                level === 'Hard' ? 'bg-red-600 text-white' :
                                level === 'Other' ? 'bg-purple-600 text-white' :
                                'bg-blue-600 text-white'
                              } shadow-md`
                            : `${
                                level === 'Easy' ? 'bg-green-100 text-green-800' :
                                level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                level === 'Hard' ? 'bg-red-100 text-red-800' :
                                level === 'Other' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'
                              } shadow-sm`
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quizzes Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className='flex gap-2 items-center'>
                <span>
                  <svg className={`w-7 h-7 ${
                      theme === "dark" ? "text-white" : "text-blue-600"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                <h2 className={`text-xl font-bold text-blue-500`}>Available Quizzes</h2>
              </div>
            </div>

            {/* Organized Quizzes */}
            <div className="space-y-4">
              {Object.keys(organizedQuizzes).map((section) => (
                <div
                  key={section}
                  className={`rounded-xl shadow-sm border overflow-hidden transition-all duration-200 ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Section Header */}
                  <div
                    className={`p-4 flex justify-between items-center cursor-pointer transition-all duration-200 ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleSection(section)}
                  >
                    <div className="flex items-center">
                      <h3 className={`text-base text-green-600 font-semibold `}>
                        {section}
                      </h3>
                      <span
                        className={`ml-2 text-xs px-2 py-1 rounded-full transition-all ${
                          theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {Object.values(organizedQuizzes[section]).reduce(
                          (acc, levelQuizzes) => acc + levelQuizzes.length,
                          0
                        )}{' '}
                        quizzes
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedSections[section] ? 'rotate-180' : ''
                        } ${textStyles[theme].secondary}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Section Content - Initially Collapsed */}
                  {expandedSections[section] && (
                    <div className="divide-y divide-gray-200 animate-fadeIn">
                      {(['Easy', 'Medium', 'Hard', 'Other'] as const).map((level) => {
                        if (
                          organizedQuizzes[section][level].length === 0 ||
                          (difficultyFilter !== 'all' && difficultyFilter !== level.toLowerCase())
                        )
                          return null;

                        return (
                          <div key={`${section}-${level}`} className="p-4">
                            <div className="flex items-center mb-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium mr-2 ${getLevelColor(
                                  level
                                )}`}
                              >
                                {level}
                              </span>
                              <span className={`text-sm ${textStyles[theme].muted}`}>
                                {organizedQuizzes[section][level].length} quizzes
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {organizedQuizzes[section][level].map((quiz) => (
                                <div
                                  key={quiz._id}
                                  className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                                    theme === 'dark'
                                      ? 'border-gray-700 hover:bg-gray-700 hover:shadow-lg'
                                      : 'border-gray-200 hover:bg-gray-50 hover:shadow-md'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-medium ${textStyles[theme].primary}`}>
                                      {quiz.name}
                                    </h4>
                                    {getStatusBadge(quiz.active, quiz.endDate)}
                                  </div>
                                  <p className={`text-sm mb-3 ${textStyles[theme].secondary}`}>
                                    {quiz.description}
                                  </p>

                                  <div className="flex justify-between items-center mb-3">
                                    <div>
                                      <span className={`text-xs ${textStyles[theme].muted}`}>
                                        Participants:{' '}
                                      </span>
                                      
                                      <span className={`text-xs ${textStyles[theme].muted}`}>
                                        {quiz.totalRegistrations}
                                      </span>
                                    </div>
                                    {quiz.userPlayed && (
                                      <div className="flex items-center">
                                        <div
                                          className={`w-2 h-2 rounded-full mr-1 ${
                                            quiz.userScore && quiz.maxScore
                                              ? quiz.userScore / quiz.maxScore >= 0.7
                                                ? 'bg-green-500'
                                                : quiz.userScore / quiz.maxScore >= 0.4
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                              : 'bg-gray-500'
                                          }`}
                                        ></div>
                                        <span className={`text-xs ${textStyles[theme].secondary}`}>
                                          {quiz.userScore !== undefined && quiz.maxScore !== undefined
                                            ? `${Math.round((quiz.userScore / quiz.maxScore) * 100)}%`
                                            : 'Played'}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex justify-end">
                                    {quiz.active ? (
                                      <Link href={`/quiz-play/${quiz._id}`}>
                                        <button
                                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all hover:shadow-md ${
                                            quiz.userPlayed
                                              ? theme === 'dark'
                                                ? 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                              : theme === 'dark'
                                              ? 'bg-green-800 text-green-200 hover:bg-green-700'
                                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                                          }`}
                                        >
                                          {quiz.userPlayed ? 'View Results' : 'Start Quiz'}
                                        </button>
                                      </Link>
                                    ) : (
                                      <button
                                        className="px-3 py-1 rounded-lg text-sm font-medium cursor-not-allowed bg-gray-200 text-gray-500"
                                        disabled
                                      >
                                        {new Date(quiz.startDate) > new Date()
                                          ? 'Coming Soon'
                                          : 'Quiz Ended'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDashboard;



  