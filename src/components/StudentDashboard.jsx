"use client"
import React, { useEffect, useState } from 'react';
import PerformanceChart from "@/components/PerformanceChart";
import QuizHistory from "@/components/QuizHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import { useSession } from 'next-auth/react';

import axios from 'axios';
import Link from 'next/link';
import QuizDashboard from './QuizesToPlay';
import { useTheme } from '@/components/ThemeContext';

import { useMediaQuery } from 'react-responsive';
import { BookOpen, List, Award, Home } from 'lucide-react';


export default function StudentDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [quizResultss, setQuizResultss] = useState([]);
  
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const quizResponse = await axios.get("/api/total-quizes");
        setQuizzes(quizResponse.data.quizes);
        
        const resultsResponse = await axios.get("/api/attempted-public");
        setQuizResultss(resultsResponse.data);
        
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

  // Update the useEffect for fetching mock attempts
useEffect(() => {
  const fetchAttempts = async () => {
    try {
      const [attemptsRes, resultsRes] = await Promise.all([
        axios.get('/api/mock-tests/dashboard/attempts'),
        axios.get('/api/mock-tests/dashboard/results')
      ]);
      
      // Combine data from both endpoints
      const enrichedAttempts = attemptsRes.data.map(attempt => {
        const result = resultsRes.data.find(r => r.attemptId.toString() === attempt._id.toString());
        return {
          ...attempt,
          ...result,
          percentage: result ? result.percentage : (attempt.score / attempt.totalQuestions * 100).toFixed(1),
          sectionScores: result ? result.sections : []
        };
      });
      
      setAttempts(enrichedAttempts);
      
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };
  
  if (session) fetchAttempts();
}, [session]);
console.log(attempts);
  useEffect(() => {
    const fetchQuizResults = async () => {
      const response = await axios.get("/api/attempted");
      setQuizResults(response.data);
    };
    fetchQuizResults();
  }, []);

  // Quiz statistics
  const totalQuizzes = quizResults.length;
  const percentages = quizResults.map(result => 
    Number(((result?.score / result?.totalQuestions) * 100).toFixed(1))
  );
  const averagePercentage = totalQuizzes > 0 ? 
    (percentages.reduce((a, b) => a + Number(b), 0) / totalQuizzes) : 0;
  const highestPercentage = totalQuizzes > 0 ? 
    Math.max(...percentages.map(p => Number(p))) : 0;
  const recentPercentage = totalQuizzes > 0 ? percentages[0] : 0;

  // Mock test statistics
  const totalMocks = attempts.length;
  const mockPercentages = attempts.map(attempt => 
    Number(((attempt.totalScore / attempt.totalQuestions) * 100).toFixed(1))
  );
  console.log(mockPercentages);
  //there is nan in the mockPercentages array
  //replace it with 0
  const filteredMockPercentages = mockPercentages.map(p => isNaN(p) ? 0 : p);
  const mockAveragePercentage = totalMocks > 0 ? 
    (filteredMockPercentages.reduce((a, b) => Number(a) + Number(b), 0) / totalMocks) : 0;
  
  const mockHighestPercentage = totalMocks > 0 ? 
    Math.max(...filteredMockPercentages.map(p => Number(p))) : 0;
  const mockRecentPercentage = totalMocks > 0 ? filteredMockPercentages[0] : 0;
  
  // Accuracy trends
  let accuracyTrend = 'stable';
  if (totalQuizzes >= 6) {
    const firstThree = percentages.slice(-3).reduce((a, b) => a + Number(b), 0) / 3;
    const lastThree = percentages.slice(0, 3).reduce((a, b) => a + Number(b), 0) / 3;
    accuracyTrend = lastThree > firstThree ? 'improving' : lastThree < firstThree ? 'declining' : 'stable';
  }

  let mockAccuracyTrend = 'stable';
  if (totalMocks >= 3) {
    const firstHalf = mockPercentages.slice(0, Math.floor(mockPercentages.length/2))
      .reduce((a, b) => Number(a) + Number(b), 0) / Math.floor(mockPercentages.length/2);
    const secondHalf = mockPercentages.slice(Math.floor(mockPercentages.length/2))
      .reduce((a, b) => Number(a) + Number(b), 0) / Math.ceil(mockPercentages.length/2);
    mockAccuracyTrend = secondHalf > firstHalf ? 'improving' : secondHalf < firstHalf ? 'declining' : 'stable';
  }

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

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const tableHeaderBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const tableRowHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          theme={theme} 
          icon="📚" 
          title="Overall Progress" 
          value={`${averagePercentage.toFixed(1)}%`} 
          color="blue" 
        />
        <StatCard theme={theme} icon="📚" title="Quizzes Attempted" value={totalQuizzes} color="blue" />
        <StatCard theme={theme} icon="📝" title="Mocks Attempted" value={totalMocks} color="blue" />
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
          title=" Recent Performance" 
          value={`${recentPercentage}%`} 
          color="orange" 
        />
        <StatCard 
          theme={theme} 
          icon="📈" 
          title="Average Performance" 
          value={`${averagePercentage.toFixed(1)}%`} 
          color="purple" 
          trend={accuracyTrend} 
        />
        <StatCard 
          theme={theme} 
          icon="📝" 
          title="Highest Mock Score"
          value={totalMocks > 0 ? `${mockHighestPercentage}%` : 'N/A'} 
          color="green" 
        />
        <StatCard 
          theme={theme} 
          icon="📊" 
          title="Avg Mock Score"
          value={totalMocks > 0 ? `${mockAveragePercentage.toFixed(1)}%` : 'N/A'} 
          color="purple" 
        />
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuizHistory results={quizResults} theme={theme} />
        <MockTestsOverview 
          attempts={attempts} 
          theme={theme} 
          cardBg={cardBg} 
          textColor={textColor} 
          secondaryText={secondaryText} 
        />
      </div>
      <PerformanceChart chartData={chartData} theme={theme} />
    </div>
  );

  const QuizzesTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
        <StatCard theme={theme} icon="📚" title="Quizzes Attempted" value={totalQuizzes} color="blue" />
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
          value={`${averagePercentage.toFixed(1)}%`} 
          color="purple" 
          trend={accuracyTrend} 
        />
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <QuizHistory results={quizResults} theme={theme} />
        
      </div>
    </>
  );

  const ResultsTab = ({ attempts, cardBg, borderColor, textColor, secondaryText, tableHeaderBg, tableRowHover }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            theme={theme} 
            icon="📝" 
            title="Total Mocks Taken" 
            value={totalMocks} 
            color="blue" 
          />
          <StatCard 
            theme={theme} 
            icon="🏆" 
            title="Highest Mock Score" 
            value={totalMocks > 0 ? `${mockHighestPercentage}%` : 'N/A'} 
            color="green" 
          />
          <StatCard 
            theme={theme} 
            icon="📊" 
            title="Average Mock Score" 
            value={totalMocks > 0 ? `${mockAveragePercentage.toFixed(1)}%` : 'N/A'} 
            color="purple" 
          />
          <StatCard 
            theme={theme} 
            icon="📈" 
            title="Recent Mock Score" 
            value={totalMocks > 0 ? `${mockRecentPercentage}%` : 'N/A'} 
            color="orange" 
            trend={mockAccuracyTrend}
          />
        </div>

        {attempts.length === 0 ? (
          <div className={`text-center py-12 ${textColor}`}>
            <p className={`mb-4 ${secondaryText}`}>You haven't taken any mock tests yet</p>
            <Link 
              href="/mock-tests" 
              className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              Browse Available Mocks
            </Link>
          </div>
        ) : (
        <MockTestsOverview 
          attempts={attempts} 
          theme={theme} 
          cardBg={cardBg} 
          textColor={textColor} 
          secondaryText={secondaryText} 
        />
      )}
    </div>
  );
};
  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-4 ${isMobile ? 'pb-24' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-base text-purple-500 font-bold flex items-center gap-1`}>
            
            <img 
              className="w-8  rounded-full mr-1"
            src={session?.user?.image || '/trackode.png'}
              alt="User Avatar">
              
            </img>
            Welcome
            <span className={`text-base  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {session?.user?.name || 'Student'}
            </span>

            
          </h1>
        </div>

        {!isMobile && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} p-1 rounded-lg`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quizzes">Quiz Histories</TabsTrigger>
              <TabsTrigger value="mocks">Mock Histories</TabsTrigger>
              <TabsTrigger value="available-quizzes">Available Quizzes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab />
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
            <TabsContent value="quizzes">
              <QuizzesTab />
            </TabsContent>

            <TabsContent value="available-quizzes">
              <QuizDashboard quizzes={quizzes} mockTests={mockTests} quizResults={quizResultss} />
            </TabsContent>

            
          </Tabs>
        )}

        {isMobile && (
          <div className="space-y-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'quizzes' && <QuizzesTab />}
            
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
            {activeTab === 'available-quizzes' && (
              <QuizDashboard quizzes={quizzes} mockTests={mockTests} quizResults={quizResultss} />
            )}
          </div>
        )}

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
              onClick={() => setActiveTab('mocks')}
              className={`flex flex-col items-center justify-center p-2 ${activeTab === 'mocks' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : secondaryText}`}
            >
              <Award className="w-5 h-5" />
              <span className="text-xs mt-1">Mocks</span>
            </button>
            <button 
              onClick={() => setActiveTab('available-quizzes')}
              className={`flex flex-col items-center justify-center p-2 ${activeTab === 'available-quizzes' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : secondaryText}`}
            >
              <List className="w-5 h-5" />
              <span className="text-xs mt-1">Available Quizzes</span>
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
}

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
                ({trend === 'improving' ? '↑' : '↓'})
              </span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};

const MockTestsOverview = ({ attempts, theme, cardBg, textColor, secondaryText }) => (
  <Card className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-5 rounded-lg`}>
    <h3 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      Recent Mock Attempts
    </h3>
    {attempts.length === 0 ? (
      <p className={`text-center py-4 ${secondaryText}`}>No mock tests taken yet</p>
    ) : (
      <div className="space-y-4">
        {attempts.map((attempt, index) => (
          <div key={index} className={`p-4 rounded-lg ${cardBg} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className='flex items-center gap-2'>
                   <p className={`text-sm ${textColor}`}>{attempt.quizTitle}</p>
                   {attempt.totalScore&&attempt.totalQuestions && (
                    <p className={`text-xs ${textColor}`}>
                      • Score: {attempt.totalScore}/{attempt.totalQuestions} ({attempt.percentage}%)
                    </p>
                    )}
                 
                  </div>
               
                <p className={`text-xs ${secondaryText}`}>
                 Attempted at: {new Date(attempt.completedAt).toLocaleDateString()}
                 
                </p>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {attempt.sections?.map((section, i) => (
                  <> 
                    {section.total> 0 && (
                      <span key={i} className={`text-xs px-2 py-1 rounded ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {section.sectionName}: {section.correct}/{section.total}
                      </span>
                    )
                    }
                    </> 
                  ))}
                </div>
              </div>
              <Link 
                href={`/mock-tests/${attempt.attemptId?attempt.attemptId:attempt._id}/user-results`}
                className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);
