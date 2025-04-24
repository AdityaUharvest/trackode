'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from '@/components/ThemeContext';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Share } from 'lucide-react';

const localizer = momentLocalizer(moment);

type MockTest = {
  _id: string;
  title: string;
  createdAt: Date;
  isPublished: boolean;
  attempts: number;
  shareCode: string;
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
export default function Dashboard({mockTests, setMockTests, attempts, setAttempts, stats, setStats}: {mockTests: MockTest[]; setMockTests: React.Dispatch<React.SetStateAction<MockTest[]>>; attempts: Attempt[]; setAttempts: React.Dispatch<React.SetStateAction<Attempt[]>>; stats: UserStats | null; setStats: React.Dispatch<React.SetStateAction<UserStats | null>>}) { 
  const { theme } = useTheme();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem(DASHBOARD_TAB_KEY) || 'overview';
    }
    return 'overview';
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
 

  
  
  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Header */}
      <header className={`${headerBg} shadow-sm`}>
        <div className="max-w-7xl mx-auto p-3 sm:px-3 lg:px-2 flex flex-col sm:flex-row justify-between items-center gap-3">
          <h1 className={`text-lg font-semibold ${textColor}`}>TCS Dashboard</h1>
          <Link
            href="/mock-tests"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            New Mock Test
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto p-2 sm:px-2 lg:px-2  ${bgColor}`}>
        {/* Tabs - Mobile friendly */}
        <div className={`border-b ${borderColor} mb-6 overflow-x-auto`}>
          <nav className="flex space-x-4 sm:space-x-8">
            {(['overview', 'mocks', 'results'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : `border-transparent ${secondaryText} hover:text-gray-700 hover:border-gray-300`
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'mocks' && 'Created Mocks'}
                {tab === 'results' && 'My Results'}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className={`rounded-lg shadow-sm p-4 sm:p-6 ${cardBg} ${borderColor}`}>
          {activeTab === 'overview' && (
            <OverviewTab 
              mocks={mockTests} 
              attempts={attempts} 
              stats={stats} 
              theme={theme} 
              textColor={textColor}
              secondaryText={secondaryText}
              isMobile={isMobile}
            />
          )}
          {activeTab === 'mocks' && (
            <MockTestsTab 
              mocks={mockTests}
              setMocks={setMockTests} 
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              secondaryText={secondaryText}
              tableHeaderBg={tableHeaderBg}
              tableRowHover={tableRowHover}
              isMobile={isMobile}
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
              isMobile={isMobile}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Tab Components with responsive improvements
function OverviewTab({ mocks, attempts, stats, theme, textColor, secondaryText, isMobile }: 
  { mocks: MockTest[]; attempts: Attempt[]; stats: UserStats | null; 
    theme: string; textColor: string; secondaryText: string; isMobile: boolean }) {
  
  const statCardBg = theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50';
  const statTextColor = theme === 'dark' ? 'text-gray-100' : 'text-blue-800';
  
  return (
    <div className="space-y-6">
      {/* Quick Stats - Stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${statCardBg}`}>
          <h3 className={`text-xs sm:text-sm font-medium ${statTextColor}`}>Mock Tests Created</h3>
          <p className={`mt-1 text-xl sm:text-2xl font-semibold ${statTextColor}`}>{mocks.length}</p>
        </div>
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
          <h3 className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-green-800'}`}>Tests Attempted</h3>
          <p className={`mt-1 text-xl sm:text-2xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-green-600'}`}>{attempts.length}</p>
        </div>
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <h3 className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-purple-800'}`}>Average Score</h3>
          <p className={`mt-1 text-xl sm:text-2xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-purple-600'}`}>
            {stats?.averageScore !== null ? `${stats?.averageScore}%` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Recent Activity - Full width on mobile */}
      <div>
        <h2 className={`text-sm font-semibold mb-3 ${textColor}`}>Recent Activity</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats?.recentActivity || []}
              margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} />
              <XAxis 
                dataKey="date" 
                stroke={secondaryText} 
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                stroke={secondaryText} 
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                  fontSize: isMobile ? 12 : 14
                }}
              />
              <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
              <Bar 
                dataKey="count" 
                name="Tests Taken" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Events - Simplified on mobile */}
      <div>
        <h2 className={`text-sm font-semibold mb-3 ${textColor}`}>Upcoming Mock Tests</h2>
        <div className="h-64">
          <Calendar
            localizer={localizer}
            events={mocks.map(mock => ({
              title: mock.title,
              start: new Date(mock.createdAt),
              end: new Date(mock.createdAt),
              allDay: true
            }))}
            defaultView={isMobile ? 'agenda' : 'month'}
            views={isMobile ? ['agenda'] : ['month', 'week', 'day']}
            style={{
              height: '100%',
              backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
              color: textColor,
              fontSize: isMobile ? 12 : 14
            }}
            toolbar={!isMobile}
          />
        </div>
      </div>
    </div>
  );
}

