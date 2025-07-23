'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from '@/components/ThemeContext'; // Import your theme context
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import Head from 'next/head';
const localizer = momentLocalizer(moment);

type MockTest = {
  _id: string;
  title: string;
  createdAt: Date;
  isPublished: boolean;
  attempts: number;
  
};

type Attempt = {
  _id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  sectionScores: Record<string, { correct: number; total: number }>;
};

type UserStats = {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  sectionPerformance: { section: string; accuracy: number }[];
  recentActivity: { date: Date; count: number }[];
};
const DASHBOARD_TAB_KEY = 'overview-active-tab';
export default function MockTestDashboard() {
  const { theme } = useTheme(); // Get current theme
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(() => {
      // Initialize from localStorage if available
      if (typeof window !== 'undefined') {
        return localStorage.getItem(DASHBOARD_TAB_KEY) || 'overview';
      }
      return 'overview';
    });
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
      if (typeof window !== 'undefined') {
        localStorage.setItem(DASHBOARD_TAB_KEY, activeTab);
      }
    }, [activeTab]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const mocksRes = await fetch('/api/mock-tests/dashboard?creator=true');
        const mocksData = await mocksRes.json();
        setMockTests(mocksData);
        
        const attemptsRes = await fetch('/api/mock-tests/dashboard/attempts');
        const attemptsData = await attemptsRes.json();
        setAttempts(attemptsData);
       
        
        const statsRes = await fetch('/api/mock-tests/dashboard/stats');
        const statsData = await statsRes.json();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${bgColor}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  // Handle publish/unpublish action
  
  return (
    <>
      
      <main>
    <div className={`min-h-screen ${bgColor}`}>
      {/* Header */}
      <header className={`shadow ${headerBg}`}>
        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`sm:text-sm lg:text-lg font-bold ${textColor}`}>TCS NQT Dashboard</h1>
          <Link
            href="/mock-tests"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            New Mock Test
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={`mx-auto px-4 py-6 sm:px-6 lg:px-8 ${bgColor}`}>
        {/* Tabs */}
        <div className={`border-b ${borderColor} mb-6`}>
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : `border-transparent ${secondaryText} hover:text-gray-300 hover:border-gray-300`
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('mocks')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mocks'
                  ? 'border-indigo-500 text-indigo-600'
                  : `border-transparent ${secondaryText} hover:text-gray-300 hover:border-gray-300`
              }`}
            >
              Created Mock Tests
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-indigo-500 text-indigo-600'
                  : `border-transparent ${secondaryText} hover:text-gray-300 hover:border-gray-300`
              }`}
            >
              My Results
            </button>
            {/* <button
              onClick={() => setActiveTab('stats')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-indigo-500 text-indigo-600'
                  : `border-transparent ${secondaryText} hover:text-gray-300 hover:border-gray-300`
              }`}
            >
              Statistics
            </button> */}
          </nav>
        </div>

        {/* Tab Content */}
        <div className={`shadow rounded-lg p-6 ${cardBg} ${borderColor}`}>
          {activeTab === 'overview' && (
            <OverviewTab 
              mocks={mockTests} 
              attempts={attempts} 
              stats={stats} 
              theme={theme} 
              textColor={textColor}
              secondaryText={secondaryText}
            />
          )}
          {activeTab === 'mocks' && (
            <MockTestsTab 
              mocks={mockTests} 
              cardBg={cardBg}
              setMocks={setMockTests}
              borderColor={borderColor}
              textColor={textColor}
              secondaryText={secondaryText}
              tableHeaderBg={tableHeaderBg}
              tableRowHover={tableRowHover}
            />
          )}
          {activeTab === 'results' && (
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
          {activeTab === 'stats' && (
            <StatsTab 
              stats={stats} 
              attempts={attempts} 
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              secondaryText={secondaryText}
            />
          )}
        </div>
      </main>
    </div>
    </main>
    </>
  );
}

