"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Award,
  BarChart,
  Users,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

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

interface MockTestsListClientProps {
  initialTests: MockTest[];
}

export default function MockTestsListClient({
  initialTests,
}: MockTestsListClientProps) {
  const [mockTests] = useState<MockTest[]>(initialTests);
  const [filteredTests, setFilteredTests] = useState<MockTest[]>(initialTests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "Easy" | "Medium" | "Hard">(
    "all"
  );

  useEffect(() => {
    let results = mockTests;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (test) =>
          test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (test.category &&
            test.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply difficulty filter
    if (filter !== "all") {
      results = results.filter((test) => test.difficulty === filter);
    }

    setFilteredTests(results);
  }, [searchTerm, filter, mockTests]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (mockTests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm font-medium text-red-600">
          No mock tests available
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
    <>
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tests..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "Easy" | "Medium" | "Hard")
            }
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-sm mb-4">No mock tests found</div>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilter("all");
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((mock) => (
            <div
              key={mock._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-sm font-semibold text-gray-800">
                    {mock.title}
                  </h2>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                      mock.difficulty || ""
                    )}`}
                  >
                    {mock.difficulty}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    {mock.category || "TCS"}
                  </span>
                  {mock.createdAt && (
                    <span className="text-gray-500 text-sm">
                      {new Date(mock.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={16} className="mr-2 text-blue-500" />
                    {mock.durationMinutes || 60} mins
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    75 questions
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users size={16} className="mr-2 text-purple-500" />
                    {(mock.quizAttempts?.length || 0) + (mock.userPlayed || 0)}{" "}
                    students
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/playy/${mock.shareCode}`}
                    className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                  >
                    <Play size={18} className="mr-2" />
                    Play Now
                  </Link>

                  <div className="flex gap-3">
                    <Link
                      href={`/mock-tests/${mock._id}/user-results`}
                      className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded-lg transition duration-200 flex-1 border border-gray-200"
                    >
                      <BarChart size={16} className="mr-2 text-blue-500" />
                      Results
                    </Link>
                    <Link
                      href={`/mock-tests/${mock._id}/results`}
                      className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded-lg transition duration-200 flex-1 border border-gray-200"
                    >
                      <Award size={16} className="mr-2 text-yellow-500" />
                      Leaderboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-gray-500">
        Showing {filteredTests.length} of {mockTests.length} mock tests
      </div>
    </>
  );
}