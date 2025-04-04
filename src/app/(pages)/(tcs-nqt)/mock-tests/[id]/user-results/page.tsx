'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeContext';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Printer, AlertCircle, Loader2, Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface QuestionResult {
  _id: string;
  text: string;
  options: string[];
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
}

interface SectionResult {
  sectionName: string;
  correct: number;
  total: number;
  questions: QuestionResult[];
}

interface UserResult {
  userName: string;
  quizTitle: string;
  completedAt: string;
  totalScore: number;
  totalQuestions: number;
  sections: SectionResult[];
}

export default function UserQuizResult() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const { id: quizId } = useParams();
  const [result, setResult] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const sectionHeaderBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const correctOptionBg = theme === 'dark' ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-500';
  const wrongOptionBg = theme === 'dark' ? 'bg-red-900/30 border-red-600' : 'bg-red-50 border-red-500';
  const neutralOptionBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/mock-tests/${quizId}/user-result`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        setResult(data);
        
        // Expand all sections by default
        const defaultExpanded = data.sections.reduce((acc: Record<string, boolean>, section: SectionResult) => {
          acc[section.sectionName] = true;
          return acc;
        }, {});
        setExpandedSections(defaultExpanded);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session && quizId) {
      fetchResult();
    }
  }, [session, quizId]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const toggleQuestionExplanation = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} gap-4`}>
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className={`text-sm ${textColor}`}>Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} gap-6 p-2`}>
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className={`text-sm font-semibold ${textColor}`}>Error Loading Results</h2>
          <p className={`text-gray-500 dark:text-gray-400`}>{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} gap-6 p-2`}>
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500" />
          <h2 className={`text-sm font-semibold ${textColor}`}>No Results Found</h2>
          <p className={`text-gray-500 dark:text-gray-400`}>You haven't attempted this quiz yet.</p>
        </div>
        <Button asChild>
          <a href={`/mock-tests/${quizId}`}>Take the Quiz</a>
        </Button>
      </div>
    );
  }

  const overallPercentage = Math.round((result.totalScore / result.totalQuestions) * 100);
  const performanceColor = overallPercentage >= 70 ? 'text-green-500' : 
                         overallPercentage >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className={`min-h-screen p-2 md:p-4 ${bgColor}`}>
      <div className={`max-w-7xl mx-auto rounded-xl shadow-sm p-2 ${cardBg} ${borderColor} border`}>
        {/* Header with user info and overall score */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="space-y-2">
            <h1 className="text-sm font-semibold">{result.quizTitle} - Results</h1>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${textColor}`}>Completed by {result.userName}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(result.completedAt).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-3xl font-semibold ${performanceColor}`}>
                  {overallPercentage}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Overall Score</div>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-blue-500">
                <span className="text-sm font-semibold">{result.totalScore}/{result.totalQuestions}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Results
              </Button>
              <Button asChild>
                <a href={`/mock-tests/${quizId}`}>Retake Quiz</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Overall performance */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Your Performance</span>
            <span className="text-sm font-medium">{overallPercentage}%</span>
          </div>
          <Progress 
            value={overallPercentage} 
            className="h-3"
            
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {result.sections.map((section) => {

            const sectionPercentage = Math.round((section.correct / section.total) * 100);

            const sectionPerformanceColor = sectionPercentage >= 70 ? 'text-green-500' : 
                                          sectionPercentage >= 40 ? 'text-yellow-500' : 'text-red-500';
            if (section.total === 0) return null; // Skip empty sections
            return (
              <div key={section.sectionName} className={`rounded-lg border ${borderColor} overflow-hidden`}>
                {/* Section header */}
                <div 
                  className={`flex justify-between items-center p-2 cursor-pointer ${sectionHeaderBg} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                  onClick={() => toggleSection(section.sectionName)}
                >
                  <div className="flex items-center gap-4">
                    <h2 className="font-semibold">
                      {section.sectionName.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </h2>
                    <Badge 
                      variant={
                        sectionPercentage >= 70 ? 'secondary' : 
                        sectionPercentage >= 40 ? 'destructive':'default'
                      }
                    >
                      {section.correct}/{section.total} ({sectionPercentage}%)
                    </Badge>
                  </div>
                  <button 
                    className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(section.sectionName);
                    }}
                  >
                    {expandedSections[section.sectionName] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Section content (questions) */}
                {expandedSections[section.sectionName] && (
                  <div className="p-2 space-y-6">
                    <div className="grid gap-4">
                      {section.questions.map((question) => (
                        <div 
                          key={question._id} 
                          className={`p-2 rounded-lg ${cardBg} ${borderColor} border`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-medium text-base">{question.text}</h3>
                            <div className="flex-shrink-0">
                              {question.userAnswer === question.correctAnswer ? (
                                <Badge variant="default" className="gap-1">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Correct
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="gap-1">
                                  <XCircle className="h-4 w-4" />
                                  Incorrect
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Options */}
                          <div className="space-y-3 my-4">
                            {question.options.map((option, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  index === question.correctAnswer
                                    ? correctOptionBg
                                    : index === question.userAnswer && index !== question.correctAnswer
                                    ? wrongOptionBg
                                    : `${neutralOptionBg} ${borderColor}`
                                }`}
                              >
                                <div className="flex items-start">
                                  <span className="mr-2 font-medium mt-0.5">{String.fromCharCode(65 + index)}.</span>
                                  <div>
                                    <p className="text-sm">{option}</p>
                                    {index === question.correctAnswer && (
                                      <p className="text-xs mt-1 text-green-600 dark:text-green-400 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Correct Answer
                                      </p>
                                    )}
                                    {index === question.userAnswer && index !== question.correctAnswer && (
                                      <p className="text-xs mt-1 text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <XCircle className="h-3 w-3" />
                                        Your Answer
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Explanation */}
                          <div>
                            <button
                              onClick={() => toggleQuestionExplanation(question._id)}
                              className={`flex items-center text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}
                            >
                              {expandedQuestions[question._id] ? 'Hide Explanation' : 'Show Explanation'}
                              {expandedQuestions[question._id] ? (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              )}
                            </button>

                            {expandedQuestions[question._id] && (
                              <div className={`mt-3 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} border ${borderColor}`}>
                                <p className="font-medium mb-2 flex items-center gap-2">
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                  Explanation:
                                </p>
                                <p className="text-sm">{question.explanation || 'No explanation provided.'}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary at bottom */}
        <div className={`mt-8 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'} border ${borderColor}`}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Quiz Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
              <p className="text-sm font-semibold">{result.totalQuestions}</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Correct Answers</p>
              <p className="text-sm font-semibold text-green-500">{result.totalScore}</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall Score</p>
              <p className="text-sm font-semibold">{overallPercentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}