// Tab Components with theme props
function OverviewTab({ mocks, attempts, stats, theme, textColor, secondaryText }: 
  { mocks: MockTest[]; attempts: Attempt[]; stats: UserStats | null; 
    theme: string; textColor: string; secondaryText: string }) {
  
  const statCardBg = theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50';
  const statTextColor = theme === 'dark' ? 'text-gray-100' : 'text-indigo-800';
  
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg ${statCardBg}`}>
          <h3 className={`text-sm font-medium ${statTextColor}`}>Mock Tests Created</h3>
          <p className={`mt-2 text-lg font-bold ${statTextColor}`}>{mocks.length}</p>
        </div>
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
          <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-green-800'}`}>Tests Attempted</h3>
          <p className={`mt-2 text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-green-600'}`}>{attempts.length}</p>
        </div>
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-purple-800'}`}>Average Score</h3>
          <p className={`mt-2 text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-purple-600'}`}>
            {stats && stats.averageScore!==null? `${stats.averageScore}%` : 'Being Prepared'}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Recent Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats?.recentActivity || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} />
              <XAxis dataKey="date" stroke={secondaryText} />
              <YAxis stroke={secondaryText} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB'
                }}
              />
              <Legend />
              <Bar dataKey="count" name="Tests Taken" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className={`text-sm font-bold mb-4 ${textColor}`}>Upcoming Mock Tests</h2>
        <div className="h-64">
          <Calendar
            localizer={localizer}
            events={mocks.map(mock => ({
              title: mock.title,
              start: new Date(mock.createdAt),
              end: new Date(mock.createdAt),
              allDay: true
            }))}
            defaultView="month"
            views={['month', 'week', 'day']}
            style={{
              color: 'gray',
              backgroundColor: statCardBg,
              borderColor: 'indigo'
              
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MockTestsTab({ mocks, setMocks, cardBg, borderColor, textColor, secondaryText, tableHeaderBg, tableRowHover }: 
  { mocks: MockTest[]; setMocks: React.Dispatch<React.SetStateAction<MockTest[]>>; cardBg: string; borderColor: string; textColor: string; 
    secondaryText: string; tableHeaderBg: string; tableRowHover: string }) {
    
      const handlePublish = async (mockId: string, isPublished: boolean) => {
        try {
          const response = await fetch(`/api/mock-tests/${mockId}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPublished: !isPublished })
          });
          const data = await response.json();
          
          if (response.ok) {
            // Update the local state to reflect the change
            setMocks(prevMocks => 
              prevMocks.map(mock => 
                mock._id === mockId 
                  ? { ...mock, isPublished: !isPublished } // Toggle the isPublished status
                  : mock
              )
            );
            
            localStorage.setItem('shareLink', data.shareLink);
            toast.success(`Mock test ${!isPublished ? 'published' : 'unpublished'} successfully!`);
          } else {
            throw new Error(data.message || 'Failed to update publish status');
          }
        } catch (error) {
          console.error('Error publishing mock test:', error);
          toast.error('Failed to update publish status');
        }
      };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-sm font-bold ${textColor}`}>My Mock Tests</h2>
        <Link
          href="/mock-tests"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          New Mock Test
        </Link>
      </div>

      {mocks.length === 0 ? (
        <div className={`text-center py-12 ${textColor}`}>
          <p className={`mb-4 ${secondaryText}`}>You haven't created any mock tests yet</p>
          <Link
            href="/mock-tests"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            First Mock Test +
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={tableHeaderBg}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Title
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Created On
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Participants
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Results
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Publish
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Edit/Details
                </th>

              </tr>
            </thead>
            <tbody className={`${cardBg} divide-y ${borderColor}`}>
              {mocks.map((mock) => (
                <tr key={mock._id} className={tableRowHover}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textColor}`}>{mock.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${secondaryText}`}>
                      {new Date(mock.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        mock.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {mock.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${secondaryText}`}>
                    {mock.attempts || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/mock-tests/${mock._id}/results`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Results
                    </Link>
                    
                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                      onClick={()=>handlePublish(mock._id, mock.isPublished)}
                       
                      
                      className="text-indigo-600 bg-gray-50 hover:bg-gray-500 hover:text-indigo-900"
                    >
                      {mock.isPublished ? 'Unpublish' : 'Publish'}
                      
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                      href={`/mock-tests/${mock._id}/questions`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Questions
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ResultsTab({ attempts, cardBg, borderColor, textColor, secondaryText, tableHeaderBg, tableRowHover }: 
  { attempts: Attempt[]; cardBg: string; borderColor: string; textColor: string; 
    secondaryText: string; tableHeaderBg: string; tableRowHover: string }) {
  
  return (
    <div>
      <h2 className={`text-lg font-bold mb-6 ${textColor}`}>My Test Results</h2>

      {attempts.length === 0 ? (
        <div className={`text-center py-12 ${textColor}`}>
          <p className={`mb-4 ${secondaryText}`}>You haven't taken any mock tests yet</p>
          {/* <Link
            href="/mock-tests"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
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
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Detailed Result
                      </Link>
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

function StatsTab({ stats, attempts, cardBg, borderColor, textColor, secondaryText }: 
  { stats: UserStats | null; attempts: Attempt[]; cardBg: string; borderColor: string; 
    textColor: string; secondaryText: string }) {
  
  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div className="space-y-8">
      {/* Section Performance */}
      <div>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Section Performance (Your Stats section will be started working soon)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.sectionPerformance}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3"  />
              <XAxis dataKey="section" stroke={secondaryText} />
              <YAxis domain={[0, 100]} stroke={secondaryText} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Accuracy']}
                contentStyle={{
                 
                }}
              />
              <Legend />
              <Bar dataKey="accuracy" name="Accuracy" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Over Time */}
      <div>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Progress Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attempts.map(attempt => ({
                date: new Date(attempt.completedAt).toLocaleDateString(),
                score: (attempt.score / attempt.totalQuestions) * 100
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3"  />
              <XAxis dataKey="date" stroke={secondaryText} />
              <YAxis domain={[0, 100]} stroke={secondaryText} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Score']}
                contentStyle={{
                 
                }}
              />
              <Legend />
              <Bar dataKey="score" name="Score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg shadow ${cardBg} ${borderColor}`}>
          <h3 className={`text-lg font-medium mb-4 ${textColor}`}>Performance Highlights</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className={secondaryText}>Highest Score:</span>
              <span className={`font-medium ${textColor}`}>{stats.bestScore}%</span>
            </li>
            <li className="flex justify-between">
              <span className={secondaryText}>Average Score:</span>
              <span className={`font-medium ${textColor}`}>{stats.averageScore}%</span>
            </li>
            <li className="flex justify-between">
              <span className={secondaryText}>Tests Completed:</span>
              <span className={`font-medium ${textColor}`}>{stats.totalAttempts}</span>
            </li>
          </ul>
        </div>
        <div className={`p-6 rounded-lg shadow ${cardBg} ${borderColor}`}>
          <h3 className={`text-lg font-medium mb-4 ${textColor}`}>Strongest Section</h3>
          {/* <p className={`text-2xl font-bold text-green-600 mb-2 ${textColor}`}>
            {stats.sectionPerformance.reduce((prev, current) => 
              (prev.accuracy > current.accuracy) ? prev : current
            ).section}
          </p> */}
          <p className={secondaryText}>Keep up the good work in this section!</p>
        </div>
      </div>
    </div>
  );
}