function MockTestsTab({ mocks,setMocks, cardBg, borderColor, textColor, secondaryText, tableHeaderBg, tableRowHover, isMobile }: 
  { mocks: MockTest[];setMocks: React.Dispatch<React.SetStateAction<MockTest[]>>; cardBg: string; borderColor: string; textColor: string; 
    secondaryText: string; tableHeaderBg: string; tableRowHover: string; isMobile: boolean }) {
  
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
          toast.error( 'Failed to update publish status');
        }
      };
   const { theme } = useTheme();
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-1">
        <h2 className={`text-sm font-semibold ${textColor}`}>My Mock Tests</h2>
        <Link
          href="/mock-tests"
          className="w-full sm:w-auto inline-flex justify-center items-center p-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          New Mock Test
        </Link>
      </div>

      {mocks.length === 0 ? (
        <div className={`text-center py-8 ${textColor}`}>
          <p className={`mb-4 ${secondaryText}`}>You haven't created any mock tests yet</p>
          <Link
            href="/mock-tests"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create First Mock Test
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={tableHeaderBg}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Title
                </th>
                {!isMobile && (
                  <>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                      Created On
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                      Status
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                      Participants
                    </th>
                  </>
                )}
                <th className={`px-4 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${cardBg} divide-y ${borderColor}`}>
              {mocks.map((mock) => (
                <tr key={mock._id} className={tableRowHover}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${textColor}`}>
                      {isMobile ? mock.title.substring(0, 20) + (mock.title.length > 20 ? '...' : '') : mock.title}
                    </div>
                    {isMobile && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          mock.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {mock.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className={`text-xs ${secondaryText}`}>
                          {new Date(mock.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </td>
                  
                  {!isMobile && (
                    <>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`text-sm ${secondaryText}`}>
                          {new Date(mock.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
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
                      <td className={`px-4 py-4 whitespace-nowrap text-sm ${secondaryText}`}>
                        {mock.attempts || 0}
                      </td>
                    </>
                  )}
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/mock-tests/${mock._id}/results`}
                        className={`text-xs sm:text-sm px-2 py-1 rounded ${
                          theme === 'dark' ? 'bg-green-600 text-white hover:bg-green-800' : 'bg-green-600 text-white hover:bg-green-800'
                        }`}
                      >
                        Results
                      </Link>
                      <Button
                        onClick={() => handlePublish(mock._id, mock.isPublished)}
                        size="sm"
                       
                        className={`${mock.isPublished ? "bg-red-600 hover:bg-red-700 text-white":"bg-green-500 text-white hover:bg-green-700"} text-xs sm:text-sm px-2 py-1 h-auto`}
                      >
                        {mock.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Link
                        href={`/mock-tests/${mock._id}/questions`}
                        className={`text-xs sm:text-sm px-2 py-1 rounded ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        Questions
                      </Link>
                      <Button
                        onClick={()=>{
                          navigator.clipboard.writeText(`https://trackode.com/playy/${mock.shareCode}`);
                          toast.success('Share link copied to clipboard!');
                        }}
                        className={`text-xs sm:text-sm px-2 py-1 rounded ${
                          theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-100 hover:bg-blue-200'
                        }`}
                      >
                       <Share
                        size={10} className="ml-1" color={theme === 'dark' ? '#fff' : '#000'} 
                        ></Share>
                      </Button>
                    </div>
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

function ResultsTab({ attempts, cardBg, borderColor, textColor, secondaryText, tableHeaderBg, tableRowHover, isMobile }: 
  { attempts: Attempt[]; cardBg: string; borderColor: string; textColor: string; 
    secondaryText: string; tableHeaderBg: string; tableRowHover: string; isMobile: boolean }) {
  const { theme } = useTheme();
  return (
    <div>
      <h2 className={`text-sm font-semibold mb-6 ${textColor}`}>My Test Results</h2>

      {attempts.length === 0 ? (
        <div className={`text-center py-10 ${textColor}`}>
          <p className={`mb-4 ${secondaryText}`}>You haven't taken any mock tests yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={tableHeaderBg}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Test
                </th>
                {!isMobile && (
                  <th className={`px-4 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                    Date
                  </th>
                )}
                
                <th className={`px-4 py-3 text-left text-xs font-medium ${secondaryText} uppercase tracking-wider`}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody className={`${cardBg} divide-y ${borderColor}`}>
              {attempts.map((attempt) => (
                <tr key={attempt._id} className={tableRowHover}>
                  <td className="px-4 py-4">
                    <div className={`text-sm font-medium ${textColor}`}>
                      {isMobile ? 
                        attempt.quizTitle.substring(0, 20) + (attempt.quizTitle.length > 20 ? '...' : '') : 
                        attempt.quizTitle
                      }
                    </div>
                    {isMobile && (
                      <div className={`text-xs ${secondaryText} mt-1`}>
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  {!isMobile && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`text-sm ${secondaryText}`}>
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </div>
                    </td>
                  )}
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link
                      href={`mock-tests/${attempt._id}/user-results`}
                      className={`text-xs sm:text-sm px-2 py-1 rounded ${
                        theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {isMobile ? 'View' : 'View Details'}
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