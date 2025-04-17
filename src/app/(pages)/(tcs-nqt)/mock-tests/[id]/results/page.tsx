'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Search, ArrowLeft, Printer, Trophy, Medal, Award} from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';
import { useSession } from 'next-auth/react';
import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Markdown from 'react-markdown';

interface SectionStats {
  answered: number;
  correct: number;
  totalQuestions: number;
  accuracy?: number;
}

interface UserAttempt {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  quizTitle: string;
  startedAt: string;
  completedAt: string;
  totalAnswered: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  sectionStats: Record<string, SectionStats>;
  rank?: number;
}

export default function QuizResultsDashboard({ params }: any) {
  const { theme } = useTheme();
  const { id } = useParams();
  const quizId = id;
  const { data: session } = useSession();
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<UserAttempt[]>([]);
  const [topPerformers, setTopPerformers] = useState<UserAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ 
    key: string; 
    direction: 'asc' | 'desc' 
  }>({ 
    key: 'accuracy', 
    direction: 'desc' 
  });
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [quizStats, setQuizStats] = useState({
    quizTitle: '',
    totalParticipants: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const [sections, setSections] = useState<any[]>([]);
  const printingRef = React.useRef<HTMLDivElement>(null);
  let sectionss = [];
  const getPersonalizedFeedback = async (sectionStats: Record<string, SectionStats>, userName: string) => {
    try {
      // Prepare the prompt with section data
      const prompt = `Provide concise personalized feedback for ${userName} based on these quiz section results:\n\n${
        Object.entries(sectionStats).map(([section, stats]) => 
          `${section}: Answered ${stats.answered}/${stats.totalQuestions}, Correct ${stats.correct}, Accuracy ${Math.round((stats.correct / stats.answered) * 100)}%`
        ).join('\n')
      }\n\nPlease provide specific feedback highlighting strengths, areas for improvement, and study recommendations.`;
  
      const response = await axios.post('/api/generate-feedback', { prompt });
      return response.data.instructions;
    } catch (error) {
      console.error('Error getting personalized feedback:', error);
      return null;
    }
  };
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await axios.get('/api/fetchSection');
        setSections(res.data.sections);
      } catch (error) {
        console.error('Failed to fetch sections', error);
      }
    };
    fetchSection();
  }, []);

  for (let i = 0; i < sections.length; i++) {
    sectionss.push(sections[i].value);
  }

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/mock-tests/${quizId}/results`);
        const data = await response.json();
        
        // Sort attempts by accuracy and add ranking
        const sortedAttempts = [...data.attempts].sort((a, b) => b.accuracy - a.accuracy);
        const rankedAttempts = sortedAttempts.map((attempt, index) => ({
          ...attempt,
          rank: index + 1
        }));
        
        setAttempts(rankedAttempts);
        setTopPerformers(rankedAttempts.slice(0, 3));
        setFilteredAttempts(rankedAttempts);
        
        setQuizStats({
          quizTitle: data.quizTitle,
          totalParticipants: data.totalParticipants
        });
      } catch (error) {
        console.error("Failed to fetch attempts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttempts();
  }, [quizId]);

  useEffect(() => {
    let results = [...attempts];

    if (searchTerm) {
      results = results.filter(attempt =>
        attempt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attempt.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sectionFilter !== 'all') {
      results = results.filter(attempt => 
        attempt.sectionStats[sectionFilter] !== undefined && 
        attempt.sectionStats[sectionFilter].answered > 0
      );
    }

    results.sort((a, b) => {
      if (sortConfig.key === 'completedAt') {
        return sortConfig.direction === 'asc'
          ? new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
          : new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      } else if (sortConfig.key === 'userName') {
        return sortConfig.direction === 'asc'
          ? a.userName.localeCompare(b.userName)
          : b.userName.localeCompare(a.userName);
      } else if (sortConfig.key === 'totalAnswered') {
        return sortConfig.direction === 'asc'
          ? a.totalAnswered - b.totalAnswered
          : b.totalAnswered - a.totalAnswered;
      } else if (sortConfig.key === 'totalCorrect') {
        return sortConfig.direction === 'asc'
          ? a.totalCorrect - b.totalCorrect
          : b.totalCorrect - a.totalCorrect;
      } else if (sortConfig.key === 'accuracy') {
        return sortConfig.direction === 'asc'
          ? a.accuracy - b.accuracy
          : b.accuracy - a.accuracy;
      }
      return 0;
    });

    setFilteredAttempts(results);
  }, [attempts, searchTerm, sectionFilter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleExpandAttempt = async (attemptId: string) => {
    setExpandedAttempt(prev => {
      const newState = prev === attemptId ? null : attemptId;
      if (newState !== null) {
        // Trigger confetti effect when expanding
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        // Fetch personalized feedback if we don't have it already
        const attempt = attempts.find(a => a._id === attemptId);
        if (attempt && !feedback[attemptId]) {
          getPersonalizedFeedback(attempt.sectionStats, attempt.userName)
            .then(fb => {
              if (fb) {
                setFeedback(prev => ({ ...prev, [attemptId]: fb }));
              }
            });
        }
      }
      return newState;
    });
  };
  useEffect(
    ()=>{
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    },[]
  )
  // Medal rendering functions
  const renderMedal = (rank: number) => {
    if (rank === 1) return <Trophy className="h-8 w-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-7 w-7 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-700" />;
    return null;
  };

  const renderRankBadge = (rank: number) => {
    if (rank > 3) return null;
    
    const badgeColors = {
      1: 'bg-yellow-500',
      2: 'bg-gray-400',
      3: 'bg-amber-700'
    };
    
    return (
      <span className={`${badgeColors[rank as keyof typeof badgeColors]} text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center`}>
        {rank}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${bgColor}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 min-h-screen ${bgColor} ${textColor}`}>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {Array.from({ length: 100 }).map((_, i) => {
              const left = Math.random() * 100;
              const animationDelay = Math.random() * 2;
              const size = Math.floor(Math.random() * 8) + 6;
              
              return (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'][
                      Math.floor(Math.random() * 16)
                    ],
                    
                    animationDelay: `${animationDelay}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
      <h1 className="text-lg font-semibold text-blue-500">
  {(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })()} {session?.user?.name} ✨
</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              if (printingRef.current) {
                const printContents = printingRef.current.innerHTML;
                const originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                window.location.reload();
              }
            }}
            className={`gap-2 ${borderColor}`}
          >
            <Printer className="h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Leaderboard Podium */}
      {topPerformers.length > 0 && (
        <div className="relative flex flex-col items-center">
          {/* Top 3 Podium */}
          <div className="flex items-end justify-center w-full mb-8 space-x-2 md:space-x-4">
            {/* 2nd Place */}
            {topPerformers.length >= 2 && (
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 rounded-t-lg w-24 p-4 flex flex-col items-center h-28">
                  <div className="text-xl font-bold text-gray-700">2</div>
                  <div className="text-sm text-center font-semibold text-gray-700  max-w-full">
                    {topPerformers[1].userName}
                  </div>
                  <div className="text-sm font-bold text-gray-700">{topPerformers[1].accuracy}%</div>
                </div>
                <div className="bg-gray-300 h-16 w-24 flex items-center justify-center">
                  <div className="text-2xl">🥈</div>
                </div>
              </div>
            )}
            
            {/* 1st Place */}
            {topPerformers.length >= 1 && (
              <div className="flex flex-col items-center">
                <div className="bg-yellow-100 rounded-t-lg w-24 p-4 flex flex-col items-center h-32">
                  <div className="text-xl font-bold text-yellow-700">1</div>
                  <div className="text-sm text-center font-semibold text-yellow-800  max-w-full">
                    {topPerformers[0].userName}
                  </div>
                  <div className="text-sm font-bold text-yellow-700">{topPerformers[0].accuracy}%</div>
                </div>
                <div className="bg-yellow-200 h-20 w-24 flex items-center justify-center">
                  <div className="text-3xl">🏆</div>
                </div>
              </div>
            )}
            
            {/* 3rd Place */}
            {topPerformers.length >= 3 && (
              <div className="flex flex-col items-center">
                <div className="bg-orange-100 rounded-t-lg w-24 p-4 flex flex-col items-center h-28">
                  <div className="text-xl font-bold text-orange-700">3</div>
                  <div className="text-sm text-center font-semibold text-orange-800  max-w-full">
                    {topPerformers[2].userName}
                  </div>
                  <div className="text-sm font-bold text-orange-700">{topPerformers[2].accuracy}%</div>
                </div>
                <div className="bg-orange-200 h-12 w-24 flex items-center justify-center">
                  <div className="text-2xl">🥉</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Other rankings */}
          {topPerformers.length > 3 && (
            <div className="w-full mt-4">
              <h3 className="text-lg font-semibold mb-2">Other Top Performers</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {topPerformers.slice(3).map((performer, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border-b last:border-0">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-bold mr-3">{index + 4}</span>
                      <span className="font-medium">{performer.userName}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-sm">
                      {performer.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${secondaryText}`} />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 ${cardBg} ${borderColor}`}
          />
        </div>

        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className={`${cardBg} ${borderColor}`}>
            <SelectValue placeholder="Filter by section" />
          </SelectTrigger>
          <SelectContent className={`${cardBg} ${borderColor}`}>
            <SelectItem value="all">All Sections</SelectItem>
            {sectionss.map(section => (
              <SelectItem key={section} value={section}>
                {section.split('-').map((word:any) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="outline"
          className={`${borderColor}`}
          onClick={() => {
            setSearchTerm('');
            setSectionFilter('all');
          }}
        >
          Clear Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg shadow border ${cardBg} ${borderColor}`}>
          <h3 className={`text-sm font-medium ${secondaryText}`}>Total Attempts</h3>
          <p className="text-xl font-bold">{quizStats.totalParticipants}</p>
        </div>
        <div className={`p-4 rounded-lg shadow border ${cardBg} ${borderColor}`}>
          <h3 className={`text-sm font-medium ${secondaryText}`}>Average Answered</h3>
          <p className="text-xl font-bold">
            {attempts.length > 0 
              ? Math.round(attempts.reduce((sum, a) => sum + a.totalAnswered, 0) / attempts.length) 
              : 0}
          </p>
        </div>
        <div className={`p-4 rounded-lg shadow border ${cardBg} ${borderColor}`}>
          <h3 className={`text-sm font-medium ${secondaryText}`}>Average Correct</h3>
          <p className="text-xl font-bold">
            {attempts.length > 0 
              ? Math.round(attempts.reduce((sum, a) => sum + a.totalCorrect, 0) / attempts.length) 
              : 0}
          </p>
        </div>
        <div className={`p-4 rounded-lg shadow border ${cardBg} ${borderColor}`}>
          <h3 className={`text-sm font-medium ${secondaryText}`}>Average Accuracy</h3>
          <p className="text-xl font-bold">
            {attempts.length > 0 
              ? Math.round(attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length) 
              : 0}%
          </p>
        </div>
      </div>

      <div 
        ref={printingRef}
        className={`rounded-lg shadow overflow-hidden border ${cardBg} ${borderColor}`}
      >
        <div className="flex justify-evenly border-b-blue-500 border-b-2 p-3">
          <p className='text-center'>
            <span className='text-blue-600 text-sm font-medium'>Participants: {quizStats.totalParticipants}</span> 
          </p>
          <p className='text-center'>
            <span className='text-blue-600 text-sm font-medium'>{quizStats.quizTitle}</span> 
          </p>
          <span className='text-center text-blue-600 text-sm font-medium'>
            Visit:
            <Link href='www.trackode.in/'> www.trackode.in</Link>
          </span>
          
          
        </div>
        
        <Table>
          <TableHeader className={headerBg}>
            <TableRow className={borderColor}>
              <TableHead className={`w-12 ${textColor}`}>Rank</TableHead>
              <TableHead className={textColor}>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('userName')}
                  className={`px-0 hover:bg-transparent font-medium ${textColor}`}
                >
                  Player {sortConfig.key === 'userName' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className={`text-right ${textColor}`}>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('totalAnswered')}
                  className={`px-0 hover:bg-transparent font-medium ${textColor}`}
                >
                  Answered {sortConfig.key === 'totalAnswered' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className={`text-right ${textColor}`}>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('totalCorrect')}
                  className={`px-0 hover:bg-transparent font-medium ${textColor}`}
                >
                  Overall Correct {sortConfig.key === 'totalCorrect' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className={`text-right ${textColor}`}>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('totalCorrect')}
                  className={`px-0 hover:bg-transparent font-medium ${textColor}`}
                >
                  Score Ratio {sortConfig.key === 'totalCorrect' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className={`text-right ${textColor}`}>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('accuracy')}
                  className={`px-0 hover:bg-transparent font-medium ${textColor}`}
                >
                  Accuracy {sortConfig.key === 'accuracy' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className={`text-right ${textColor}`}>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('completedAt')}
                  className={`px-0 hover:bg-transparent font-medium ${textColor}`}
                >
                  Completed {sortConfig.key === 'completedAt' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className={`text-right ${textColor}`}>Time taken</TableHead>
              <TableHead className={`text-right ${textColor}`}>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttempts.length === 0 ? (
              <TableRow className={borderColor}>
                <TableCell colSpan={8} className={`text-center py-8 ${secondaryText}`}>
                  No attempts found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredAttempts.map(attempt => (
                <React.Fragment key={attempt._id}>
                  <TableRow className={`${hoverBg} ${borderColor}`}>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {attempt.rank && attempt.rank <= 3 ? (
                          <div className="relative animate-pulse">
                            {renderMedal(attempt.rank)}
                            {renderRankBadge(attempt.rank)}
                          </div>
                        ) : (
                          <span className={`${textColor} font-medium`}>{attempt.rank}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${textColor} ${attempt.rank && attempt.rank <= 3 ? 'font-bold' : ''}`}>
                        {attempt.userName}
                      </div>
                      <div className={`text-sm ${secondaryText}`}>{attempt.email}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${textColor}`}>{attempt.totalAnswered}</span>
                      <span className={`text-sm ${secondaryText}`}>/{attempt.totalQuestions}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${textColor}`}>{attempt.totalCorrect}</span>
                      <span className={`text-sm ${secondaryText}`}>/{attempt.totalQuestions}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${textColor}`}>{attempt.totalCorrect}</span>/
                      <span className={`text-sm ${secondaryText}`}>{attempt.totalAnswered}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${textColor} ${attempt.rank && attempt.rank <= 3 ? 'text-green-500 font-bold' : ''}`}>
                        {attempt.accuracy}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={textColor}>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                      <div className={`text-xs ${secondaryText}`}>
                        {new Date(attempt.startedAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`text-sm ${textColor}`}>
                        {((new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000).toFixed(2)} min
                      </div>
                      <div className={`text-xs ${secondaryText}`}>
                        {new Date(attempt.completedAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpandAttempt(attempt._id)}
                        className={textColor}
                      >
                        {expandedAttempt === attempt._id ? (
                          <>
                            <ChevronUp className="mr-1 h-4 w-4" /> Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1 h-4 w-4" /> Show
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedAttempt === attempt._id && (
                    <TableRow className={borderColor}>
                      <TableCell colSpan={9} className="p-0">
                        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-xl font-bold ${textColor}`}>Performance Analysis</h3>
                            {attempt.rank && attempt.rank <= 3 && (
                              <div className="flex items-center">
                                {renderMedal(attempt.rank)}
                                <span className={`ml-2 font-bold ${attempt.rank === 1 ? 'text-yellow-500' : attempt.rank === 2 ? 'text-gray-400' : 'text-amber-700'}`}>
                                  {attempt.rank === 1 ? 'Gold Medal' : attempt.rank === 2 ? 'Silver Medal' : 'Bronze Medal'}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {Object.entries(attempt.sectionStats).map(([section, stats]) => (
                              stats.answered > 0 && (
                                <div 
                                  key={section} 
                                  className={`border rounded-lg p-5 ${cardBg} ${borderColor} transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                                >
                                  <h4 className={`font-bold text-lg mb-3 ${textColor}`}>
                                    {section.split('-').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                  </h4>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm ${secondaryText}`}>Answered:</span>
                                        <span className={`font-medium ${textColor}`}>
                                          {stats.answered}/{stats.totalQuestions}
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-300 rounded-full h-2">
                                        <div 
                                          className="bg-blue-500 h-2 rounded-full" 
                                          style={{ width: `${(stats.answered / stats.totalQuestions) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm ${secondaryText}`}>Correct:</span>
                                        <span className={`font-medium ${textColor}`}>
                                          {stats.correct}/{stats.answered}
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-300 rounded-full h-2">
                                        <div 
                                          className="bg-green-500 h-2 rounded-full" 
                                          style={{ width: `${(stats.correct / stats.answered) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm ${secondaryText}`}>Accuracy:</span>
                                        <span className={`font-medium ${textColor}`}>
                                          {Math.round((stats.correct / stats.answered) * 100)}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-300 rounded-full h-2">
                                        <div 
                                          className={`h-2 rounded-full ${
                                            Math.round((stats.correct / stats.answered) * 100) >= 80 ? 'bg-green-500' : 
                                            Math.round((stats.correct / stats.answered) * 100) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                          }`}
                                          style={{ width: `${(stats.correct / stats.answered) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Animated Performance Indicator */}
                                  <div className="mt-4 flex items-center justify-center">
                                    <div className={`relative w-12 rounded-full flex items-center justify-center ${
                                      Math.round((stats.correct / stats.answered) * 100) >= 80 ? 'bg-green-100' :
                                      Math.round((stats.correct / stats.answered) * 100) >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                                    }`}>
                                      <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <path
                                          className="stroke-current text-gray-300"
                                          fill="none"
                                          strokeWidth="3"
                                          d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                          className={`stroke-current ${
                                            Math.round((stats.correct / stats.answered) * 100) >= 80 ? 'text-green-500' :
                                            Math.round((stats.correct / stats.answered) * 100) >= 50 ? 'text-yellow-500' : 'text-red-500'
                                          }`}
                                          fill="none"
                                          strokeWidth="3"
                                          strokeDasharray={`${Math.round((stats.correct / stats.answered) * 100)}, 100`}
                                          d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <text x="18" y="20.5" className="text-xs font-bold" textAnchor="middle" fill={theme === 'dark' ? '#e5e7eb' : '#374151'}>
                                          {Math.round((stats.correct / stats.answered) * 100)}%
                                        </text>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                          
                          {/* Performance Summary */}
                          <div className={`mt-6 p-5 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${borderColor}`}>
                            <h4 className={`font-bold mb-4 ${textColor}`}>Overall Performance</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <div className={`text-sm mb-1 ${secondaryText}`}>Time Spent</div>
                                <div className="flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className={`font-medium ${textColor}`}>
                                    {((new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000).toFixed(2)} minutes
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <div className={`text-sm mb-1 ${secondaryText}`}>Completion Rate</div>
                                <div className="flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className={`font-medium ${textColor}`}>
                                    {Math.round((attempt.totalAnswered / attempt.totalQuestions) * 100)}%
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <div className={`text-sm mb-1 ${secondaryText}`}>Overall Ranking</div>
                                <div className="flex items-center">
                                  {attempt.rank && attempt.rank <= 3 ? renderMedal(attempt.rank) : (
                                    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                  )}
                                  <span className={`font-medium ${textColor}`}>
                                    {attempt.rank ? `#${attempt.rank} of ${attempts.length}` : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className={`flex justify-between items-center mt-6 ${textColor}`}>
        <div className={`text-sm ${secondaryText}`}>
          Showing {filteredAttempts.length} of {attempts.length} results
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className={`${borderColor}`} disabled>
            Previous
          </Button>
          <Button variant="outline" className={`${borderColor}`} disabled>
            Next
          </Button>
        </div>
      </div>
      
      {/* Add CSS for confetti animation */}
      <style jsx global>{`
        .confetti-container {
          position: fixed;
          width: 100%;
          height: 100%;
          overflow: hidden;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        
        .confetti {
          position: absolute;
          top: -10px;
          animation: confetti-fall 10s linear forwards;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}