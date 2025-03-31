'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { SubmitConfirmationModal } from '@/components/(tcs)/SubmitConfirmationModal';
import { QuizResultModal } from '@/components/(tcs)/QuizResultModal';
import { SectionProgress } from '@/components/(tcs)/SectionProgress';
import { QuestionTimer } from '@/components/(tcs)/QuestionTimer';
import { Loader2, Calculator, Maximize2, Minimize2 } from 'lucide-react';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  section: string;
}

interface Section {
  name: string;
  label: string;
  timeLimit?: number;
}

interface QuizProgress {
  answers: Record<string, number>;
  sectionTimes: Record<string, number>;
  currentSection: string;
  currentQuestionIndex: number;
  startedAt: number;
}

export default function QuizPlayer() {
  const { shareCode } = useParams();
  const router = useRouter();
  const quizContainerRef = useRef<HTMLDivElement>(null);
  
  // Quiz state
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [sectionAnswers, setSectionAnswers] = useState<Record<string, Record<string, number>>>({});
  const [sectionTimers, setSectionTimers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');

  // Define sections based on TCS NQT pattern
  const sections: Section[] = [
    { name: 'verbal-ability', label: 'Verbal Ability', timeLimit: 25 * 60 },
    { name: 'reasoning-ability', label: 'Reasoning Ability', timeLimit: 35 * 60 },
    { name: 'numerical-ability', label: 'Numerical Ability', timeLimit: 40 * 60 },
    { name: 'advanced-quantitative', label: 'Advanced Quantitative' },
    { name: 'advanced-reasoning', label: 'Advanced Reasoning' },
    { name: 'advanced-coding', label: 'Advanced Coding' }
  ];

  // Load quiz progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`quizProgress_${shareCode}`);
    if (savedProgress) {
      const progress: QuizProgress = JSON.parse(savedProgress);
      setAnswers(progress.answers);
      setSectionTimers(progress.sectionTimes);
      setCurrentSection(progress.currentSection);
      setCurrentQuestionIndex(progress.currentQuestionIndex);
      setStartTime(progress.startedAt);
      setQuizStarted(true);
    }
  }, [shareCode]);

  // Save quiz progress to localStorage
  useEffect(() => {
    if (!quizStarted) return;

    const progress: QuizProgress = {
      answers,
      sectionTimes: sectionTimers,
      currentSection,
      currentQuestionIndex,
      startedAt: startTime
    };

    localStorage.setItem(`quizProgress_${shareCode}`, JSON.stringify(progress));
  }, [answers, sectionTimers, currentSection, currentQuestionIndex, quizStarted, shareCode, startTime]);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/quiz/${shareCode}`);
        setQuiz(response.data.quiz);
        setQuestions(response.data.questions);
        
        // Initialize section answers
        const initialSectionAnswers: Record<string, Record<string, number>> = {};
        sections.forEach(section => {
          initialSectionAnswers[section.name] = {};
        });
        setSectionAnswers(initialSectionAnswers);
        
        // Start with first section if no saved progress
        if (!localStorage.getItem(`quizProgress_${shareCode}`)) {
          setCurrentSection(sections[0].name);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please check the link and try again.');
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [shareCode]);

  // Handle section timer
  useEffect(() => {
    if (!quizStarted || !currentSection) return;
  
    const section = sections.find(s => s.name === currentSection);
    if (!section?.timeLimit) return;
  
    // Use existing time if available, otherwise start with full time
    const initialTime = sectionTimers[currentSection] || section.timeLimit;
    setSectionTimers(prev => ({
      ...prev,
      [currentSection]: initialTime
    }));
    
    const timer = setInterval(() => {
      setSectionTimers(prev => {
        const newTime = prev[currentSection] - 1;
        
        if (newTime <= 0) {
          clearInterval(timer);
          handleSectionSubmit();
          return { ...prev, [currentSection]: 0 };
        }
        
        return { ...prev, [currentSection]: newTime };
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [currentSection, quizStarted]);

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Calculator functions
  const handleCalcButtonClick = (value: string) => {
    if (value === '=') {
      try {
        setCalcInput(eval(calcInput).toString());
      } catch {
        setCalcInput('Error');
      }
    } else if (value === 'C') {
      setCalcInput('');
    } else if (value === '⌫') {
      setCalcInput(calcInput.slice(0, -1));
    } else {
      setCalcInput(prev => prev + value);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const changeSection = (sectionName: string) => {
    setCurrentSection(sectionName);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    const newAnswers = {
      ...answers,
      [questionId]: optionIndex
    };
    
    setAnswers(newAnswers);
    
    setSectionAnswers(prev => ({
      ...prev,
      [currentSection]: {
        ...prev[currentSection],
        [questionId]: optionIndex
      }
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSectionSubmit = async () => {
    try {
      // Save section answers and time spent
      await axios.post(`/api/quiz/${shareCode}/answers`,
      {
        section: currentSection,
        answers: sectionAnswers[currentSection],
        timeSpent: 
        (sections.find(s => s.name === currentSection)?.timeLimit 
          ? (sections.find(s => s.name === currentSection)!.timeLimit! - sectionTimers[currentSection])
          : 0)
      }
    );
      
      // Move to next section or finish if last section
      const currentIndex = sections.findIndex(s => s.name === currentSection);
      if (currentIndex < sections.length - 1) {
        changeSection(sections[currentIndex + 1].name);
      } else {
        handleQuizSubmit();
      }
    } catch (err) {
      setError('Failed to save answers. Please try again.');
    }
  };

  const handleQuizSubmit = async () => {
    try {
      // Calculate total time spent
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      
      await axios.post(`/api/quiz/${shareCode}/complete`, {
        answers: sectionAnswers,
        sectionTimes: sectionTimers,
        totalTime
      });
      
      // Clear saved progress
      localStorage.removeItem(`quizProgress_${shareCode}`);
      setShowResultModal(true);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
    }
  };

  const currentQuestions = questions.filter(q => q.section === currentSection);
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentSectionData = sections.find(s => s.name === currentSection);
  const isLastSection = currentSection === sections[sections.length - 1].name;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center p-4 max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-4">
          <h1 className="text-2xl font-bold mb-3 text-center">{quiz?.title}</h1>
          
          {quiz?.description && Array.isArray(quiz.description) && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-gray-700">Description:</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {quiz.description.map((item:any, index:any) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2 text-gray-700">Sections:</h2>
              <ul className="space-y-2 border rounded-lg divide-y">
                {sections.map(section => (
                  <li key={section.name} className="px-4 py-3 flex justify-between hover:bg-gray-50">
                    <span className="text-gray-800">{section.label}</span>
                    {section.timeLimit && (
                      <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                        {Math.floor(section.timeLimit / 60)} mins
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
  
            <div>
              <h2 className="font-semibold mb-2 text-gray-700">Instructions:</h2>
              <ul className="space-y-2 border rounded-lg divide-y">
                <li className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Progress is saved automatically</span>
                  </div>
                </li>
                <li className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Time limits are enforced per section</span>
                  </div>
                </li>
                <li className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Use the calculator for numerical questions</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
  
          <div className="mt-8 text-center">
            <button
              onClick={startQuiz}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Start Quiz Now
            </button>
            <p className="mt-3 text-sm text-gray-500">
              The quiz will begin when you click the button above
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" ref={quizContainerRef}>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{quiz?.title}</h1>
          <div className="flex items-center space-x-4">
            {currentSectionData?.timeLimit && (
              <QuestionTimer 
                timeRemaining={sectionTimers[currentSection] || 0}
                onTimeUp={handleSectionSubmit}
              />
            )}
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {currentSectionData?.label}
            </span>
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Calculator"
            >
              <Calculator size={20} />
            </button>
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-full hover:bg-gray-100"
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Calculator</h3>
            <button 
              onClick={() => setShowCalculator(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="bg-gray-100 p-2 mb-2 rounded text-right font-mono">
            {calcInput || '0'}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C', '⌫'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcButtonClick(btn)}
                className={`p-2 rounded ${
                  ['C', '⌫'].includes(btn)
                    ? 'bg-red-100 hover:bg-red-200'
                    : btn === '='
                    ? 'bg-blue-100 hover:bg-blue-200'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <SectionProgress 
            sections={sections}
            currentSection={currentSection}
            answers={sectionAnswers}
            onChangeSection={changeSection}
          />
        </div>

        {/* Main Quiz Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          {currentQuestion && (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {currentQuestions.length}
                  </span>
                </div>
                <h2 className="text-lg font-medium">{currentQuestion.text}</h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion._id, index)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      answers[currentQuestion._id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        answers[currentQuestion._id] === index
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                {currentQuestionIndex < currentQuestions.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    {isLastSection ? 'Submit Quiz' : 'Submit Section'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Question Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {currentQuestions.map((q, index) => (
                <button
                  key={q._id}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded flex items-center justify-center ${
                    currentQuestionIndex === index
                      ? 'bg-blue-500 text-white'
                      : answers[q._id] !== undefined
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={isLastSection ? handleQuizSubmit : handleSectionSubmit}
        title={isLastSection ? 'Submit Quiz' : 'Submit Section'}
        message={
          isLastSection
            ? 'Are you sure you want to submit the entire quiz? You cannot change answers after submission.'
            : `Are you sure you want to submit the ${currentSectionData?.label} section? You cannot return to this section.`
        }
      />

      <QuizResultModal
        isOpen={showResultModal}
        onClose={() => router.push('/')}
        quizId={quiz?._id}
      />
    </div>
  );
}