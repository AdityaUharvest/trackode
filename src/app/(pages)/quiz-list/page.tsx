"use client";
import React, { useState, useEffect } from "react";
import { Metadata } from "next";
import axios from "axios";
import QuizDashboard from "@/components/QuizesToPlay";

// export const metadata: Metadata = {
//   title: "Programming Language Quizzes",
//   description:
//     "Explore a variety of quizzes and challenges to test your coding skills. Join now and start learning!",
//   keywords: ["coding quizzes", "programming challenges", "test your skills", "interactive quizzes"],
//   openGraph: {
//     title: "Quiz List | Trackode",
//     description:
//       "Explore a variety of quizzes and challenges to test your coding skills. Join now and start learning!",
//     url: "https://trackode.in/quiz-list",
//     type: "website",
//   },
// };

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
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  attemptedAt: string;
  quiz?: { name: string };
}

export default function Page() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch quizzes
        const quizResponse = await axios.get("/api/total-quizes");
        const quizData = quizResponse.data.quizes;
        setQuizzes(quizData);

        // Fetch quiz results
        const resultsResponse = await axios.get("/api/attempted-public");
        setQuizResults(resultsResponse.data);

        // Fetch mock tests
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

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900"
      >
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
    <QuizDashboard quizzes={quizzes} mockTests={mockTests} quizResults={quizResults} />
  );
}