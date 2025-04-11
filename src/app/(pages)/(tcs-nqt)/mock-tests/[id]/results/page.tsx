'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Search, ArrowLeft, Printer } from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';
import { useSession } from 'next-auth/react';
import React from 'react';
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
}

export default function QuizResultsDashboard({ params }: any) {
  const { theme } = useTheme();
  const { id } = useParams();
  const quizId = id;
  const { data: session } = useSession();
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<UserAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ 
    key: string; 
    direction: 'asc' | 'desc' 
  }>({ 
    key: 'completedAt', 
    direction: 'desc' 
  });
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [quizStats, setQuizStats] = useState({
    quizTitle: '',
    totalParticipants: 0
  });

  const sections = [
    'verbal-ability',
    'reasoning-ability',
    'numerical-ability',
    'advanced-quantitative',
    'advanced-reasoning',
    'advanced-coding',
    'c-arrays',
    'ratio-proportion',
  ];

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/mock-tests/${quizId}/results`);
        const data = await response.json();
        setAttempts(data.attempts);
        setQuizStats({
          quizTitle: data.quizTitle,
          totalParticipants: data.totalParticipants
        });
        setFilteredAttempts(data.attempts);
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

  const toggleExpandAttempt = (attemptId: string) => {
    setExpandedAttempt(prev => prev === attemptId ? null : attemptId);
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-bold"> Welcome {session?.user?.name}</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => window.print()} className={`gap-2 ${borderColor}`}>
            <Printer className="h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>

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
            {sections.map(section => (
              <SelectItem key={section} value={section}>
                {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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

      <div className={`rounded-lg shadow overflow-hidden border ${cardBg} ${borderColor}`}>
        <Table>
          <TableHeader className={headerBg}>
            <TableRow className={borderColor}>
              <TableHead className={textColor}>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort('userName')}
                  className={`px-0 hover:bg-transparent font-medium ${textColor}`}
                >
                  User {sortConfig.key === 'userName' && (
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
                  Correct {sortConfig.key === 'totalCorrect' && (
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
              <TableHead className={`text-right ${textColor}`}>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttempts.length === 0 ? (
              <TableRow className={borderColor}>
                <TableCell colSpan={7} className={`text-center py-8 ${secondaryText}`}>
                  No attempts found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredAttempts.map(attempt => (
                <React.Fragment key={attempt._id}>
                  <TableRow className={`${hoverBg} ${borderColor}`}>
                    <TableCell>
                      <div className={`font-medium ${textColor}`}>{attempt.userName}</div>
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
                      <span className={`font-medium ${textColor}`}>{attempt.accuracy}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={textColor}>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                      <div className={`text-sm ${secondaryText}`}>
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
                      <TableCell colSpan={7} className="p-0">
                        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <h3 className={`font-medium mb-3 ${textColor}`}>Section-wise Performance</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(attempt.sectionStats).map(([section, stats]) => (
                              stats.answered > 0 && (
                                <div key={section} className={`border rounded-lg p-4 ${cardBg} ${borderColor}`}>
                                  <h4 className={`font-medium mb-2 ${textColor}`}>
                                    {section.split('-').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className={`text-sm ${secondaryText}`}>Answered:</span>
                                      <span className={`font-medium ${textColor}`}>
                                        {stats.answered}/{stats.totalQuestions}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className={`text-sm ${secondaryText}`}>Correct:</span>
                                      <span className={`font-medium ${textColor}`}>
                                        {stats.correct}/{stats.answered}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className={`text-sm ${secondaryText}`}>Accuracy:</span>
                                      <span className={`font-medium ${textColor}`}>
                                        {Math.round((stats.correct / stats.answered) * 100)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            ))}
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
    </div>
  );
}