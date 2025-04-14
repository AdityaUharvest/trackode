'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeContext';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Printer, AlertCircle, Loader2, Trophy, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';

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
  const [sectionFeedback, setSectionFeedback] = useState<Record<string, string>>({});
  const [overallFeedback, setOverallFeedback] = useState<string>('');
  const [loadingFeedback, setLoadingFeedback] = useState({
    overall: false,
    sections: {} as Record<string, boolean>
  });

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const sectionHeaderBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const correctOptionBg = theme === 'dark' ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-500';
  const wrongOptionBg = theme === 'dark' ? 'bg-red-900/30 border-red-600' : 'bg-red-50 border-red-500';
  const neutralOptionBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const feedbackBg = theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200';

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
      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Analyze this quiz question and provide a detailed explanation:
          
          **Question:** ${questionText}
          
          **Options:**
          ${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}
          
          **User's Answer:** ${options[userAnswerIndex]} 
          ${userAnswerIndex === correctAnswerIndex ? '(Correct)' : '(Incorrect)'}
          
          **Correct Answer:** ${options[correctAnswerIndex]}
          
          Please provide:
          1. A concise explanation of why the correct answer is right (50-100 words)
          2. Analysis of why the user's answer was ${userAnswerIndex === correctAnswerIndex ? 'correct' : 'incorrect'}
          3. Key concepts tested by this question
          4. Tips for remembering this concept
          
          Format your response in clear paragraphs with no headings.`
        })
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
      toast.error('Failed to generate detailed explanation');
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

  const generateSectionFeedback = async (sectionName: string, correct: number, total: number) => {
    try {
      setLoadingFeedback(prev => ({
        ...prev,
        sections: { ...prev.sections, [sectionName]: true }
      }));

      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Analyze this quiz section performance and provide personalized feedback:
        
          **Section Name:** ${sectionName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          
          **Performance:** ${correct} out of ${total} correct (${Math.round((correct / total) * 100)}%)
          
          Please provide:
          1. A brief assessment of this performance level (beginner/intermediate/advanced)
          2. 2-3 key strengths demonstrated in this section
          3. 2-3 areas needing improvement
          4. Specific study recommendations for these weak areas
          5. Encouragement and motivation tips
          
          Format your response in clear paragraphs with no headings. Keep it concise (150-200 words) and focused on actionable advice.`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate section feedback');
      }

      const data = await response.json();
      setSectionFeedback(prev => ({
        ...prev,
        [sectionName]: data.instructions
      }));
    } catch (error) {
      console.error('Error generating section feedback:', error);
      toast.error('Failed to generate section feedback');
      setSectionFeedback(prev => ({
        ...prev,
        [sectionName]: 'Could not generate feedback for this section.'
      }));
    } finally {
      setLoadingFeedback(prev => ({
        ...prev,
        sections: { ...prev.sections, [sectionName]: false }
      }));
    }
  };

  const generateOverallFeedback = async () => {
    try {
      if (!result) return;
      
      setLoadingFeedback(prev => ({ ...prev, overall: true }));

      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate detailed overall performance analysis for this quiz attempt:
        
          **Overall Score:** ${result.totalScore}/${result.totalQuestions} (${Math.round((result.totalScore / result.totalQuestions) * 100)}%)
        
          **Section Breakdown:**
          ${
            result.sections.map(section => (
            `- ${section.sectionName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: ` +
            `${section.correct}/${section.total} (${Math.round((section.correct / section.total) * 100)}%)`
          )).join('\n')}
        
          Please provide:
          1. Overall performance assessment (beginner/intermediate/advanced)
          2. 3 key strengths across all sections
          3. 3 main areas needing improvement
          4. Personalized study plan recommendations
          5. Motivational closing statement
        
          Structure your response with:
          - Brief introduction summarizing performance
          - Clear bullet points for strengths/weaknesses
          - Specific action items for improvement
          - Positive encouragement
        
          Keep it professional yet encouraging (200-250 words).`
        })
          });

      if (!response.ok) {
        throw new Error('Failed to generate overall feedback');
      }

      const data = await response.json();
      setOverallFeedback(data.instructions);
    } catch (error) {
      console.error('Error generating overall feedback:', error);
      toast.error('Failed to generate overall feedback');
      setOverallFeedback('Could not generate overall feedback.');
    } finally {
      setLoadingFeedback(prev => ({ ...prev, overall: false }));
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
              <p className={`text-sm font-semibold ${performanceColor}`}>{overallPercentage}%</p>
            </div>
          </div>

          {/* Overall Feedback */}
          <div className={`mt-4 p-4 rounded-lg ${feedbackBg} border ${borderColor}`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                AI-Powered Performance Analysis
              </h4>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={generateOverallFeedback}
                disabled={loadingFeedback.overall}
              >
                {loadingFeedback.overall ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : overallFeedback ? (
                  'Regenerate'
                ) : (
                  'Get Feedback'
                )}
              </Button>
            </div>
            {overallFeedback ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{overallFeedback}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click "Get Feedback" to receive personalized performance analysis.
              </p>
            )}
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
                    {/* Section Feedback */}
                    <div className={`p-4 rounded-lg ${feedbackBg} border ${borderColor}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          Section Analysis
                        </h4>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => generateSectionFeedback(section.sectionName, section.correct, section.total)}
                          disabled={loadingFeedback.sections[section.sectionName]}
                        >
                          {loadingFeedback.sections[section.sectionName] ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : sectionFeedback[section.sectionName] ? (
                            'Regenerate'
                          ) : (
                            'Analyze'
                          )}
                        </Button>
                      </div>
                      
                      {sectionFeedback[section.sectionName] ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p>{sectionFeedback[section.sectionName]}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Click "Analyze" to get personalized feedback for this section.
                        </p>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance</span>
                        <span className={`font-medium ${sectionPerformanceColor}`}>
                          {sectionPercentage}%
                        </span>
                      </div>
                      <Progress 
                        value={sectionPercentage} 
                        className="h-2"
                        
                      />
                    </div>

                    {/* Questions list */}
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
                                  <div className={`mt-3 p-3 rounded-lg ${feedbackBg} border ${borderColor}`}>
                                    <p className="font-medium mb-2 flex items-center gap-2">
                                      <Sparkles className="h-4 w-4 text-blue-500" />
                                      AI Explanation:
                                    </p>
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                      <p>{detailedExplanations[question._id] || question.explanation || 'No explanation available.'}</p>
                                    </div>
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