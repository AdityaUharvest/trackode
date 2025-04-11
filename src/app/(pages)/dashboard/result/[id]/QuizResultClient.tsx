// app/dashboard/results/[id]/QuizResultClient.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeContext'; // Your theme context
import { Button } from '@/components/ui/button';

export default function QuizResultClient({ result }: { result: any }) {
  const { theme } = useTheme(); // Use the theme context
  const [explanation, setExplanation] = useState<{ [key: number]: string }>({});
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  const handleExplanation = async (index: number, question: string, correctAnswer: string) => {
    try {
      setGeneratingId(index);
      const response = await fetch('/api/generate-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Explain why the correct answer is ${correctAnswer} for question: ${question} in not more than 100 words and in single sentence without topics.`,
        }),
      });

      const data = await response.json();
      
      setExplanation((prev) => ({ ...prev, [index]: data.instructions }));
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className={`min-h-screen sm:text-sm lg:p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`p-4 rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className="text-xl font-bold mb-4">
            {result.title} 
          </h1>

          {/* Score Section */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <p className="font-semibold text-green-600">Score:</p>
                <p className="text-xl">{result.score}/{result.totalQuestions}</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <p className="font-semibold text-blue-800">Date Attempted:</p>
                <p>{new Date(result.attemptedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            {result.answers.map((answer: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 border-r-4 ${
                  answer.isCorrect
                    ? theme === 'dark' ? 'border-green-400 bg-gray-900' : 'border-green-600 bg-green-100'
                    : theme === 'dark' ? 'border-red-400 bg-gray-900 ' : 'border-red-600 bg-red-100'
                }`}
              >
                {/* Question UI */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">
                    Question {index + 1}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      answer.isCorrect
                        ? theme === 'dark' ? 'bg-green-200 text-green-900' : 'bg-green-200 text-green-800'
                        : theme === 'dark' ? 'bg-red-200 text-red-500' : 'bg-red-200 text-red-500'
                    }`}
                  >
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p className="mb-4">{answer.question}</p>

                {/* Answers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-1">Your Answer</p>
                    <p className={`p-2 rounded border ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
                      {answer.userAnswer}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm  mb-1">Correct Answer</p>
                    <p className={`p-2 rounded border text-green-500 ${theme === 'dark' ? 'bg-gray-900 ' : 'bg-gray-200'}`}>
                      {answer.correctAnswer}
                    </p>
                  </div>
                </div>

                {/* Explanation Section */}
                <div className="mt-4">
                  <Button
                    onClick={() => handleExplanation(index, answer.question, answer.correctAnswer)}
                    disabled={generatingId === index}
                    variant="outline"
                    size="sm"
                    className={`${theme === 'dark' ? 'text-white border-blue-600 border-2 ' : ' bg-blue-600 hover:bg-blue-900 hover:text-white text-white'}`}
                  >
                    {generatingId === index ? 'Generating...' : 'Show Explanation'}
                  </Button>

                  {explanation[index] && (
                    <div className={`mt-2 p-4 rounded-lg ${theme === 'dark' ? 'border-blue-600 bg-gray-900 text-gray-50' : 'bg-gray-100'}`}>
                      <h4 className="font-semibold mb-2">Explanation</h4>
                      <p>{explanation[index]}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}