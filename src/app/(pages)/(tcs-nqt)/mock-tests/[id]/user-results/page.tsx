'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeContext';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, ChevronUp, AlertCircle, Loader2, Trophy, 
  CheckCircle2, XCircle, Sparkles, Lightbulb, BarChart3,
  BookOpen, Brain, Calendar, Clock, ArrowRight, GraduationCap
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [activeTab, setActiveTab] = useState('overview');

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
          **User's Answer:** ${options[userAnswerIndex]} 
          ${userAnswerIndex === correctAnswerIndex ? '(Correct)' : '(Incorrect)'}
          
          **Correct Answer:** ${options[correctAnswerIndex]}
          
          Please provide:
          1. A concise explanation of why the correct answer is right (15-20 words)
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

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return { color: 'bg-green-500', label: 'Excellent' };
    if (percentage >= 70) return { color: 'bg-emerald-500', label: 'Good' };
    if (percentage >= 60) return { color: 'bg-yellow-500', label: 'Satisfactory' };
    if (percentage >= 40) return { color: 'bg-orange-500', label: 'Needs Work' };
    return { color: 'bg-red-500', label: 'Critical' };
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
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
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
            <Button 
              asChild
              className="mt-4"
            >
              <a href={`/mock-tests/${quizId}`}>Take the Quiz</a>
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

  return (
    <div className={`min-h-screen p-2 md:p-6 ${bgColor}`}>
      <div className="max-w-7xl mx-auto">
        {/* Top Summary Card */}
        <Card className="mb-6 overflow-hidden border shadow-md">
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
              <Badge 
                className={`px-3 py-1 text-white ${performanceBadge.color}`}
              >
                {performanceBadge.label}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden md:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="sections" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden md:inline">Sections</span>
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden md:inline">Questions</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Score Circle */}
                  <div className={`flex flex-col items-center justify-center p-6 rounded-lg ${cardBg} border ${borderColor} relative`}>
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
                            overallPercentage >= 80 ? 'stroke-green-500' :
                            overallPercentage >= 70 ? 'stroke-emerald-500' :
                            overallPercentage >= 60 ? 'stroke-yellow-500' : 
                            overallPercentage >= 50 ? 'stroke-orange-500' : 'stroke-red-500'
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
                      <span>{result.totalScore} correct out of {result.totalQuestions}</span>
                    </div>
                  </div>
                  
                  {/* Section Performance */}
                  <div className={`p-6 rounded-lg ${cardBg} border ${borderColor} col-span-1 md:col-span-2`}>
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
                                <span className="text-sm font-medium">
                                  {section.sectionName.split('-').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {section.correct}/{section.total}
                                  {section.questions.length}
                                </Badge>
                              </div>
                              <span className={`text-sm font-medium ${
                                sectionPercentage >= 70 ? 'text-green-500' : 
                                sectionPercentage >= 60 ? 'text-yellow-500' : 
                                sectionPercentage >= 50 ? 'text-orange-500' : 'text-red-500'
                              }`}>
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
                        <p>{overallFeedback}</p>
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
                  {overallFeedback && (
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={generateOverallFeedback}
                        disabled={loadingFeedback.overall}
                        className="ml-auto"
                      >
                        {loadingFeedback.overall ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Refresh Analysis
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  )}
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
                            {section.sectionName.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                            <Badge 
                              variant={
                                sectionPercentage >= 70 ? 'secondary' : 
                                sectionPercentage >= 40 ? 'outline' : 'destructive'
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
                        <CardContent className="p-4 space-y-6">
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
                                  className={`border cursor-pointer transition-all ${isCorrect ? 'border-green-500 dark:border-green-700' : 'border-red-500 dark:border-red-700'} hover:shadow-md`}
                                  onClick={() => {
                                    toggleQuestion(question._id);
                                    setActiveTab('questions');
                                  }}
                                >
                                  <CardContent className="p-3 flex flex-col items-center text-center">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center mb-1 ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
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
                        
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('questions')}
                          className="w-full"
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
                      {section.sectionName.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                      <Badge variant="outline">
                        {section.correct}/{section.total}
                      </Badge>
                    </h3>
                    
                    <div className="space-y-4">
                      {section.questions.map((question, index) => (
                        <Card key={question._id} className={`border text-xm ${
                          question.userAnswer === question.correctAnswer ? 
                          'border-green-500 dark:border-green-700' : 
                          'border-red-500 dark:border-red-700'
                        }`}>
                          <CardHeader 
                            className="cursor-pointer flex flex-row items-start justify-between"
                            onClick={() => toggleQuestion(question._id)}
                          >
                            <div className="flex gap-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                question.userAnswer === question.correctAnswer ? 
                                'bg-green-100 dark:bg-green-900/30' : 
                                'bg-red-100 dark:bg-red-900/30'
                              }`}>
                                {question.userAnswer === question.correctAnswer ? (
                                  <CheckCircle2 className="h-2 w-2 text-green-500" />
                                ) : (
                                  <XCircle className="h-2 w-2 text-red-500" />
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-sm font-medium">Question {index+1}</CardTitle>
                                <CardDescription className="line-clamp-1">
                                  {question.text}
                                </CardDescription>
                              </div>
                            </div>
                            <button 
                              className="mt-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                                    iconComponent = <CheckCircle2 className="h-2 w-2 text-green-500 flex-shrink-0" />;
                                  } else if (isUserSelection) {
                                    optionClass = wrongOptionBg;
                                    iconComponent = <XCircle className="h-2 w-2 text-red-500 flex-shrink-0" />;
                                  }
                                  
                                  return (
                                    <div
                                      key={index}
                                      className={`p-3 text-xs rounded-lg border ${optionClass}`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start">
                                          <span className="mr-2 font-medium">{String.fromCharCode(65 + index)}.</span>
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
                                      <p>{detailedExplanations[question._id] || question.explanation || 'No explanation available.'}</p>
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
        </CardContent>
      </Card>
      
      {/* Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t  pt-12">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Button 
            variant="secondary"
            onClick={() => window.history.back()}
            size="sm"
          >
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
            <Button  size="sm"
            asChild>
              <a href={`/mocks`}>Explore Mocks</a>
            </Button>
            <Button  size="sm" asChild>
              <a href={`/quiz-list`}>More Quizzes</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}