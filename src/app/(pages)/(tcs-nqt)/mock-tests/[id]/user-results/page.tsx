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
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [loadingExplanations, setLoadingExplanations] = useState<Record<string, boolean>>({});
  const [detailedExplanations, setDetailedExplanations] = useState<Record<string, string>>({});

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

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  const toggleQuestionExplanation = async (
    questionId: string,
    questionText: string,
    userAnswerIndex: number,
    correctAnswerIndex: number,
    options: string[]
  ) => {
    // If already expanded, just toggle
    if (expandedExplanations[questionId]) {
      setExpandedExplanations(prev => ({
        ...prev,
        [questionId]: !prev[questionId]
      }));
      return;
    }

    try {
      // Set loading state for this question
      setLoadingExplanations(prev => ({ ...prev, [questionId]: true }));
      
      // Call the API to get detailed explanation
      const response = await fetch('/api/chat-gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Question: ${questionText}
          Options: ${options.join(', ')}
          Your answer: ${options[userAnswerIndex]}
          Correct answer: ${options[correctAnswerIndex]}

          Explain why the correct answer is ${options[correctAnswerIndex]} for the above question in not more than 100 words and in single sentence without topics.`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate explanation');
      }

      const data = await response.json();
      
      // Store the detailed explanation
      setDetailedExplanations(prev => ({
        ...prev,
        [questionId]: data.instructions
      }));

      // Expand the explanation
      setExpandedExplanations(prev => ({
        ...prev,
        [questionId]: true
      }));
    } catch (error) {
      console.error('Error generating explanation:', error);
      // Fall back to the original explanation if available
      const question = result?.sections
        .flatMap(s => s.questions)
        .find(q => q._id === questionId);
      
      setDetailedExplanations(prev => ({
        ...prev,
        [questionId]: question?.explanation || 'Could not generate detailed explanation.'
      }));
    } finally {
      setLoadingExplanations(prev => ({ ...prev, [questionId]: false }));
    }
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
        </div>
        
        {/* Quiz Summary */}
        <div className={`mt-8 p-2 mb-5 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'} border ${borderColor}`}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Quiz Summary
          </h3>
          <div className="grid mb-5 grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="p-3 space-y-6">
                    <div className="grid gap-4">
                      {section.questions.map((question, index) => (
                        <div key={question._id} className={`p-4 rounded-lg mb-4 ${cardBg} ${borderColor} border`}>
                          <div 
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleQuestion(question._id)}
                          >
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium">{index+1}: {question.text}</h3>
                              {question.userAnswer === question.correctAnswer ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                            <button className="p-1">
                              {expandedQuestions[question._id] ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </button>
                          </div>

                          {/* Collapsible content */}
                          {expandedQuestions[question._id] && (
                            <div className="mt-4">
                              {/* Options list */}
                              <div className="space-y-2">
                                {question.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className={`p-3 rounded border ${
                                      index === question.correctAnswer
                                        ? correctOptionBg
                                        : index === question.userAnswer
                                        ? wrongOptionBg
                                        : neutralOptionBg
                                    }`}
                                  >
                                    <div className="flex items-start">
                                      <span className="mr-2 font-medium">{String.fromCharCode(65 + index)}.</span>
                                      <div>
                                        <p>{option}</p>
                                        {index === question.correctAnswer && (
                                          <p className="text-xs mt-1 text-green-600 flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Correct Answer
                                          </p>
                                        )}
                                        {index === question.userAnswer && index !== question.correctAnswer && (
                                          <p className="text-xs mt-1 text-red-600 flex items-center gap-1">
                                            <XCircle className="h-3 w-3" />
                                            Your Answer
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Explanation section */}
                              <div className="mt-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleQuestionExplanation(
                                      question._id,
                                      question.text,
                                      question.userAnswer,
                                      question.correctAnswer,
                                      question.options
                                    );
                                  }}
                                  disabled={loadingExplanations[question._id]}
                                  className={`flex items-center text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}
                                >
                                  {loadingExplanations[question._id] ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                      Generating...
                                    </>
                                  ) : expandedExplanations[question._id] ? (
                                    <>
                                      Hide Explanation
                                      <ChevronUp className="h-4 w-4 ml-1" />
                                    </>
                                  ) : (
                                    <>
                                      Show Explanation
                                      <ChevronDown className="h-4 w-4 ml-1" />
                                    </>
                                  )}
                                </button>

                                {expandedExplanations[question._id] && (
                                  <div className={`mt-3 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} border ${borderColor}`}>
                                    <p className="font-medium mb-2 flex items-center gap-2">
                                      <Trophy className="h-4 w-4 text-yellow-500" />
                                      Explanation:
                                    </p>
                                    <p className="text-sm">
                                      {detailedExplanations[question._id] || question.explanation || 'No explanation available.'}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}