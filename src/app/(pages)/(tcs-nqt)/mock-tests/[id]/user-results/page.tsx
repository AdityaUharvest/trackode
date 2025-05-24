'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeContext';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';
import {
  ChevronDown, ChevronUp, AlertCircle, Loader2, Trophy,
  CheckCircle2, XCircle, Sparkles, Lightbulb, BarChart3,
  BookOpen, Brain, Calendar, Clock, ArrowRight, GraduationCap,
  Award, Medal
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import toast, { Toaster } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  rank: number;
  sections: SectionResult[];
  overallFeedback?: string | null;
  sectionFeedbacks?: Array<{
    sectionName: string;
    feedback: string;
    generatedAt?: Date;
  }>;
  questionFeedbacks?: Array<{
    questionId: string;
    explanation: string;
    generatedAt?: Date;
  }>;
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
  sectionStats: Record<string, { answered: number; correct: number; totalQuestions: number; accuracy?: number }>;
  rank?: number;
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
    sections: {} as Record<string, boolean>,
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [topPerformers, setTopPerformers] = useState<UserAttempt[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const sectionHeaderBg = theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-50';
  const correctOptionBg = theme === 'dark' ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-500';
  const wrongOptionBg = theme === 'dark' ? 'bg-red-900/30 border-red-600' : 'bg-red-50 border-red-500';
  const neutralOptionBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const feedbackBg = theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200';
  const highlightBg = theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-50';
  const rankBadgeBg = theme === 'dark' ? 'bg-yellow-900/30 border-yellow-600' : 'bg-yellow-50 border-yellow-500';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user's own result
        const userResponse = await fetch(`/api/mock-tests/${quizId}/user-result`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user results');
        }
        const userData = await userResponse.json();
        setResult(userData);
        console.log('User Data:', userData);
        // Expand all sections by default
        const defaultExpanded = userData.sections.reduce(
          (acc: Record<string, boolean>, section: SectionResult) => {
            acc[section.sectionName] = true;
            return acc;
          },
          {}
        );
        setExpandedSections(defaultExpanded);

        // Set existing feedback if available
        if (userData.overallFeedback) {
          setOverallFeedback(userData.overallFeedback);
        }
        if (userData.sectionFeedbacks) {
          const feedbackMap: Record<string, string> = {};
          userData.sectionFeedbacks.forEach((feedback: { sectionName: string; feedback: string }) => {
            feedbackMap[feedback.sectionName] = feedback.feedback;
          });
          setSectionFeedback(feedbackMap);
        }

        // Show toast for certificate
        if (userData.rank) {
          toast.success(`Certificate earned! Rank ${userData.rank} added to your profile.`, {
            icon: <Award className="h-5 w-5 text-yellow-500" />,
            duration: 5000,
          });
        }

        // Fetch all attempts for leaderboard
        const attemptsResponse = await fetch(`/api/mock-tests/${userData.quizId}/results`);
        console.log('Attempts Response:', attemptsResponse);
        if (!attemptsResponse.ok) {
          throw new Error('Failed to fetch attempts');
        }
        const attemptsData = await attemptsResponse.json();

        // Sort attempts by accuracy and add ranking
        const sortedAttempts = [...attemptsData.attempts].sort((a, b) => b.accuracy - a.accuracy);
        const rankedAttempts = sortedAttempts.map((attempt, index) => ({
          ...attempt,
          rank: index + 1,
        }));

        setAttempts(rankedAttempts);
        setTopPerformers(rankedAttempts.slice(0, 3));
        
        // Trigger confetti effect
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } catch (err) {
        // auto refresh the page if error occurs
        if (err instanceof Error && err.message === 'Failed to fetch user results') {
          setTimeout(() => {
            window.location.reload();
          }
          , 10000);
          
        }
        

      } finally {
        setLoading(false);
      }
    };

    if (session && quizId) {
      fetchData();
    }
  }, [session, quizId]);
