"use client"
import React, { useEffect, useState } from 'react';
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
import { useMediaQuery } from 'react-responsive';
import { BookOpen, List, Award, Home } from 'lucide-react'; // Import icons

export default function StudentDashboard() {
  // Theme and session management
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  
  // State for loading and data
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [quizResultss, setQuizResultss] = useState([]);
  
  // Responsive design check
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch quiz data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch quizzes
        const quizResponse = await axios.get("/api/total-quizes");
        setQuizzes(quizResponse.data.quizes);
        
        // Fetch quiz results
        const resultsResponse = await axios.get("/api/attempted-public");
        setQuizResultss(resultsResponse.data);
        
        // Fetch mock tests
        const mockResponse = await axios.get("/api/mock-tests/getAll");
        if (mockResponse.data) {
          const testsWithPlayers = mockResponse.data.mocks.map((mock) => ({
            ...mock,
            userPlayed: mock.userPlayed || Math.floor(Math.random() * 500) + 50,
            category: mock.category || "TCS",
            difficulty: mock.difficulty || ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
          }));
          setMockTests(testsWithPlayers);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch attempts data
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const attemptsRes = await axios.get('/api/mock-tests/dashboard/attempts');
        setAttempts(attemptsRes.data);
      } catch (error) {
        console.error('Error fetching attempts:', error);
      }
    };
    if (session) fetchAttempts();
  }, [session]);

  // Fetch quiz results
  useEffect(() => {
    const fetchQuizResults = async () => {
      const response = await axios.get("/api/attempted");
      setQuizResults(response.data);
    };
    fetchQuizResults();
  }, []);

  // Calculate statistics
  const totalQuizzes = quizResults.length;
  const percentages = quizResults.map(result => 
    Number(((result?.score / result?.totalQuestions) * 100).toFixed(1))
  );
  const averagePercentage = totalQuizzes > 0 ? 
    (percentages.reduce((a, b) => a + Number(b), 0) / totalQuizzes).toFixed(1) : 0;
  const highestPercentage = totalQuizzes > 0 ? 
    Math.max(...percentages.map(p => Number(p))).toFixed(1) : 0;
  const recentPercentage = totalQuizzes > 0 ? percentages[0] : 0;

  // Prepare chart data
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

  // Calculate accuracy trend
  let accuracyTrend = 'stable';
  if (totalQuizzes >= 6) {
    const firstThree = percentages.slice(-3).reduce((a, b) => a + Number(b), 0) / 3;
    const lastThree = percentages.slice(0, 3).reduce((a, b) => a + Number(b), 0) / 3;
    accuracyTrend = lastThree > firstThree ? 'improving' : lastThree < firstThree ? 'declining' : 'stable';
  }

  // Theme styles
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const tableHeaderBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const tableRowHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  if (status === "loading" || loading) {
    return <SkeletonLoader theme={theme} />;
  }

  // Tab content components
  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <StatCard 
          theme={theme} 
          icon="📚" 
          title="Overall Progress" 
          value={`${averagePercentage}%`} 
          color="blue" 
        />
        <StatCard 
          theme={theme} 
          icon="🏆" 
          title="Highest Score" 
          value={`${highestPercentage}%`} 
          color="green" 
        />
        <StatCard 
          theme={theme} 
          icon="⏱" 
          title="Recent Performance" 
          value={`${recentPercentage}%`} 
          color="orange" 
        />
        <StatCard 
          theme={theme} 
          icon="📈" 
          title="Average Performance" 
          value={`${averagePercentage}%`} 
          color="purple" 
          trend={accuracyTrend} 
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity 
        theme={theme} 
        quizResults={quizResults} 
        textColor={textColor} 
        secondaryText={secondaryText} 
      />

      {/* Mock Tests Section */}
      <MockTestsOverview 
        attempts={attempts} 
        theme={theme} 
        cardBg={cardBg} 
        textColor={textColor} 
        secondaryText={secondaryText} 
      />
    </div>
  );

  const QuizzesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard theme={theme} icon="📚" title="Overall Progress" value={`${averagePercentage}%`} color="blue" />
        <StatCard theme={theme} icon="🏆" title="Highest Score" value={`${highestPercentage}%`} color="green" />
        <StatCard theme={theme} icon="⏱" title="Recent Performance" value={`${recentPercentage}%`} color="orange" />
        <StatCard theme={theme} icon="📈" title="Average Performance" value={`${averagePercentage}%`} color="purple" trend={accuracyTrend} />
        <StatCard theme={theme} icon="📚" title="Total Quizzes" value={totalQuizzes} color="blue" />
      </div>

      <RecentActivity 
        theme={theme} 
        quizResults={quizResults} 
        textColor={textColor} 
        secondaryText={secondaryText} 
      />

      <PerformanceChart chartData={chartData} theme={theme} />
      <QuizHistory results={quizResults} theme={theme} />
    </div>
  );

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-4 ${isMobile ? 'pb-24' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-xl font-bold flex items-center gap-3`}>
            <span className={`${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} p-1 rounded-lg`}>
              📊
            </span>
            Student Dashboard
          </h1>
        </div>

        {/* Desktop Tabs */}
        {!isMobile && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} p-1 rounded-lg`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quizzes">Quiz Histories</TabsTrigger>
              <TabsTrigger value="available-quizzes">Available Quizzes</TabsTrigger>
              <TabsTrigger value="mocks">Mocks</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="quizzes">
              <QuizzesTab />
            </TabsContent>

            <TabsContent value="available-quizzes">
              <QuizDashboard quizzes={quizzes} mockTests={mockTests} quizResults={quizResultss} />
            </TabsContent>

            <TabsContent value="mocks">
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
          </Tabs>
        )}

        {/* Mobile Content */}
        {isMobile && (
          <div className="space-y-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'quizzes' && <QuizzesTab />}
            {activeTab === 'available-quizzes' && (
              <QuizDashboard quizzes={quizzes} mockTests={mockTests} quizResults={quizResultss} />
            )}
            {activeTab === 'mocks' && (
              <ResultsTab 
                attempts={attempts} 
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
                secondaryText={secondaryText}
                tableHeaderBg={tableHeaderBg}
                tableRowHover={tableRowHover}
              />
            )}
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} border-t ${borderColor} flex justify-around items-center h-16`}>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex flex-col items-center justify-center p-2 ${activeTab === 'overview' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : secondaryText}`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('quizzes')}
              className={`flex flex-col items-center justify-center p-2 ${activeTab === 'quizzes' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : secondaryText}`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs mt-1">Quizzes</span>
            </button>
            <button 
              onClick={() => setActiveTab('available-quizzes')}
              className={`flex flex-col items-center justify-center p-2 ${activeTab === 'available-quizzes' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : secondaryText}`}
            >
              <List className="w-5 h-5" />
              <span className="text-xs mt-1">Available</span>
            </button>
            <button 
              onClick={() => setActiveTab('mocks')}
              className={`flex flex-col items-center justify-center p-2 ${activeTab === 'mocks' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : secondaryText}`}
            >
              <Award className="w-5 h-5" />
              <span className="text-xs mt-1">Mocks</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Stat Card Component
const StatCard = ({ theme, icon, title, value, color, trend }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' }
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm border-l-4 border-blue-600`}>
      <div className="flex items-center gap-4">
        <div className={`${colorClasses[color].bg} p-3 rounded-full`}>
          <span className={`${colorClasses[color].text} text-lg`}>{icon}</span>
        </div>
        <div>
          <h3 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-base`}>{title}</h3>
          <p className="text-sm font-bold">
            {value}
            {trend && trend !== 'stable' && (
              <span className={`text-sm ml-2 ${
                trend === 'improving' ? 'text-green-600' : 'text-red-600'
              }`}>
                ({trend} ↗)
              </span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Recent Activity Component
const RecentActivity = ({ theme, quizResults, textColor, secondaryText }) => (
  <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
    <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      Recent Activity
    </h3>
    <div className="space-y-4">
      {quizResults.map((quiz, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
          <div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {quiz.quiz?.name}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <FormattedDateTime date={quiz.attemptedAt} />
            </p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Mock Tests Overview Component
const MockTestsOverview = ({ attempts, theme, cardBg, textColor, secondaryText }) => (
  <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
    <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      Recent Mock Tests
    </h3>
    {attempts.length === 0 ? (
      <p className={`text-center py-4 ${secondaryText}`}>No mock tests taken yet</p>
    ) : (
      <div className="space-y-4">
        {attempts.slice(0, 3).map((attempt, index) => (
          <div key={index} className={`p-4 rounded-lg ${cardBg} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-medium ${textColor}`}>{attempt.quizTitle}</p>
                <p className={`text-sm ${secondaryText}`}>
                  {new Date(attempt.completedAt).toLocaleDateString()}
                </p>
              </div>
              <Link 
                href={`/mock-tests/${attempt._id}/user-results`}
                className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
              >
                View
              </Link>
            </div>
          </div>
        ))}
        {attempts.length > 3 && (
          <div className="text-center">
            <Link 
              href="#" 
              onClick={() => setActiveTab('mocks')}
              className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
            >
              View all {attempts.length} mock tests
            </Link>
          </div>
        )}
      </div>
    )}
  </Card>
);

// ResultsTab component remains the same as in your original code
const ResultsTab = ({ attempts, cardBg, borderColor, textColor, secondaryText, tableHeaderBg, tableRowHover }) => {
  return (
    <div>
      {attempts.length === 0 ? (
        <div className={`text-center py-12 ${textColor}`}>
          <p className={`mb-4 ${secondaryText}`}>You haven't taken any mock tests yet</p>
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
};