import React from 'react'
export default async function QuizHistory({ results }: any) {
  return (
    <div>
      <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Attempts</h2>
          {results.length > 0 && (
            <a
              href="/dashboard/history"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              View Full History →
            </a>
          )}
        </div>
        {results.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No quiz attempts recorded yet</p>
            <a
              href="/quizzes"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Don't Take Your First Quiz this feature is coming soon
            </a>

          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result: any) => (
              <a
                key={result._id.toString()}
                href={`/dashboard/result/${result._id}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                      {result?.title || 'Deleted Quiz'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(result.attemptedAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {result.score}/{result.totalQuestions}
                    </div>
                    <div
                      className={`text-sm ${(result.score / result.totalQuestions) >= 0.7
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

    </div>
  )
}
