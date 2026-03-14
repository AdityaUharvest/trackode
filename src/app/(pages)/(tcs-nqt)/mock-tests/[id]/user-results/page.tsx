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
  status?: 'completed' | 'in-progress' | 'left';
  totalAnswered: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  sectionStats: Record<string, { answered: number; correct: number; totalQuestions: number; accuracy?: number }>;
  rank?: number;
}

type FocusedQuestionState = {
  sectionName: string;
  sectionLabel: string;
  question: QuestionResult;
  index: number;
};

export default function UserQuizResult() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const { id: quizId } = useParams();
  const [result, setResult] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const [leaderboardFinalized, setLeaderboardFinalized] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeQuestionSection, setActiveQuestionSection] = useState('');
  const [focusedQuestion, setFocusedQuestion] = useState<FocusedQuestionState | null>(null);

  // Theme-based styles
  const bgColor = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const sectionHeaderBg = theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-50';
  const correctOptionBg = theme === 'dark' ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-500';
  const wrongOptionBg = theme === 'dark' ? 'bg-red-900/30 border-red-600' : 'bg-red-50 border-red-500';
  const neutralOptionBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const feedbackBg = theme === 'dark' ? 'bg-indigo-900/20 border-indigo-700' : 'bg-indigo-50 border-indigo-200';
  const highlightBg = theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-50';
  const rankBadgeBg = theme === 'dark' ? 'bg-yellow-900/30 border-yellow-600' : 'bg-yellow-50 border-yellow-500';
  const panelBg = theme === 'dark' ? 'bg-gray-900/80' : 'bg-white';
  const mutedText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

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

        const firstSectionWithQuestions = (userData.sections || []).find(
          (section: SectionResult) => section.total > 0
        );
        if (firstSectionWithQuestions) {
          setActiveQuestionSection(firstSectionWithQuestions.sectionName);
        }

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

        // Keep API-provided order. API switches to score-desc once all attempts are closed.
        const attemptList: UserAttempt[] = Array.isArray(attemptsData?.attempts)
          ? (attemptsData.attempts as UserAttempt[])
          : [];
        const isFinalized = Boolean(attemptsData?.leaderboardFinalized);
        setLeaderboardFinalized(isFinalized);

        const rankedAttempts = attemptList.map((attempt, index) => ({
          ...attempt,
          rank: index + 1,
        }));

        setAttempts(rankedAttempts);
        setTopPerformers(isFinalized ? rankedAttempts : rankedAttempts.slice(0, 3));
        
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

  const getSectionLabel = (sectionName: string) =>
    sectionName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

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
            <Loader2 className="h-16 w-16 animate-spin text-indigo-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-indigo-500" />
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
              
              <a href="/mocks">Explore Mocks</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const overallPercentage = Math.round((result.totalScore / result.totalQuestions) * 100);
  const performanceBadge = getScoreBadge(overallPercentage);
  const availableQuestionSections = result.sections.filter((section) => section.total > 0);
  const selectedQuestionSection =
    availableQuestionSections.find((section) => section.sectionName === activeQuestionSection) ||
    availableQuestionSections[0] ||
    null;

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
    <div className={`min-h-screen p-3 pb-36 md:p-6 md:pb-28 ${bgColor}`}>
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

      <div className="mx-auto max-w-7xl space-y-6">
        {topPerformers.length > 0 && (
          <Card className="overflow-hidden border border-indigo-100 shadow-sm dark:border-indigo-900/40 dark:bg-gray-900">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500" />
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">Leaderboard Standings</CardTitle>
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    leaderboardFinalized
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                  }`}
                >
                  {leaderboardFinalized ? 'Final Ranking' : 'Live Ranking'}
                </span>
              </div>
              <CardDescription>
                {leaderboardFinalized
                  ? 'All attempts are closed. Ranking is finalized by score.'
                  : 'Leaderboard is live and may change until all attempts are closed.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {topPerformers[0] && (
                  <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-100 p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-yellow-800">Rank #1</span>
                      <Trophy className="h-5 w-5 text-yellow-700" />
                    </div>
                    <p className="line-clamp-1 text-base font-bold text-gray-900 dark:text-gray-900">{topPerformers[0].userName}</p>
                    <p className="mt-1 text-sm font-medium text-yellow-900">{topPerformers[0].accuracy}% accuracy</p>
                    <p className="mt-1 text-xs text-yellow-800/90">Score {topPerformers[0].totalCorrect}/{topPerformers[0].totalQuestions}</p>
                  </div>
                )}
                {topPerformers[1] && (
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Medal className="h-4 w-4" /> Rank #2
                    </div>
                    <p className="line-clamp-1 text-base font-semibold text-gray-900">{topPerformers[1].userName}</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{topPerformers[1].accuracy}% accuracy</p>
                    <p className="mt-1 text-xs text-slate-600">Score {topPerformers[1].totalCorrect}/{topPerformers[1].totalQuestions}</p>
                  </div>
                )}
                {topPerformers[2] && (
                  <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-700">
                      <Medal className="h-4 w-4" /> Rank #3
                    </div>
                    <p className="line-clamp-1 text-base font-semibold text-gray-900">{topPerformers[2].userName}</p>
                    <p className="mt-1 text-sm font-medium text-orange-700">{topPerformers[2].accuracy}% accuracy</p>
                    <p className="mt-1 text-xs text-orange-700/80">Score {topPerformers[2].totalCorrect}/{topPerformers[2].totalQuestions}</p>
                  </div>
                )}
              </div>

              {attempts.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="max-h-[380px] overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        <tr>
                          <th className="p-3 text-left font-semibold">Rank</th>
                          <th className="p-3 text-left font-semibold">Player Name</th>
                          <th className="p-3 text-left font-semibold">Score</th>
                          <th className="p-3 text-left font-semibold">Answered</th>
                          <th className="p-3 text-left font-semibold">Accuracy</th>
                          <th className="p-3 text-left font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {attempts.map((attempt: UserAttempt, index: number) => {
                          const rank = attempt.rank || index + 1;
                          const medalIcon = renderMedal(rank);

                          return (
                            <tr
                              key={attempt._id}
                              className="bg-white odd:bg-gray-50/50 hover:bg-indigo-50/40 dark:bg-gray-900 dark:odd:bg-gray-800/60 dark:hover:bg-gray-800"
                            >
                              <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">
                                <div className="flex items-center gap-2">
                                  {medalIcon ? medalIcon : <span className="text-xs font-bold text-gray-500">#{rank}</span>}
                                  {!medalIcon && renderRankBadge(rank)}
                                  {medalIcon && <span className="text-xs font-bold text-gray-600 dark:text-gray-300">#{rank}</span>}
                                </div>
                              </td>
                              <td className="p-3 font-medium text-gray-800 dark:text-gray-100">{attempt.userName || 'Unknown'}</td>
                              <td className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                                {attempt.totalCorrect ?? 0}/{attempt.totalQuestions ?? 0}
                              </td>
                              <td className="p-3 text-gray-700 dark:text-gray-200">
                                {attempt.totalAnswered ?? 0}/{attempt.totalQuestions ?? 0}
                              </td>
                              <td className="p-3">
                                <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                                  <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${attempt.accuracy ?? 0}%` }} />
                                </div>
                                <div className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">{attempt.accuracy ?? 0}%</div>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                                    attempt.status === 'left'
                                      ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                                      : attempt.status === 'in-progress'
                                      ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                                      : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                  }`}
                                >
                                  {attempt.status === 'left'
                                    ? 'Left Quiz'
                                    : attempt.status === 'in-progress'
                                    ? 'In Progress'
                                    : 'Completed'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Top Summary Cardd */}
        <Card className={`mb-6 overflow-hidden border shadow-sm ${cardBg} ${borderColor}`}>
          <div className={`h-2 w-full ${performanceBadge.color}`}></div>
          <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight md:text-2xl">{result.quizTitle}</CardTitle>
              <CardDescription className="mt-2 flex flex-col gap-1 text-sm md:flex-row md:items-center md:gap-3">
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

          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3 pb-6 md:grid-cols-4">
              <div className={`rounded-lg border p-3 ${panelBg} ${borderColor}`}>
                <p className={`text-xs font-medium uppercase tracking-wide ${mutedText}`}>Score</p>
                <p className="mt-1 text-lg font-semibold">{result.totalScore}/{result.totalQuestions}</p>
              </div>
              <div className={`rounded-lg border p-3 ${panelBg} ${borderColor}`}>
                <p className={`text-xs font-medium uppercase tracking-wide ${mutedText}`}>Accuracy</p>
                <p className="mt-1 text-lg font-semibold">{overallPercentage}%</p>
              </div>
              <div className={`rounded-lg border p-3 ${panelBg} ${borderColor}`}>
                <p className={`text-xs font-medium uppercase tracking-wide ${mutedText}`}>Sections</p>
                <p className="mt-1 text-lg font-semibold">{result.sections.length}</p>
              </div>
              <div className={`rounded-lg border p-3 ${panelBg} ${borderColor}`}>
                <p className={`text-xs font-medium uppercase tracking-wide ${mutedText}`}>Attempted</p>
                <p className="mt-1 text-lg font-semibold">
                  {result.sections.reduce((sum, section) => sum + section.questions.length, 0)}/{result.totalQuestions}
                </p>
              </div>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div
                className={`mb-4 rounded-xl border p-1 ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-950/70' : 'border-gray-200 bg-gray-100/70'
                }`}
              >
                <TabsList className="grid h-auto grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-2">
                <TabsTrigger
                  value="overview"
                  className="group rounded-lg border border-transparent bg-white/80 px-3 py-3 text-left transition-all data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:bg-indigo-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-indigo-100 p-2 text-indigo-600 transition-colors group-data-[state=active]:bg-white/15 group-data-[state=active]:text-white dark:bg-indigo-900/60 dark:text-indigo-300">
                      <Trophy className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-semibold">Overview</span>
                      <span className="text-xs text-gray-500 group-data-[state=active]:text-indigo-100 dark:text-gray-400">
                        Summary and AI insight
                      </span>
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="sections"
                  className="group rounded-lg border border-transparent bg-white/80 px-3 py-3 text-left transition-all data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:bg-indigo-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-indigo-100 p-2 text-indigo-600 transition-colors group-data-[state=active]:bg-white/15 group-data-[state=active]:text-white dark:bg-indigo-900/60 dark:text-indigo-300">
                      <BarChart3 className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-semibold">Sections</span>
                      <span className="text-xs text-gray-500 group-data-[state=active]:text-indigo-100 dark:text-gray-400">
                        Topic-wise breakdown
                      </span>
                    </span>
                  </div>
                </TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Leaderboard Podium */}
                

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Score Circle */}
                  <div className={`relative flex flex-col items-center justify-center rounded-xl border p-6 ${cardBg} ${borderColor}`}>
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
                        <span className="text-xl font-bold">{overallPercentage}%</span>
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
                  <div className={`col-span-1 rounded-xl border p-6 md:col-span-2 ${cardBg} ${borderColor}`}>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-indigo-500" />
                      Section Performance
                    </h3>
                    <div className="space-y-3">
                      {result.sections.map((section) => {
                        const sectionPercentage = Math.round((section.correct / section.total) * 100);
                        const sectionBadge = getScoreBadge(sectionPercentage);

                        if (section.total === 0) return null;

                        return (
                          <div key={section.sectionName} className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium">
                                  {section.sectionName
                                    .split('-')
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ')}
                                </span>
                                <Badge variant="outline" className="text-xs font-medium">
                                  Attempted: {section.questions.length}/{section.total}
                                </Badge>
                                <Badge variant="outline" className="text-xs font-medium">
                                  Correct: {section.correct}/{section.questions.length}
                                </Badge>
                              </div>
                              <span
                                className={`text-sm font-semibold ${
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
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-indigo-500" />
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
                <Tabs
                  value={activeQuestionSection || availableQuestionSections[0]?.sectionName || ''}
                  onValueChange={setActiveQuestionSection}
                  className="space-y-4"
                >
                  <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto bg-transparent p-0">
                    {availableQuestionSections.map((section) => (
                      <TabsTrigger
                        key={section.sectionName}
                        value={section.sectionName}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:border-gray-700 dark:bg-gray-900 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:bg-indigo-950/40 dark:data-[state=active]:text-indigo-200"
                      >
                        <span className="mr-2">{getSectionLabel(section.sectionName)}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {section.questions.length}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {availableQuestionSections.map((section) => {
                    const sectionPercentage = Math.round((section.correct / section.total) * 100);

                    return (
                      <TabsContent key={section.sectionName} value={section.sectionName} className="space-y-4">
                        <div className={`flex flex-wrap items-center gap-2 rounded-lg border p-3 ${cardBg} ${borderColor}`}>
                          <span className="text-sm font-semibold">{getSectionLabel(section.sectionName)}</span>
                          <Badge variant={sectionPercentage >= 70 ? 'secondary' : sectionPercentage >= 40 ? 'outline' : 'destructive'}>
                            {section.correct}/{section.total}
                          </Badge>
                          <Badge variant="outline">Accuracy {sectionPercentage}%</Badge>
                          <Badge variant="outline">Attempted {section.questions.length}</Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {section.questions.map((question, index) => (
                            <Card
                              key={question._id}
                              className={`border text-sm shadow-sm ${
                                question.userAnswer === question.correctAnswer
                                  ? 'border-green-500 dark:border-green-700'
                                  : 'border-red-500 dark:border-red-700'
                              } cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md`}
                              onClick={() =>
                                setFocusedQuestion({
                                  sectionName: section.sectionName,
                                  sectionLabel: getSectionLabel(section.sectionName),
                                  question,
                                  index,
                                })
                              }
                            >
                              <CardContent className="p-3">
                                <div className="mb-2 flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                                        question.userAnswer === question.correctAnswer
                                          ? 'bg-green-100 dark:bg-green-900/30'
                                          : 'bg-red-100 dark:bg-red-900/30'
                                      }`}
                                    >
                                      {question.userAnswer === question.correctAnswer ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                      ) : (
                                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                                      )}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Q{index + 1}</span>
                                  </div>
                                  <Badge variant="outline" className="text-[10px]">
                                    {question.userAnswer === question.correctAnswer ? 'Correct' : 'Wrong'}
                                  </Badge>
                                </div>

                                <p className="line-clamp-2 text-xs leading-5 text-gray-700 dark:text-gray-200">{question.text}</p>
                               
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <Card className={`${feedbackBg} border`}>
                          <CardHeader className="pb-2">
                            <div>
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-indigo-500" />
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
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {focusedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className={`w-full max-w-3xl rounded-xl border shadow-xl ${cardBg} ${borderColor}`}>
              <div className={`flex items-start justify-between border-b p-4 ${borderColor}`}>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
                    {focusedQuestion.sectionLabel}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">Question {focusedQuestion.index + 1}</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setFocusedQuestion(null)}>
                  Close
                </Button>
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-auto p-4">
                <p className="text-sm leading-6">{focusedQuestion.question.text}</p>

                <div className="space-y-2">
                  {focusedQuestion.question.options.map((option, optionIndex) => {
                    const isCorrect = optionIndex === focusedQuestion.question.correctAnswer;
                    const isUserSelection = optionIndex === focusedQuestion.question.userAnswer;

                    let optionClass = neutralOptionBg;
                    if (isCorrect) optionClass = correctOptionBg;
                    else if (isUserSelection) optionClass = wrongOptionBg;

                    return (
                      <div key={optionIndex} className={`rounded-lg border p-3 text-sm ${optionClass}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="mr-2 font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                            <span>{option}</span>
                          </div>
                          {isCorrect ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : null}
                          {!isCorrect && isUserSelection ? <XCircle className="h-4 w-4 text-red-500" /> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Card className={`${feedbackBg} border`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-indigo-500" />
                        Explanation
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          toggleQuestionExplanation(
                            focusedQuestion.question._id,
                            focusedQuestion.question.text,
                            focusedQuestion.question.userAnswer,
                            focusedQuestion.question.correctAnswer,
                            focusedQuestion.question.options
                          )
                        }
                        disabled={loadingExplanations[focusedQuestion.question._id]}
                      >
                        {loadingExplanations[focusedQuestion.question._id] ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : expandedExplanations[focusedQuestion.question._id] ? (
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
                  {expandedExplanations[focusedQuestion.question._id] && (
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p>
                          {detailedExplanations[focusedQuestion.question._id] ||
                            focusedQuestion.question.explanation ||
                            'No explanation available.'}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Actions Footer */}
          <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Button variant="secondary" onClick={() => window.history.back()} size="sm">
              Back to Tests
            </Button>
                <div className="flex flex-wrap items-center gap-2">
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