console.log('Result:', result);
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const saveQuestionFeedback = async (questionId: string, explanation: string) => {
    try {
      const response = await fetch(`/api/mock-tests/${quizId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          content: explanation,
          type: 'question',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save question feedback');
      }
    } catch (error) {
      console.error('Error saving question feedback:', error);
      toast.error('Failed to save explanation');
    }
  };

  const toggleQuestionExplanation = async (
    questionId: string,
    questionText: string,
    userAnswerIndex: number,
    correctAnswerIndex: number,
    options: string[]
  ) => {
    if (expandedExplanations[questionId]) {
      setExpandedExplanations((prev) => ({
        ...prev,
        [questionId]: !prev[questionId],
      }));
      return;
    }

    try {
      setLoadingExplanations((prev) => ({ ...prev, [questionId]: true }));

      if (result?.questionFeedbacks?.some((fb) => fb.questionId === questionId)) {
        const storedFeedback = result.questionFeedbacks.find((fb) => fb.questionId === questionId);
        setDetailedExplanations((prev) => ({
          ...prev,
          [questionId]: storedFeedback?.explanation || '',
        }));
        setExpandedExplanations((prev) => ({
          ...prev,
          [questionId]: true,
        }));
        return;
      }

      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Analyze this quiz question and provide a detailed explanation in markdown format:  
          **Question:** ${questionText}
          **User's Answer:** ${options[userAnswerIndex]} 
          ${userAnswerIndex === correctAnswerIndex ? '(Correct)' : '(Incorrect)'}
          
          **Correct Answer:** ${options[correctAnswerIndex]}
          
          Please provide:
          1. A concise explanation of why the correct answer is right (15-20 words)
          Format your response in clear paragraphs with no headings.`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate explanation');
      }

      const data = await response.json();
      setDetailedExplanations((prev) => ({
        ...prev,
        [questionId]: data.instructions,
      }));
      await saveQuestionFeedback(questionId, data.instructions);
      setExpandedExplanations((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    } catch (error) {
      console.error('Error generating explanation:', error);
      toast.error('Failed to generate detailed explanation');
      const question = result?.sections
        .flatMap((s) => s.questions)
        .find((q) => q._id === questionId);
      setDetailedExplanations((prev) => ({
        ...prev,
        [questionId]: question?.explanation || 'Could not generate detailed explanation.',
      }));
    } finally {
      setLoadingExplanations((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const saveOverallFeedback = async (feedback: string) => {
    try {
      const response = await fetch(`/api/mock-tests/${quizId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: feedback,
          type: 'overall',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save overall feedback');
      }
    } catch (error) {
      console.error('Error saving overall feedback:', error);
      toast.error('Failed to save feedback');
    }
  };

  const generateOverallFeedback = async () => {
    try {
      if (!result) return;

      setLoadingFeedback((prev) => ({ ...prev, overall: true }));

      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate detailed overall performance analysis for this quiz attempt, in markdown format:
        
          **Overall Score:** ${result.totalScore}/${result.totalQuestions} (${Math.round(
            (result.totalScore / result.totalQuestions) * 100
          )}%)
        
          **Section Breakdown:**
          ${result.sections
            .map(
              (section) =>
                `- ${section.sectionName
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}: ` +
                `${section.correct}/${section.total} (${Math.round((section.correct / section.total) * 100)}%)`
            )
            .join('\n')}
        
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
        
          Keep it professional yet encouraging (100-150 words).`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate overall feedback');
      }

      const data = await response.json();
      setOverallFeedback(data.instructions);
      await saveOverallFeedback(data.instructions);
    } catch (error) {
      console.error('Error generating overall feedback:', error);
      toast.error('Failed to generate overall feedback');
      setOverallFeedback('Could not generate overall feedback.');
    } finally {
      setLoadingFeedback((prev) => ({ ...prev, overall: false }));
    }
  };

  const saveSectionFeedback = async (sectionName: string, feedback: string) => {
    try {
      const response = await fetch(`/api/mock-tests/${quizId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionName,
          content: feedback,
          type: 'section',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save section feedback');
      }
    } catch (error) {
      console.error('Error saving section feedback:', error);
      toast.error(`Failed to generate feedback for ${sectionName}`);
    }
  };

  const generateSectionFeedback = async (sectionName: string) => {
    try {
      if (!result) return;

      setLoadingFeedback((prev) => ({
        ...prev,
        sections: { ...prev.sections, [sectionName]: true },
      }));

      const section = result.sections.find((s) => s.sectionName === sectionName);
      if (!section) return;

      const response = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate detailed feedback for the "${sectionName}" section of this quiz attempt:
          
          **Section Performance:** ${section.correct}/${section.total} (${Math.round(
            (section.correct / section.total) * 100
          )}%)
          
          Please provide:
          1. Key strengths in this section
          2. Main areas needing improvement
          3. Specific study recommendations for this section
          4. Estimated time needed to improve
          
          Format as concise bullet points (30-50 words total).`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate section feedback');
      }

      const data = await response.json();
      setSectionFeedback((prev) => ({
        ...prev,
        [sectionName]: data.instructions,
      }));
      await saveSectionFeedback(sectionName, data.instructions);
    } catch (error) {
      console.error('Error generating section feedback:', error);
      toast.error(`Failed to generate feedback for ${sectionName}`);
    } finally {
      setLoadingFeedback((prev) => ({
        ...prev,
        sections: { ...prev.sections, [sectionName]: false },
      }));
    }
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return { color: 'bg-green-500', label: 'Excellent' };
    if (percentage >= 70) return { color: 'bg-emerald-500', label: 'Good' };
    if (percentage >= 60) return { color: 'bg-yellow-500', label: 'Satisfactory' };
    if (percentage >= 40) return { color: 'bg-orange-500', label: 'Needs Work' };
    return { color: 'bg-red-500', label: 'Critical' };
  };

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
      3: 'bg-amber-700',
    };

    return (
      <span
        className={`${
          badgeColors[rank as keyof typeof badgeColors]
        } text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center`}
      >
        {rank}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} gap-4`}>
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-blue-500" />
            </div>
          </div>
          <div className="space-y-3 flex flex-col items-center">
            <p className={`text-sm ${textColor} font-medium`}>Loading your results...</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Analyzing your performance</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} gap-6 p-2`}>
        <div className={`p-8 rounded-lg ${cardBg} shadow-lg border ${borderColor} max-w-md`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className={`text-sm font-semibold ${textColor}`}>Error Loading Results</h2>
            <p className={`text-gray-500 dark:text-gray-400`}>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} gap-6 p-2`}>
        <div className={`p-8 rounded-lg ${cardBg} shadow-lg border ${borderColor} max-w-md`}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <AlertCircle className="h-12 w-12 text-yellow-500" />
            </div>
            <h2 className={`text-sm font-semibold ${textColor}`}>No Results Found</h2>
            <p className={`text-gray-500 dark:text-gray-400`}>You haven't attempted this quiz yet.</p>
            <Button asChild className="mt-4">
              <a href={`/playy/${quizId}`}>Take the Quiz</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const overallPercentage = Math.round((result.totalScore / result.totalQuestions) * 100);
  const performanceBadge = getScoreBadge(overallPercentage);

  // For the circular progress indicator
  const circumference = 2 * Math.PI * 40; // r = 40
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  // Format rank with ordinal suffix
  const getOrdinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className={`min-h-screen p-2 md:p-6 ${bgColor}`}>
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
                    backgroundColor: [
                      '#f44336',
                      '#e91e63',
                      '#9c27b0',
                      '#673ab7',
                      '#3f51b5',
                      '#2196f3',
                      '#03a9f4',
                      '#00bcd4',
                      '#009688',
                      '#4CAF50',
                      '#8BC34A',
                      '#CDDC39',
                      '#FFEB3B',
                      '#FFC107',
                      '#FF9800',
                      '#FF5722',
                    ][Math.floor(Math.random() * 16)],
                    animationDelay: `${animationDelay}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Top Summary Card */}
        <Card className={`mb-6 overflow-hidden border shadow-md ${bgColor}`}>
          <div className={`h-2 w-full ${performanceBadge.color}`}></div>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-sm md:text-sm">{result.quizTitle}</CardTitle>
              <CardDescription className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(result.completedAt).toLocaleDateString()}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(result.completedAt).toLocaleTimeString()}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {result.userName}
                </span>
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <Badge className={`px-3 py-1 text-white ${performanceBadge.color}`}>
                {performanceBadge.label}
              </Badge>
              {result.rank > 0 && (
                <Badge className={`px-3 py-1 text-yellow-800 dark:text-yellow-200 ${rankBadgeBg}`}>
                  <Trophy className="h-4 w-4 mr-1" />
                  Rank: {getOrdinalSuffix(result.rank)}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 gap-2 mb-6">
                <TabsTrigger
                  value="overview"
                  className={`flex items-center gap-2 bg-blue-400 text-white hover:bg-blue-500 ${
                    activeTab === 'overview' ? 'bg-blue-900 text-white' : ''
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  <span className="hidden md:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sections"
                  className="flex bg-blue-400 text-white hover:bg-blue-500 items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden md:inline">Sections</span>
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className="flex bg-blue-400 text-white hover:bg-blue-500 items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden md:inline">Questions</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Leaderboard Podium */}
                

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Score Circle */}
                  <div
                    className={`flex flex-col items-center justify-center p-6 rounded-lg ${cardBg} border ${borderColor} relative`}
                  >
                    <div className="relative flex items-center justify-center">
                      <svg width="120" height="120" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          strokeWidth="8"
                          className="stroke-gray-200 dark:stroke-gray-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          transform="rotate(-90 50 50)"
                          className={`${
                            overallPercentage >= 80
                              ? 'stroke-green-500'
                              : overallPercentage >= 70
                              ? 'stroke-emerald-500'
                              : overallPercentage >= 60
                              ? 'stroke-yellow-500'
                              : overallPercentage >= 50
                              ? 'stroke-orange-500'
                              : 'stroke-red-500'
                          } transition-all duration-1000 ease-in-out`}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-sm font-bold">{overallPercentage}%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Overall Score</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>
                        {result.totalScore} correct out of {result.totalQuestions}
                      </span>
                    </div>
                    {result.rank > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                        <Award className="h-4 w-4" />
                        <span>Certificate Earned: Rank {getOrdinalSuffix(result.rank)}</span>
                      </div>
                    )}
                  </div>

                  {/* Section Performance */}
                  <div
                    className={`p-6 rounded-lg ${cardBg} border ${borderColor} col-span-1 md:col-span-2`}
                  >
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <BarChart3 className="h-2 w-2 text-blue-500" />
                      Section Performance
                    </h3>
                    <div className="space-y-2">
                      {result.sections.map((section) => {
                        const sectionPercentage = Math.round((section.correct / section.total) * 100);
                        const sectionBadge = getScoreBadge(sectionPercentage);

                        if (section.total === 0) return null;

                        return (
                          <div key={section.sectionName} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">
                                  {section.sectionName
                                    .split('-')
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ')}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  Attempted: {section.questions.length}/{section.total}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Correct: {section.correct}/{section.questions.length}
                                </Badge>
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  sectionPercentage >= 70
                                    ? 'text-green-500'
                                    : sectionPercentage >= 60
                                    ? 'text-yellow-500'
                                    : sectionPercentage >= 50
                                    ? 'text-orange-500'
                                    : 'text-red-500'
                                }`}
                              >
                                {sectionPercentage}%
                              </span>
                            </div>
                            <Progress
                              value={sectionPercentage}
                              className="h-2"
                              style={{
                                backgroundColor: theme === 'dark' ? 'rgb(63 63 70)' : 'rgb(228 228 231)',
                              }}
                              color={sectionBadge.color}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('sections')}
                        className="w-full"
                        size="sm"
                      >
                        View Detailed Section Analysis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <Card className={`${highlightBg} border ${borderColor}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-2 w-2 text-indigo-500" />
                      AI Performance Analysis
                    </CardTitle>
                    <CardDescription>
                      Get personalized feedback on your overall performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overallFeedback ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <Markdown>{overallFeedback}</Markdown>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Generate an AI-powered analysis of your performance with personalized recommendations
                        </p>
                        <Button
                          onClick={generateOverallFeedback}
                          disabled={loadingFeedback.overall}
                          className="w-full md:w-auto"
                        >
                          {loadingFeedback.overall ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Analysis
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sections Tab */}
              <TabsContent value="sections" className="space-y-6">
                {result.sections.map((section) => {
                  const sectionPercentage = Math.round((section.correct / section.total) * 100);
                  const sectionBadge = getScoreBadge(sectionPercentage);

                  if (section.total === 0) return null;

                  return (
                    <Card key={section.sectionName} className="overflow-hidden">
                      <div className={`h-1 w-full ${sectionBadge.color}`}></div>
                      <CardHeader
                        className={`flex flex-row items-center justify-between cursor-pointer ${sectionHeaderBg} hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors`}
                        onClick={() => toggleSection(section.sectionName)}
                      >
                        <div>
                          <CardTitle className="text-sm flex items-center gap-2">
                            {section.sectionName
                              .split('-')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                            <Badge
                              variant={
                                sectionPercentage >= 70
                                  ? 'secondary'
                                  : sectionPercentage >= 40
                                  ? 'outline'
                                  : 'destructive'
                              }
                            >
                              {section.correct}/{section.total} ({sectionPercentage}%)
                            </Badge>
                          </CardTitle>
                        </div>
                        <button
                          className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(section.sectionName);
                          }}
                        >
                          {expandedSections[section.sectionName] ? (
                            <ChevronUp className="h-2 w-2" />
                          ) : (
                            <ChevronDown className="h-2 w-2" />
                          )}
                        </button>
                      </CardHeader>

                      {expandedSections[section.sectionName] && (
                        <CardContent className={`p-4 ${bgColor} space-y-6`}>
                          {/* Questions summary for this section */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-indigo-500" />
                              Questions Summary
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {section.questions.map((question, idx) => {
                                const isCorrect = question.userAnswer === question.correctAnswer;
                                return (
                                  <Card
                                    key={question._id}
                                    className={`border cursor-pointer transition-all ${
                                      isCorrect
                                        ? 'border-green-500 dark:border-green-700'
                                        : 'border-red-500 dark:border-red-700'
                                    } hover:shadow-md`}
                                    onClick={() => {
                                      toggleQuestion(question._id);
                                      setActiveTab('questions');
                                    }}
                                  >
                                    <CardContent className="p-3 flex flex-col items-center text-center">
                                      <div
                                        className={`w-4 h-4 rounded-full flex items-center justify-center mb-1 ${
                                          isCorrect
                                            ? 'bg-green-100 dark:bg-green-900/30'
                                            : 'bg-red-100 dark:bg-red-900/30'
                                        }`}
                                      >
                                        {isCorrect ? (
                                          <CheckCircle2 className="h-2 w-2 text-green-500" />
                                        ) : (
                                          <XCircle className="h-2 w-2 text-red-500" />
                                        )}
                                      </div>
                                      <span className="text-xs font-medium">Question {idx + 1}</span>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>

                          {/* Section Feedback */}
                          <Card className={`${feedbackBg} border-none`}>
                            <CardHeader className="pb-2">
                              <div className="">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4 text-blue-500" />
                                  Section Feedback
                                </CardTitle>
                                {sectionFeedback[section.sectionName] ? (
                                  <Markdown>{sectionFeedback[section.sectionName]}</Markdown>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => generateSectionFeedback(section.sectionName)}
                                    disabled={loadingFeedback.sections[section.sectionName]}
                                    className="h-8"
                                  >
                                    {loadingFeedback.sections[section.sectionName] ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                      </>
                                    ) : sectionFeedback[section.sectionName] ? (
                                      <>
                                        Refresh
                                        <Sparkles className="h-4 w-4 ml-1" />
                                      </>
                                    ) : (
                                      <>
                                        Generate
                                        <Sparkles className="h-4 w-4 ml-1" />
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </CardHeader>
                          </Card>

                          <Button
                            variant="outline"
                            onClick={() => setActiveTab('questions')}
                            className="w-full bg-blue-400 text-white hover:bg-blue-500 hover:text-white"
                            size="sm"
                          >
                            View All Questions
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </TabsContent>

              {/* Questions Tab */}
              <TabsContent value="questions" className="space-y-4">
                {result.sections.map((section) => {
                  if (section.total === 0) return null;

                  return (
                    <div key={section.sectionName} className="space-y-4">
                      <h3 className="font-medium text-sm flex items-center gap-2">
                        <BookOpen className="h-2 w-2 text-indigo-500" />
                        {section.sectionName
                          .split('-')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                        <Badge variant="outline">
                          {section.correct}/{section.total}
                        </Badge>
                      </h3>

                      <div className="space-y-4">
                        {section.questions.map((question, index) => (
                          <Card
                            key={question._id}
                            className={`border text-xm ${
                              question.userAnswer === question.correctAnswer
                                ? 'border-green-500 dark:border-green-700'
                                : 'border-red-500 dark:border-red-700'
                            }`}
                          >
                            <CardHeader
                              className="cursor-pointer flex flex-row items-start justify-between"
                              onClick={() => toggleQuestion(question._id)}
                            >
                              <div className="flex gap-3">
                                <div
                                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    question.userAnswer === question.correctAnswer
                                      ? 'bg-green-100 dark:bg-green-900/30'
                                      : 'bg-red-100 dark:bg-red-900/30'
                                  }`}
                                >
                                  {question.userAnswer === question.correctAnswer ? (
                                    <CheckCircle2 className="h-2 w-2 text-green-500" />
                                  ) : (
                                    <XCircle className="h-2 w-2 text-red-500" />
                                  )}
                                </div>
                                <div>
                                  <CardTitle className="text-sm font-medium">
                                    Question {index + 1}
                                  </CardTitle>
                                  <CardDescription className="line-clamp-1">
                                    {question.text}
                                  </CardDescription>
                                </div>
                              </div>
                              <button
                                className="mt-1 p-1 rounded-full hover:bg-gray-200 bg-green-500 dark:hover:bg-gray-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleQuestion(question._id);
                                }}
                              >
                                {expandedQuestions[question._id] ? (
                                  <ChevronUp className="h-2 w-2" />
                                ) : (
                                  <ChevronDown className="h-2 w-2" />
                                )}
                              </button>
                            </CardHeader>

                            {expandedQuestions[question._id] && (
                              <CardContent className="space-y-4 pt-0">
                                <Separator />

                                {/* Options list */}
                                <div className="space-y-2 mt-2">
                                  {question.options.map((option, index) => {
                                    const isCorrect = index === question.correctAnswer;
                                    const isUserSelection = index === question.userAnswer;

                                    let optionClass = neutralOptionBg;
                                    let iconComponent = null;

                                    if (isCorrect) {
                                      optionClass = correctOptionBg;
                                      iconComponent = (
                                        <CheckCircle2 className="h-2 w-2 text-green-500 flex-shrink-0" />
                                      );
                                    } else if (isUserSelection) {
                                      optionClass = wrongOptionBg;
                                      iconComponent = (
                                        <XCircle className="h-2 w-2 text-red-500 flex-shrink-0" />
                                      );
                                    }

                                    return (
                                      <div
                                        key={index}
                                        className={`p-3 text-xs rounded-lg border ${optionClass}`}
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex items-start">
                                            <span className="mr-2 font-medium">
                                              {String.fromCharCode(65 + index)}.
                                            </span>
                                            <p>{option}</p>
                                          </div>
                                          {iconComponent}
                                        </div>
                                        {isCorrect && (
                                          <p className="text-xs mt-1 text-green-600 dark:text-green-400 flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Correct Answer
                                          </p>
                                        )}
                                        {isUserSelection && !isCorrect && (
                                          <p className="text-xs mt-1 text-red-600 dark:text-red-400 flex items-center gap-1">
                                            <XCircle className="h-3 w-3" />
                                            Your Answer
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Explanation section */}
                                <Card className={`${feedbackBg} border-none`}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-blue-500" />
                                        Explanation
                                      </CardTitle>
                                      <Button
                                        size="sm"
                                        variant="ghost"
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
                                        className="h-8"
                                      >
                                        {loadingExplanations[question._id] ? (
                                          <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                          </>
                                        ) : expandedExplanations[question._id] ? (
                                          <>
                                            Hide
                                            <ChevronUp className="h-4 w-4 ml-1" />
                                          </>
                                        ) : (
                                          <>
                                            Explain
                                            <ChevronDown className="h-4 w-4 ml-1" />
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </CardHeader>

                                  {expandedExplanations[question._id] && (
                                    <CardContent>
                                      <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p>
                                          {detailedExplanations[question._id] ||
                                            question.explanation ||
                                            'No explanation available.'}
                                        </p>
                                      </div>
                                    </CardContent>
                                  )}
                                </Card>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            </Tabs>
            <div className="mt-6">
  {topPerformers.length > 0 && (
    <div className="relative flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Leaderboard</h3>
      {/* Top 3 Podium */}
      <div className="flex items-end justify-center w-full mb-10 space-x-3 md:space-x-6">
        {/* 2nd Place */}
        {topPerformers.length >= 2 && (
          <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-xl w-28 md:w-32 p-5 flex flex-col items-center h-32 shadow-lg">
              <div className="text-2xl font-extrabold text-gray-700">2</div>
              <div className="text-sm md:text-base text-center font-semibold text-gray-700 line-clamp-2">
                {topPerformers[1].userName}
              </div>
              <div className="text-sm md:text-base font-bold text-gray-700 mt-2">
                {topPerformers[1].accuracy}%
              </div>
            </div>
            <div className="bg-gradient-to-b from-gray-400 to-gray-500 h-20 w-28 md:w-32 flex items-center justify-center rounded-b-xl shadow-md">
              <div className="text-3xl animate-pulse">🥈</div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {topPerformers.length >= 1 && (
          <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105 relative">
            <div className="bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-t-xl w-32 md:w-40 p-6 flex flex-col items-center h-40 shadow-xl border-2 border-yellow-400">
              <div className="text-3xl font-extrabold text-yellow-800">1</div>
              <div className="text-base md:text-lg text-center font-bold text-yellow-900 line-clamp-2">
                {topPerformers[0].userName}
              </div>
              <div className="text-base md:text-lg font-bold text-yellow-800 mt-3">
                {topPerformers[0].accuracy}%
              </div>
            </div>
            <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 h-24 w-32 md:w-40 flex items-center justify-center rounded-b-xl shadow-lg relative">
              <div className="text-4xl animate-bounce">
                <Trophy className="h-12 w-12 text-yellow-700 drop-shadow-md" />
              </div>
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <div className="sparkle animate-sparkle"></div>
                <div className="sparkle animate-sparkle delay-200"></div>
                <div className="sparkle animate-sparkle delay-400"></div>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topPerformers.length >= 3 && (
          <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-b from-orange-200 to-orange-300 rounded-t-xl w-28 md:w-32 p-5 flex flex-col items-center h-32 shadow-lg">
              <div className="text-2xl font-extrabold text-orange-700">3</div>
              <div className="text-sm md:text-base text-center font-semibold text-orange-800 line-clamp-2">
                {topPerformers[2].userName}
              </div>
              <div className="text-sm md:text-base font-bold text-orange-700 mt-2">
                {topPerformers[2].accuracy}%
              </div>
            </div>
            <div className="bg-gradient-to-b from-orange-400 to-orange-500 h-16 w-28 md:w-32 flex items-center justify-center rounded-b-xl shadow-md">
              <div className="text-3xl animate-pulse">🥉</div>
            </div>
          </div>
        )}
      </div>

      {/* Other rankings */}
      {topPerformers.length > 3 && (
        <div className="w-full max-w-2xl mt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Other Top Performers
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {topPerformers.slice(3).map((performer, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-300 font-bold mr-4">
                    {index + 4}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {performer.userName}
                  </span>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 py-1 px-3 rounded-full text-sm font-semibold">
                  {performer.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )}

  {/* Add CSS for enhanced styling and animations */}
  
</div>
            
          </CardContent>
        </Card>

        {/* Actions Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50/90 to-transparent dark:from-gray-950/90 pt-12">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Button variant="secondary" onClick={() => window.history.back()} size="sm">
              Back to Tests
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="hidden md:flex"
              >
                Print Results
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setActiveTab('overview');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden md:flex"
              >
                Return to Summary
              </Button>
              
              <Button size="sm" asChild>
                <a href={`/mocks`}>Explore Mocks</a>
              </Button>
              <Button size="sm" asChild>
                <a href={`/programming-quizzes`}>More Quizzes</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />

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