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
import { useTheme } from "./ThemeContext"; // Adjust the import path based on your file structure

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
  const { theme } = useTheme(); // Access the current theme
  const [mockTests] = useState<MockTest[]>(initialTests);
  const [filteredTests, setFilteredTests] = useState<MockTest[]>(initialTests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "Easy" | "Medium" | "Hard">("all");

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
        return theme === "dark"
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800";
      case "Medium":
        return theme === "dark"
          ? "bg-yellow-900 text-yellow-300"
          : "bg-yellow-100 text-yellow-800";
      case "Hard":
        return theme === "dark"
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-800";
      default:
        return theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get theme-based classes
  const getThemeClasses = (type: string) => {
    switch (type) {
      case "card":
        return theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-200"
          : "bg-white border-gray-200 text-gray-800";
      case "card-hover":
        return theme === "dark" ? "hover:shadow-gray-900" : "hover:shadow-gray-300";
      case "input":
        return theme === "dark"
          ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-400 focus:border-blue-400"
          : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500";
      case "button-primary":
        return theme === "dark"
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white";
      case "button-secondary":
        return theme === "dark"
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
          : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200";
      case "text-muted":
        return theme === "dark" ? "text-gray-400" : "text-gray-500";
      default:
        return "";
    }
  };

  if (mockTests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-sm font-medium ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
          No mock tests available
          <button
            onClick={() => window.location.reload()}
            className={`ml-4 px-4 py-2 ${getThemeClasses("button-primary")} rounded transition`}
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
            <Search className={getThemeClasses("text-muted")} />
          </div>
          <input
            type="text"
            placeholder="Search tests..."
            className={`pl-10 pr-4 py-2 w-full rounded-lg ${getThemeClasses("input")}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className={getThemeClasses("text-muted")} />
          <select
            className={`px-4 py-2 rounded-lg ${getThemeClasses("input")}`}
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
          <div className={`text-sm mb-4 ${getThemeClasses("text-muted")}`}>
            No mock tests found
          </div>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilter("all");
            }}
            className={`px-6 py-2 ${getThemeClasses("button-primary")} rounded-lg transition`}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((mock) => (
            <div
              key={mock._id}
              className={`rounded-xl shadow-lg overflow-hidden border ${getThemeClasses(
                "card"
              )} ${getThemeClasses("card-hover")} transition-shadow duration-300`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-sm font-semibold">
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
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded mr-2 ${
                      theme === "dark"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {mock.category || "TCS"}
                  </span>
                  {mock.createdAt && (
                    <span className={getThemeClasses("text-muted") + " text-sm"}>
                      {new Date(mock.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                    <Clock size={16} className="mr-2 text-blue-500" />
                    {mock.durationMinutes || 60} mins
                  </div>
                  <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    75 questions
                  </div>
                  <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                    <Users size={16} className="mr-2 text-purple-500" />
                    {(mock.quizAttempts?.length || 0) + (mock.userPlayed || 0)}{" "}
                    students
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/playy/${mock.shareCode}`}
                    className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg ${getThemeClasses(
                      "button-primary"
                    )}`}
                  >
                    <Play size={18} className="mr-2" />
                    Play Now
                  </Link>

                  <div className="flex gap-3">
                    <Link
                      href={`/mock-tests/${mock._id}/user-results`}
                      className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 flex-1 border ${getThemeClasses(
                        "button-secondary"
                      )}`}
                    >
                      <BarChart size={16} className="mr-2 text-blue-500" />
                      Results
                    </Link>
                    <Link
                      href={`/mock-tests/${mock._id}/results`}
                      className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 flex-1 border ${getThemeClasses(
                        "button-secondary"
                      )}`}
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

      <div className={`mt-8 text-center ${getThemeClasses("text-muted")}`}>
        Showing {filteredTests.length} of {mockTests.length} mock tests
      </div>
    </>
  );
}