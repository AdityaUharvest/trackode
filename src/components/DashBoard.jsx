'use client';
import { useTheme } from '@/components/ThemeContext';
import axios from 'axios';
import { useEffect, useState,useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import MockDashboard from './Mock';
import { Loader2 } from 'lucide-react';
import Quizes from './Quizes';

// Key for localStorage
const DASHBOARD_TAB_KEY = 'dashboard-active-tab';

export default function DashBoard() {
  const [quizzes, setQuizzes] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mockTests, setMockTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem(DASHBOARD_TAB_KEY) || 'dashboard';
    }
    return 'dashboard';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Calculate stats
  const activeQuizes = quizzes.filter(quiz => quiz.active).length;
  const totalmarks = participants.reduce((sum, participant) => sum + (participant.correctAnswers / participant.totalQuestions * 100), 0);
  
  const participationData = quizzes.map(quiz => ({
    name: quiz.name,
    participants: participants.filter(p => p.quiz._id === quiz._id).length
  }));

  const recentData = participants.slice(0, 5).map(participant => ({
    name: participant.quiz.name,
    score: participant.correctAnswers / participant.totalQuestions * 100,
    studentName: participant.student.name,
    time: new Date(participant.attemptedAt).toLocaleString()
  }));

  const quizStats = {
    totalQuizzes: quizzes.length,
    activeQuizzes: activeQuizes,
    totalParticipants: participants.length,
    totalParticipantsInRecentQuizzes: recent.length,
    avgScore: participants.length ? Math.round(totalmarks / participants.length) : 0,
    performanceData: participationData,
  };

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/quiz-get');
      setQuizzes(response.data.quizzes);
      setParticipants(response.data.participants);
      setRecent(response.data.recentParticipants);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }
  //for mocks
  useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [mocksRes, attemptsRes, statsRes] = await Promise.all([
            fetch('/api/mock-tests/dashboard?creator=true'),
            fetch('/api/mock-tests/dashboard/attempts'),
            fetch('/api/mock-tests/dashboard/stats')
          ]);
          
          const [mocksData, attemptsData, statsData] = await Promise.all([
            mocksRes.json(),
            attemptsRes.json(),
            statsRes.json()
          ]);
          
          setMockTests(mocksData);
          setAttempts(attemptsData);
          setStats(statsData);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          toast.error('Failed to load dashboard data');
        } finally {
          setIsLoading(false);
        }
      };
  
     
        fetchData();
      
    }, []);
  
  // Memoize the fetchQuiz function to prevent unnecessary recreations
  useEffect(() => {
    fetchQuiz();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DASHBOARD_TAB_KEY, activeTab);
    }
  }, [activeTab]);



  const [quizes, setQuizes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_BASE_URL = "/api"; // Adjust the base URL as needed
    const getQuizes = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/quiz-get`);
        if (response.data.success) {
          const quizesWithQuestions = response.data.quizzes.map((quiz) => ({
            ...quiz,
            questions: quiz.questions || [],
          }));
          setQuizes(quizesWithQuestions);
        } else {
          toast.success("You can start by creating a new quiz");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, []);
    useEffect(() => {
      getQuizes();
    }, [getQuizes]);
    console.log(quizes);
  const StatCard = ({ title, value, trend, theme }) => (
    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h3 className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
      <div className="flex items-baseline mt-1">
        <span className={`text-md font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</span>
        {trend && <span className="ml-1 text-xs text-green-500">{trend}</span>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-900'}`}>
      {/* Collapsible Side Navigation */}
      <div 
        className={`${sidebarCollapsed ? 'w-16' : 'w-48'} p-2 hidden md:block ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow transition-all duration-200`}
      >
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`p-2 text-xm mb-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} w-full text-left`}
        >
          {sidebarCollapsed ? '☰' : '◄ Collapse'}
        </button>
        
        <nav>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left p-2 rounded-md text-sm flex items-center ${activeTab === 'dashboard' 
                  ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                {sidebarCollapsed ? (
                  <span>📊</span>
                ) : (
                  <>
                    <span className="mr-2">📊</span>
                    <span className='text-sm'>Overview</span>
                  </>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('contests')}
                className={`w-full text-left p-2 rounded-md text-sm flex items-center ${activeTab === 'contests' 
                  ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                {sidebarCollapsed ? (
                  <span>🏆</span>
                ) : (
                  <>
                    <span className="mr-2">🏆</span>
                    <span>Mocks</span>
                  </>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('quizzes')}
                className={`w-full text-left p-2 rounded-md text-sm flex items-center ${activeTab === 'quizzes' 
                  ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                {sidebarCollapsed ? (
                  <span>📝</span>
                ) : (
                  <>
                    <span className="mr-2">📝</span>
                    <span>Quizzes</span>
                  </>
                )}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`w-full text-left p-2 rounded-md text-sm flex items-center ${activeTab === 'analytics' 
                  ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
              >
                {sidebarCollapsed ? (
                  <span>📈</span>
                ) : (
                  <>
                    <span className="mr-2">📈</span>
                    <span>Analytics</span>
                  </>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10">
        <div className={`flex justify-around ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-1 shadow`}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`p-2 text-xs ${activeTab === 'dashboard' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : ''}`}
          >
            <div className="flex flex-col items-center">
              <span>📊</span>
              <span>Home</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('quizzes')}
            className={`p-2 text-xs ${activeTab === 'quizzes' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : ''}`}
          >
            <div className="flex flex-col items-center">
              <span>📝</span>
              <span>Quizzes</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('contests')}
            className={`p-2 text-xs ${activeTab === 'contests' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : ''}`}
          >
            <div className="flex flex-col items-center">
              <span>🏆</span>
              <span>Mock</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`p-2 text-xs ${activeTab === 'analytics' ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : ''}`}
          >
            <div className="flex flex-col items-center">
              <span>📈</span>
              <span>Analytics</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-3 ${sidebarCollapsed ? 'md:ml-2' : 'md:ml-2'} transition-all duration-200`}>
        {/* Profile Card at top for mobile */}
        
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <h1 className="text-lg font-medium">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <StatCard theme={theme} title="Quizzes" value={quizStats.totalQuizzes} />
              <StatCard theme={theme} title="Active" value={quizStats.activeQuizzes} />
              <StatCard theme={theme} title="Participants" value={quizStats.totalParticipants} />
              <StatCard theme={theme} title="Avg Score" value={`${quizStats.avgScore}%`} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-3 mt-3">
              <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <h3 className="mb-2 text-sm font-medium">Quiz Participation</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={participationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#64748b' : '#cbd5e1'} />
                      <XAxis dataKey="name" stroke={theme === 'dark' ? '#fff' : '#000'} fontSize={10} />
                      <YAxis stroke={theme === 'dark' ? '#fff' : '#000'} fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                          borderColor: theme === 'dark' ? '#334155' : '#cbd5e1',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="participants" fill={theme === 'dark' ? '#3b82f6' : '#2563eb'} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <h3 className="mb-2 text-sm font-medium">Recent Attempts</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className={`text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <th className="pb-1">User</th>
                        <th className="pb-1">Quiz</th>
                        <th className="pb-1">Score</th>
                        <th className="pb-1">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentData.map((item, index) => (
                        <tr key={index} className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                          <td className="py-2 truncate max-w-[80px]">{item.studentName}</td>
                          <td className="py-2 truncate max-w-[80px]">{item.name}</td>
                          <td className={`py-2 font-medium ${item.score >= 70 ? 'text-green-500' : item.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {Math.round(item.score)}%
                          </td>
                          <td className="py-2 text-xs">{item.time.split(',')[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div>
            <Quizes quizes={quizes} setQuizes={setQuizes} getQuizes={getQuizes} />
          </div>
        )}

        {activeTab === 'contests' && (
          <div className="overflow-auto w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
              </div>
            ) : (
              <MockDashboard mockTests={mockTests} stats={stats} attempts={attempts} setAttempts={setAttempts} setMockTests={mockTests} setStats={setStats} />
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-lg font-medium mb-3">Analytics</h1>
            <div className="grid grid-cols-1 gap-3">
              <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <h3 className="mb-2 text-sm font-medium">Performance Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={quizStats.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#64748b' : '#cbd5e1'} />
                      <XAxis dataKey="name" stroke={theme === 'dark' ? '#fff' : '#000'} fontSize={10} />
                      <YAxis stroke={theme === 'dark' ? '#fff' : '#000'} fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                          borderColor: theme === 'dark' ? '#334155' : '#cbd5e1',
                          fontSize: '12px'
                        }}
                      />
                      <Line type="monotone" dataKey="participants" stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'} strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <h3 className="mb-2 text-sm font-medium">Score Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '70-100%', value: participants.filter(p => (p.correctAnswers / p.totalQuestions * 100) >= 70).length },
                          { name: '50-69%', value: participants.filter(p => (p.correctAnswers / p.totalQuestions * 100) >= 50 && (p.correctAnswers / p.totalQuestions * 100) < 70).length },
                          { name: '0-49%', value: participants.filter(p => (p.correctAnswers / p.totalQuestions * 100) < 50).length }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="#facc15" />
                        <Cell fill="#f87171" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                          borderColor: theme === 'dark' ? '#334155' : '#cbd5e1',
                          fontSize: '12px'
                        }}
                      />
                      <Legend layout="horizontal" verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}