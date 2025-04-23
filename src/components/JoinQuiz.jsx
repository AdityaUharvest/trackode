"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function QuizJoinComponent() {
  const [quizCode, setQuizCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Check if code is exactly 8 characters
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
    <div className="w-full lg:w-2/5">
      <div
        className="relative p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl transform transition-all duration-700 hover:shadow-2xl"
        style={{
          animation: "float 6s ease-in-out infinite"
        }}
      >
        <div className="absolute -top-3 -right-3">
          <span className="flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Join as a participant
        </h2>
        
        <div className="mb-5 space-y-4">
          <div className="relative">
            <input
              placeholder="Enter quiz code (7 or 8 characters)"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none text-gray-800 dark:text-white dark:bg-gray-700 placeholder-gray-500"
              type="text"
              onChange={(e) => setQuizCode(e.target.value)}
              value={quizCode}
              maxLength={8}
              aria-label="Enter quiz code to join"
            />
            {quizCode.length > 0 && !isValidCode && (
              <p className="mt-1 text-xs text-red-500">Quiz code must be 7 or 8 characters</p>
            )}
          </div>
          
          <button
            className={`w-full font-semibold text-lg px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm transform hover:translate-y-px flex items-center justify-center ${
              isValidCode 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Join the quiz now"
            onClick={handleJoin}
            disabled={!isValidCode || isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                Join Now
                <span aria-hidden="true" className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>

          
          
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            No account? <a href="/signup" className="text-blue-600 hover:underline">Sign up for free</a>
          </div>
        </div>
        
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-medium shadow-sm">
            Quick join • No Registration required
          </div>
        </div>
        
      </div>
      
    </div>
  );
}