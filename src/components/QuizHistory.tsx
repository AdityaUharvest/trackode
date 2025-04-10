import React from 'react';
import { useTheme } from './ThemeContext'; // Import the useTheme hook

export default function QuizHistory({ results }: any) {
  const { theme } = useTheme(); // Access the current theme

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-1 rounded-lg shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          Recent Attempts
        </h2>
        {/* {results.length > 0 && (
          <a
            href="/dashboard/history"
            className={`text-blue-600 hover:text-blue-700 text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            View Full History →
          </a>
        )} */}
      </div>
      {results.length === 0 ? (
        <div className={`text-center p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} mb-4`}>
            No quiz attempts recorded yet
          </p>
          <a
            href="/quiz-list"
            className={`inline-block ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-lg transition-colors`}
          >
            Check Avialable Quizzes
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result: any) => (
            <a
              key={result._id.toString()}
              href={`/dashboard/result/${result._id}`}
              className={`block p-4 border rounded-lg hover:shadow-md transition-shadow group ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-semibold group-hover:text-blue-600 transition-colors ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    {result?.title || 'Deleted Quiz'}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(result.attemptedAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-lg ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    {result.score}/{result.totalQuestions}
                  </div>
                  <div
                    className={`text-sm ${
                      (result.score / result.totalQuestions) >= 0.7
                        ? 'text-green-600'
                        : (result.score / result.totalQuestions) >= 0.5
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    ({(result.score / result.totalQuestions * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}