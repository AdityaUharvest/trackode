'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { SubmitConfirmationModal } from '@/components/(tcs)/SubmitConfirmationModal';
import { QuizResultModal } from '@/components/(tcs)/QuizResultModal';
import { SectionProgress } from '@/components/(tcs)/SectionProgress';
import { QuestionTimer } from '@/components/(tcs)/QuestionTimer';
import { Loader2 } from 'lucide-react';

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

  // Define sections based on TCS NQT pattern
  const sections: Section[] = [
    { name: 'verbal-ability', label: 'Verbal Ability', timeLimit: 25 * 60 },
    { name: 'reasoning-ability', label: 'Reasoning Ability', timeLimit: 35 * 60 },
    { name: 'numerical-ability', label: 'Numerical Ability', timeLimit: 40 * 60 },
    { name: 'advanced-quantitative', label: 'Advanced Quantitative' },
    { name: 'advanced-reasoning', label: 'Advanced Reasoning' },
    { name: 'advanced-coding', label: 'Advanced Coding' }
  ];

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
        
        // Start with first section
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
  
    // Use existing time if available, otherwise start with full time
    const initialTime = sectionTimers[currentSection] || section.timeLimit;
    setSectionTimeRemaining(initialTime);
    
    const timer = setInterval(() => {
      setSectionTimeRemaining(prev => {
        const newTime = prev - 1;
        // Update the section timers state
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
    // Save current section's remaining time
    if (currentSection) {
      setSectionTimers(prev => ({
        ...prev,
        [currentSection]: sectionTimeRemaining
      }));
    }
    
    // Switch to new section
    setCurrentSection(sectionName);
    setCurrentQuestionIndex(0);
  };
  // useEffect(() => {
  //   if (!quizStarted || !currentSection) return;

  //   const section = sections.find(s => s.name === currentSection);
  //   if (!section?.timeLimit) return;

  //   setSectionTimeRemaining(section.timeLimit);
    
  //   const timer = setInterval(() => {
  //     setSectionTimeRemaining(prev => {
  //       if (prev <= 1) {
  //         clearInterval(timer);
  //         handleSectionSubmit();
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [currentSection, quizStarted]);

  const startQuiz = () => {
    setQuizStarted(true);
    // Set overall quiz timer if needed
    if (quiz?.durationMinutes) {
      setTimeRemaining(quiz.durationMinutes * 60);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    
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
      await axios.post(`/api/quiz/${shareCode}/answers`, {
        section: currentSection,
        answers: sectionAnswers[currentSection]
      });
      
      // Move to next section or finish if last section
      const currentIndex = sections.findIndex(s => s.name === currentSection);
      if (currentIndex < sections.length - 1) {
        setCurrentSection(sections[currentIndex + 1].name);
        setCurrentQuestionIndex(0);
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
        <Loader2 />
        
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
          
          {/* Description as list */}
          {quiz?.description && Array.isArray(quiz.description) && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-gray-700">Description:</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {quiz.description.map((item:any, index:any) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ) }
  
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
                    <span className="text-gray-600">Each section must be completed in sequence</span>
                  </div>
                </li>
                <li className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">You cannot go back to previous sections</span>
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
                    <span className="text-gray-600">Answers are auto-saved as you progress</span>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{quiz?.title}</h1>
          <div className="flex items-center space-x-4">
            {currentSectionData?.timeLimit && (
              <QuestionTimer 
                timeRemaining={sectionTimeRemaining} 
                onTimeUp={handleSectionSubmit}
              />
            )}
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
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
              {currentQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded flex items-center justify-center ${
                    currentQuestionIndex === index
                      ? 'bg-blue-500 text-white'
                      : answers[currentQuestions[index]._id] !== undefined
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