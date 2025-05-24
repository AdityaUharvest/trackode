"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizDashboard from "@/components/QuizesToPlay";

interface Quiz {
  _id: string;
  name: string;
  description: string;
  totalRegistrations: number;
  totalPlayed: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  userPlayed: boolean;
  userScore?: number;
  maxScore?: number;
  section?: string;
  level?: string;
}

interface MockTest {
  _id: string;
  title: string;
  durationMinutes: number;
  shareCode: string;
  quizAttempts?: any[];
  userPlayed?: number;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  createdAt?: string;
  tag: string;
  creator: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  attemptedAt: string;
  quiz?: { name: string };
}

export default function ProgrammingLanguageQuizzes() {
  const [publicQuizzes, setPublicQuizzes] = useState<Quiz[]>([]);
  const [userQuizzes, setUserQuizzes] = useState<Quiz[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First fetch public data (works for SEO)
        const publicResponse = await axios.get("/api/public-quizzes");
        setPublicQuizzes(publicResponse.data.quizes);
        const mockResponse = await axios.get("/api/mock-tests/getAll");
            if (!mockResponse.data) {
              throw new Error("Failed to fetch mock tests");
            }
            const testsWithPlayers = mockResponse.data.mocks.map((mock: MockTest) => ({
              ...mock,
              userPlayed: mock.userPlayed || Math.floor(Math.random() * 500) + 50,
              category: mock.category || "TCS",
              difficulty: mock.difficulty || ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
            }));
            setMockTests(testsWithPlayers);
        // Then fetch private data if in browser environment
        if (typeof window !== 'undefined') {
          try {
            // Fetch user-specific quiz data
            const quizResponse = await axios.get("/api/total-quizes");
            setUserQuizzes(quizResponse.data.quizes);

            // Fetch quiz results
            const resultsResponse = await axios.get("/api/attempted-public");
            setQuizResults(resultsResponse.data);

            // Fetch mock tests
            
          } catch (privateError) {
            console.log("User not authenticated, skipping private data");
          }
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combine public and user-specific quiz data
  const combinedQuizzes = publicQuizzes.map(publicQuiz => {
    const userQuiz = userQuizzes.find(uq => uq._id === publicQuiz._id);
    return userQuiz ? { ...publicQuiz, ...userQuiz } : publicQuiz;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm font-medium text-red-600">
          Error: {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizDashboard 
      quizzes={combinedQuizzes} 
      mockTests={mockTests} 
      quizResults={quizResults} 
    />
  );
}