"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

// Improved QuizJoinComponent
export  default  function QuizJoinComponent() {
  const [quizCode, setQuizCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const isValidCode = quizCode.length >= 7 && quizCode.length <= 8;

  const handleJoinCode = async (code) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/getQuizByCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Quiz not found');
      }

      const data = await response.json();
      router.push(`/quiz-play/${data.quizId}`);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error("Invalid quiz code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = () => {
    if (!isValidCode) {
      toast.error("Please enter a valid 7 or 8-character quiz code.");
      return;
    }
    toast.success("Joining the quiz...");
    if (quizCode.length === 7) {
      handleJoinCode(quizCode);
    } else {
      router.push(`/playy/${quizCode}`);
    }
  };

  return (
    <div className="w-full max-w-lg  mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
    <div className="relative overflow-hidden">
      {/* Blue gradient accent */}
      <div className="absolute -left-4 -top-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20"></div>
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20"></div>
      
      <div className="flex items-center p-4 relative z-10">
        {/* Icon and label for larger screens */}
        <div className="hidden sm:flex items-center mr-3">
          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </span>
          <span className="ml-2 font-semibold text-gray-800 dark:text-white whitespace-nowrap">
            Join as a participant ?
          </span>
        </div>
        
        {/* Icon only for mobile */}
        <span className="flex sm:hidden items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
        
        {/* Input field and button - always in a single line */}
        <div className="relative flex-1">
          <input
            placeholder="Enter quiz code"
            className="w-full px-3 py-2 pr-16 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            type="text"
            onChange={(e) => setQuizCode(e.target.value)}
            value={quizCode}
            maxLength={8}
            aria-label="Enter quiz code to join"
          />
          <button
            className={`absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              isValidCode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Join the quiz now"
            onClick={handleJoin}
            disabled={!isValidCode || isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Join"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}