'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeContext';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Printer } from 'lucide-react';

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
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const sectionHeaderBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const correctOptionBg = theme === 'dark' ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-500';
  const wrongOptionBg = theme === 'dark' ? 'bg-red-900/30 border-red-600' : 'bg-red-50 border-red-500';
  const neutralOptionBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/mock-tests/${quizId}/user-result`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        console.log(data);
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
      <div className={`flex items-center justify-center h-screen ${bgColor}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${bgColor}`}>
        <div className={`p-6 rounded-lg ${cardBg} ${borderColor} max-w-md text-center`}>
          <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Error Loading Results</h2>
          <p className={`mb-4 ${textColor}`}>{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`flex items-center justify-center h-screen ${bgColor}`}>
        <div className={`p-6 rounded-lg ${cardBg} ${borderColor} max-w-md text-center`}>
          <h2 className={`text-xl font-bold mb-4 ${textColor}`}>No Results Found</h2>
          <p className={`mb-4 ${textColor}`}>You haven't attempted this quiz yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${bgColor}`}>
      <div className={`max-w-6xl mx-auto rounded-lg shadow-md p-6 ${cardBg} ${borderColor}`}>
        {/* Header with user info and overall score */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="sm:text-sm lg:text-lg font-bold mb-2">{result.quizTitle} - Results</h1>
            <p className="text-lg">User: {result.userName}</p>
            <p className="text-sm text-gray-500">
              Completed: {new Date(result.completedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between gap-4">
            <div className="text-right">
              <p className="text-lg font-bold">
                Score: {result.totalScore}/{result.totalQuestions}
              </p>
              <p className="text-lg">
                ({Math.round((result.totalScore / result.totalQuestions) * 100)}%)
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Results
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {result.sections.map((section) => (
            <div key={section.sectionName} className={`rounded-lg border ${borderColor} overflow-hidden`}>
              {/* Section header */}
              <div 
                className={`flex justify-between items-center p-4 cursor-pointer ${sectionHeaderBg}`}
                onClick={() => toggleSection(section.sectionName)}
              >
                <div className="flex items-center gap-4">
                  <h2 className="font-bold text-lg">
                    {section.sectionName.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h2>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    section.correct / section.total >= 0.7
                      ? 'bg-green-100 text-green-800'
                      : section.correct / section.total >= 0.4
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {section.correct}/{section.total} (
                    {Math.round((section.correct / section.total) * 100)}%)
                  </span>
                </div>
                <button 
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
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
                <div className="p-4 space-y-6">
                  {section.questions.map((question) => (
                    <div 
                      key={question._id} 
                      className={`p-4 rounded-lg ${cardBg} ${borderColor}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-medium">{question.text}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                          question.userAnswer === question.correctAnswer
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {question.userAnswer === question.correctAnswer ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 my-4">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded border ${
                              index === question.correctAnswer
                                ? correctOptionBg
                                : index === question.userAnswer && index !== question.correctAnswer
                                ? wrongOptionBg
                                : `${neutralOptionBg} ${borderColor}`
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-2 font-medium">{String.fromCharCode(65 + index)}.</span>
                              <span>{option}</span>
                              {index === question.correctAnswer && (
                                <span className="ml-2 text-green-600 dark:text-green-400 text-sm">(Correct Answer)</span>
                              )}
                              {index === question.userAnswer && index !== question.correctAnswer && (
                                <span className="ml-2 text-red-600 dark:text-red-400 text-sm">(Your Answer)</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div>
                        <button
                          onClick={() => toggleQuestionExplanation(question._id)}
                          className={`flex items-center text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                          {expandedQuestions[question._id] ? 'Hide Explanation' : 'Show Explanation'}
                          {expandedQuestions[question._id] ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </button>

                        {expandedQuestions[question._id] && (
                          <div className={`mt-3 p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className="font-medium mb-1">Explanation:</p>
                            <p>{question.explanation || 'No explanation provided.'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}