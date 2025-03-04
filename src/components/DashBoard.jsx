'use client';
import { useTheme } from '@/components/ThemeContext'; // Import ThemeContext
import Quizes from './Quizes';
import Contests from './Contests';
import ProfileLeftCard from './ProfileLeftCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SkeletonLoader from "@/components/skeleton/Skeleton" // Import the SkeletonLoader component

export default function DashBoard() {
  const [quizes, setQuizes] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  var activeQuizes = 0;
  for (let i = 0; i < quizes.length; i++) {
    if (quizes[i].active) {
      activeQuizes++;
    }
  }
  let totalmarks = 0;

  let participationData = []
  for (let i = 0; i < participants.length; i++) {
    totalmarks += participants[i].correctAnswers / participants[i].totalQuestions * 100;
  }
  let count = 0;

  for (let i = 0; i < quizes.length; i++) {
    count = 0;

    for (let j = 0; j < participants.length; j++) {
      console.log(participants[j]);
      if (participants[j].quiz._id == quizes[i]._id) {

        count++;
      }
    }
    participationData.push({ name: quizes[i].name, participants: count });
  }

  //recent quiz attempts
  let recentData = [];
  for (let i = 0; i < participants.length; i++) {

    const date = new Date(participants[i].attemptedAt);
    if(i<5){
    recentData.push({
      name: participants[i].quiz.name,
      score: participants[i].correctAnswers / participants[i].totalQuestions * 100,
      studentName: participants[i].student.name,
      time: date.toLocaleString()
    });}
  }

  const fetchQuiz = async () => {
    try {
      const response = await axios.get('/api/quiz-get');
      setQuizes(response.data.quizzes);
      setParticipants(response.data.participants);
      setRecent(response.data.recentParticipants);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false in case of error
    }
  }

  useEffect(() => {
    fetchQuiz();
  }, []);

  const quizStats = {
    totalQuizzes: quizes.length,
    activeQuizzes: activeQuizes,
    totalParticipants: participants.length,
    totalParticipantsInRecentQuizzes: recent.length,
    avgScore: Math.round(totalmarks / participants.length) ? Math.round(totalmarks / participants.length) : 0,

    performanceData: participationData,
    answerDistribution: [
      { name: 'Correct', value: 75 },
      { name: 'Incorrect', value: 25 },
    ],
  };

  const StatCard = ({ title, value, trend, theme }) => (
    <div className={`p-4   border-gray-50 rounded-lg ${theme === 'dark' ? 'bg-gray-800 shadow-xl shadow-gray-900' : 'bg-white shadow-xl shadow-slate-300'} shadow-lg`}>
      <h3 className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
      <div className="flex items-baseline mt-2">
        <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</span>
        {trend && <span className="ml-2 text-sm text-green-500">{trend}</span>}
      </div>
    </div>
  );

  const { theme, toggleTheme } = useTheme(); // Get theme and toggle function

  if (loading) {
    return <SkeletonLoader theme={theme} />; // Display the skeleton while loading
  }

  return (
    <div className={`flex mt-0 shadow-inner flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-900'}`}>
      {/* Profile Section */}
      <ProfileLeftCard />

      <div className={`lg:w-3/4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} sm:mt-5 mr-3 mb-4 rounded-xl p-2 flex flex-col`}>
        <div className="flex justify-between items-center">
          <h1 className="lg:text-xl sm:text-base ml-3 mt-1 font-bold text-center lg:text-left">Dashboard</h1>
        </div>
        {quizes.length > 0 ? (
          <div className='mt-1 p-1'>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard theme={theme} title="Created Quizzes " value={quizStats.totalQuizzes} />
              <StatCard theme={theme} title="Active Quizzes" value={quizStats.activeQuizzes} />
              <StatCard theme={theme} title="Total Registrations" value={quizStats.totalParticipants.toLocaleString()} trend="+12%" />
              <StatCard theme={theme} title="Recent Participations" value={quizStats.totalParticipantsInRecentQuizzes.toLocaleString()} trend="+4%" />
              
            </div>

            {/* Charts Section */}
            {participants.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Participation Chart */}
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <h3 className={`mb-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Quiz Participation</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={participationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#64748b' : '#cbd5e1'} />
                        <XAxis dataKey="name" stroke={theme === 'dark' ? '#fff' : '#000'} />
                        <YAxis stroke={theme === 'dark' ? '#fff' : '#000'} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                            borderColor: theme === 'dark' ? '#334155' : '#cbd5e1'
                          }}
                        />
                        <Bar dataKey="participants" fill={theme === 'dark' ? '#3b82f6' : '#2563eb'} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Performance Trend */}
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <h3 className={`mb-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Performance Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={quizStats.performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#64748b' : '#cbd5e1'} />
                        <XAxis dataKey="name" stroke={theme === 'dark' ? '#fff' : '#000'} />
                        <YAxis stroke={theme === 'dark' ? '#fff' : '#000'} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                            borderColor: theme === 'dark' ? '#334155' : '#cbd5e1'
                          }}
                        />
                        <Line type="monotone" dataKey="participants" stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Answer Distribution */}
                  
                  {/* Recent Quiz Attempts */}
                  <div className={`lg:col-span-3 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <h3 className={`mb-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Recent Quiz Attempts</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`text-left text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            <th className="pb-3">User</th>
                            <th className="pb-3">Quiz</th>
                            <th className="pb-3">Score</th>
                            <th className="pb-3">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentData.map((item) => (
                            <tr key={item} className={theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'}>
                              <td className="py-3 text-sm">{item.studentName} </td>
                              <td className="py-3 text-sm">{item.name}</td>
                              <td className="py-3 text-sm">{item.score}%</td>
                              <td className="py-3 text-sm">{item.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (null)}
          </div>
        ) : (null)}

        <Quizes />
      </div>
    </div>
  );
}