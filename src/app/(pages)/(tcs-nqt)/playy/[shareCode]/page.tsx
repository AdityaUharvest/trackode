'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { SubmitConfirmationModal } from '@/components/(tcs)/SubmitConfirmationModal';
import { QuizResultModal } from '@/components/(tcs)/QuizResultModal';
import { SectionProgress } from '@/components/(tcs)/SectionProgress';
import { QuestionTimer } from '@/components/(tcs)/QuestionTimer';
import { Loader2, Calculator, Minimize2, Maximize2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';

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

export default function QuizPlayer() {
  const { theme, toggleTheme } = useTheme();
  const { shareCode } = useParams();
  const router = useRouter();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [sectionAnswers, setSectionAnswers] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
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

  // Load answers from localStorage on initial render
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`quiz_${shareCode}_answers`);
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setAnswers(parsedAnswers.answers || {});
        setSectionAnswers(parsedAnswers.sectionAnswers || {});
      } catch (e) {
        console.error('Failed to parse saved answers', e);
      }
    }
  }, [shareCode]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (quizStarted) {
      localStorage.setItem(`quiz_${shareCode}_answers`, JSON.stringify({
        answers,
        sectionAnswers
      }));
    }
  }, [answers, sectionAnswers, shareCode, quizStarted]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/quiz/${shareCode}`);
        setQuiz(response.data.quiz);
        setQuestions(response.data.questions);
        
        const initialSectionAnswers: Record<string, Record<string, number>> = {};
        sections.forEach(section => {
          initialSectionAnswers[section.name] = {};
        });
        setSectionAnswers(initialSectionAnswers);
        
        setCurrentSection(sections[0].name);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please check the link and try again.');
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [shareCode]);

  const [sectionTimers, setSectionTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!quizStarted || !currentSection) return;
  
    const section = sections.find(s => s.name === currentSection);
    if (!section?.timeLimit) return;
  
    const initialTime = sectionTimers[currentSection] || section.timeLimit;
    setSectionTimeRemaining(initialTime);
    
    const timer = setInterval(() => {
      setSectionTimeRemaining(prev => {
        const newTime = prev - 1;
        setSectionTimers(prevTimers => ({
          ...prevTimers,
          [currentSection]: newTime
        }));
        
        if (newTime <= 0) {
          clearInterval(timer);
          handleSectionSubmit();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [currentSection, quizStarted]);
  
  const changeSection = (sectionName: string) => {
    if (currentSection) {
      setSectionTimers(prev => ({
        ...prev,
        [currentSection]: sectionTimeRemaining
      }));
    }
    
    setCurrentSection(sectionName);
    setCurrentQuestionIndex(0);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    if (quiz?.durationMinutes) {
      setTimeRemaining(quiz.durationMinutes * 60);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    const newAnswers = {
      ...answers,
      [questionId]: optionIndex
    };
    
    const newSectionAnswers = {
      ...sectionAnswers,
      [currentSection]: {
        ...sectionAnswers[currentSection],
        [questionId]: optionIndex
      }
    };
    
    setAnswers(newAnswers);
    setSectionAnswers(newSectionAnswers);
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
      await axios.post(`/api/quiz/${shareCode}/answers`, {
        section: currentSection,
        answers: sectionAnswers[currentSection]
      });
      
      const currentIndex = sections.findIndex(s => s.name === currentSection);
      if (currentIndex < sections.length - 1) {
        changeSection(sections[currentIndex + 1].name);
      } else {
        setShowResultModal(true);
      }
    } catch (err) {
      setError('Failed to save answers. Please try again.');
    }
  };

  const handleQuizSubmit = async () => {
    try {
      await axios.post(`/api/quiz/${shareCode}/complete`, {
        answers: sectionAnswers
      });
      localStorage.removeItem(`quiz_${shareCode}_answers`);
      setShowResultModal(true);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
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
      setCalcInput(prev => prev.slice(0, -1));
    } else {
      setCalcInput(prev => prev + value);
    }
  };

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

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const currentQuestions = questions.filter(q => q.section === currentSection);
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentSectionData = sections.find(s => s.name === currentSection);
  const isLastSection = currentSection === sections[sections.length - 1].name;

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`text-center p-4 max-w-md rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-red-400' : 'bg-white text-red-500 shadow-md'}`}>
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/')}
            className={`mt-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className={`flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-6 rounded-lg shadow-md w-full max-w-2xl mx-4 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
          <h1 className="text-2xl font-bold mb-3 text-center">{quiz?.title}</h1>
          
          {quiz?.description && Array.isArray(quiz.description) && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Description:</h2>
              <ul className="list-disc pl-5 space-y-1">
                {quiz.description.map((item:any, index:any) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">Sections:</h2>
              <ul className={`space-y-2 rounded-lg divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {sections.map(section => (
                  <li key={section.name} className={`px-4 py-3 flex justify-between ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <span>{section.label}</span>
                    {section.timeLimit && (
                      <span className={`text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                        {Math.floor(section.timeLimit / 60)} mins
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
  
            <div>
              <h2 className="font-semibold mb-2">Instructions:</h2>
              <ul className={`space-y-2 rounded-lg divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <li className={`px-4 py-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Each section must be completed in sequence</span>
                  </div>
                </li>
                <li className={`px-4 py-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You cannot go back to previous sections</span>
                  </div>
                </li>
                <li className={`px-4 py-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Time limits are enforced per section</span>
                  </div>
                </li>
                <li className={`px-4 py-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Answers are auto-saved as you progress</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
  
          <div className="mt-8 text-center">
            <button
              onClick={startQuiz}
              className={`px-8 py-3 rounded-lg transition font-medium ${theme === 'dark' ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white`}
            >
              Start Quiz Now
            </button>
            <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              The quiz will begin when you click the button above
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <header className={`shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{quiz?.title}</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowCalculator(!showCalculator)}
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Calculator"
            >
              <Calculator size={20} />
            </button>
            <button 
              onClick={toggleFullScreen}
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {currentSectionData?.timeLimit && (
              <QuestionTimer 
                timeRemaining={sectionTimeRemaining} 
                onTimeUp={handleSectionSubmit}
                darkMode={theme === 'dark'}
              />
            )}
            <span className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
              {currentSectionData?.label}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <SectionProgress 
            sections={sections}
            currentSection={currentSection}
            answers={sectionAnswers}
            onChangeSection={changeSection}
            darkMode={theme === 'dark'}
          />
        </div>

        {/* Main Quiz Area */}
        <div className={`lg:col-span-2 p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {currentQuestion && (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      answers[currentQuestion._id] === index
                        ? theme === 'dark' 
                          ? 'border-blue-500 bg-blue-900 border' 
                          : 'border-blue-500 bg-blue-50 border'
                        : theme === 'dark'
                          ? 'border-gray-700 hover:bg-gray-700 border'
                          : 'border-gray-200 hover:bg-gray-50 border'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        answers[currentQuestion._id] === index
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : theme === 'dark'
                            ? 'border-gray-500'
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
                  className={`px-4 py-2 rounded disabled:opacity-50 ${
                    theme === 'dark' 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  } border`}
                >
                  Previous
                </button>
                {currentQuestionIndex < currentQuestions.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white`}
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
          <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="font-medium mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {currentQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded flex items-center justify-center ${
                    currentQuestionIndex === index
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : answers[currentQuestions[index]._id] !== undefined
                      ? theme === 'dark'
                        ? 'bg-green-900 text-green-200'
                        : 'bg-green-100 text-green-800'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Calculator */}
          {showCalculator && (
            <div className={`mt-4 p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`mb-2 p-2 rounded text-right font-mono text-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                {calcInput || '0'}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C', '⌫'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButtonClick(btn)}
                    className={`p-2 rounded ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}
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
        darkMode={theme === 'dark'}
      />

      <QuizResultModal
        isOpen={showResultModal}
        onClose={() => router.push('/')}
        quizId={quiz?._id}
        darkMode={theme === 'dark'}
      />
    </div>
  );
}