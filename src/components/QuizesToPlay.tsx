"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PerformanceChart from "./PerformanceChart";
import { Search, Filter } from "lucide-react";

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

interface UserStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  highestScore: number;
  recentScore: number;
  ranking: number;
  totalPlayers: number;
  accuracyTrend: string;
}

interface SectionLevels {
  [section: string]: {
    Easy: Quiz[];
    Medium: Quiz[];
    Hard: Quiz[];
    Other: Quiz[];
  };
}

type QuizFilter = "all" | "active" | "completed" | "ended";

interface Props {
  quizzes: Quiz[];
  mockTests: MockTest[];
  quizResults: QuizResult[];
}

const QuizDashboard = ({ quizzes, mockTests, quizResults }: Props) => {
  const { theme } = useTheme();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(quizzes);
  const [filteredMockTests, setFilteredMockTests] = useState<MockTest[]>(mockTests);
  const [searchTerm, setSearchTerm] = useState("");
  const [organizedQuizzes, setOrganizedQuizzes] = useState<SectionLevels>({});
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState<QuizFilter>("all");
  const [mockFilter, setMockFilter] = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [showStats, setShowStats] = useState(false);
  const [showPerformanceChart, setShowPerformanceChart] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
    recentScore: 0,
    ranking: 0,
    totalPlayers: 0,
    accuracyTrend: "stable",
  });

  // Theme-based styles
  const containerStyles = {
    light: "bg-gray-50 text-gray-800",
    dark: "bg-gray-900 text-gray-100",
  };

  const cardStyles = {
    light: "bg-white border-gray-200",
    dark: "bg-gray-800 border-gray-700",
  };

  const textStyles = {
    light: {
      primary: "text-gray-800",
      secondary: "text-gray-600",
      muted: "text-gray-400",
    },
    dark: {
      primary: "text-gray-100",
      secondary: "text-gray-300",
      muted: "text-gray-500",
    },
  };

  // Organize quizzes by section and level
  const organizeQuizzesBySectionAndLevel = (quizList: Quiz[]) => {
    const organized: SectionLevels = {};
    quizList.forEach((quiz) => {
      const match = quiz.name.match(/\(([^)]+)\)\s*-\s*(\w+)/);
      if (match) {
        const section = match[1].trim();
        const level = match[2].trim();
        if (!organized[section]) {
          organized[section] = { Easy: [], Medium: [], Hard: [], Other: [] };
        }
        if (["Easy", "Medium", "Hard"].includes(level)) {
          organized[section][level as "Easy" | "Medium" | "Hard"].push({
            ...quiz,
            section,
            level,
          });
        } else {
          organized[section].Other.push({ ...quiz, section, level: "Other" });
        }
      } else {
        const section = "Uncategorized";
        if (!organized[section]) {
          organized[section] = { Easy: [], Medium: [], Hard: [], Other: [] };
        }
        organized[section].Other.push({ ...quiz, section, level: "Other" });
      }
    });
    return organized;
  };

  // Calculate user stats and organize quizzes on mount
  useEffect(() => {
    const organized = organizeQuizzesBySectionAndLevel(quizzes);
    setOrganizedQuizzes(organized);

    // Initialize expanded sections
    const expanded: { [key: string]: boolean } = {};
    Object.keys(organized).forEach((section) => {
      expanded[section] = false;
    });
    setExpandedSections(expanded);

    // Calculate stats
    const totalQuizzes = quizzes.length;
    const percentages = quizResults.map((result) =>
      Number(((result.score / result.totalQuestions) * 100).toFixed(1))
    );
    let accuracyTrend = "stable";
    if (totalQuizzes >= 3 && percentages.length >= 3) {
      const firstHalf = percentages.slice(0, Math.floor(percentages.length / 2));
      const secondHalf = percentages.slice(Math.floor(percentages.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      accuracyTrend = secondAvg > firstAvg ? "improving" : secondAvg < firstAvg ? "declining" : "stable";
    }

    setUserStats({
      totalQuizzes,
      completedQuizzes: quizResults.filter((r) => r.score !== undefined).length,
      averageScore: totalQuizzes > 0 ? Number((percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(1)) || 0 : 0,
      highestScore: totalQuizzes > 0 ? Math.max(...percentages, 0) : 0,
      recentScore: totalQuizzes > 0 && percentages.length > 0 ? percentages[0] : 0,
      ranking: 42,
      totalPlayers: 500,
      accuracyTrend,
    });

    setFilteredQuizzes(quizzes);
    setFilteredMockTests(mockTests);
  }, [quizzes, quizResults, mockTests]);

  // Filter quizzes and mock tests based on search and filters
  useEffect(() => {
    let filtered = quizzes;
    if (searchTerm) {
      filtered = filtered.filter((quiz) =>
        quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (activeFilter) {
      case "active":
        filtered = filtered.filter((quiz) => quiz.active);
        break;
      case "completed":
        filtered = filtered.filter((quiz) => quiz.userPlayed);
        break;
      case "ended":
        filtered = filtered.filter((quiz) => !quiz.active && new Date(quiz.endDate) < new Date());
        break;
    }
    setFilteredQuizzes(filtered);
    const organized = organizeQuizzesBySectionAndLevel(filtered);
    setOrganizedQuizzes(organized);

    let filteredMocks = mockTests;
    if (searchTerm) {
      filteredMocks = filteredMocks.filter(
        (test) =>
          test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (test.category && test.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (mockFilter !== "all") {
      filteredMocks = filteredMocks.filter((test) => test.difficulty === mockFilter);
    }
    setFilteredMockTests(filteredMocks);
  }, [searchTerm, activeFilter, mockFilter, quizzes, mockTests]);

  const chartData = quizResults
    .map((result) => ({
      date: new Date(result.attemptedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      percentage: Number(((result.score / result.totalQuestions) * 100).toFixed(1)),
      fullDate: new Date(result.attemptedAt).toLocaleDateString(),
      score: result.score,
      quiz: result.quiz?.name,
      total: result.totalQuestions,
    }))
    .reverse();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <span className="text-green-500">↑</span>;
      case "declining":
        return <span className="text-red-500">↓</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const getAchievementLevel = () => {
    const completionRate = (userStats.completedQuizzes / userStats.totalQuizzes) * 100;
    const averageScore = userStats.averageScore;
    if (completionRate >= 80 && averageScore >= 85) return "Quiz Master";
    if (completionRate >= 60 || averageScore >= 70) return "Advanced";
    if (completionRate >= 40 || averageScore >= 50) return "Intermediate";
    if (completionRate >= 20 || averageScore >= 30) return "Beginner";
    return "Newbie";
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
  const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": quizzes.map((quiz, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Quiz",
      "name": quiz.name,
      "description": quiz.description,
      "educationalLevel": quiz.level || "Beginner",
      "numberOfQuestions": quiz.maxScore || 10,
      "dateCreated": quiz.startDate,
      "creator": {
        "@type": "Organization",
        "name": "Your Quiz Platform"
      }
    }
  }))
};

  return (
  <main>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
 <div className={`min-h-screen ${containerStyles[theme]} transition-colors duration-300`}>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        {userStats.completedQuizzes > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`flex w-full justify-between items-center gap-2 mb-4 px-4 py-2 rounded-lg ${
                theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              <span className="font-medium">{showStats ? "Hide Stats" : "Show Stats"}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showStats ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {/* Completion Rate */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
                >
                  <h3 className={`text-lg text-center font-semibold mb-4 ${textStyles[theme].primary}`}>
                    Completion
                  </h3>
                  <div className="relative h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className={theme === "dark" ? "text-gray-700" : "text-gray-200"}
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="8"
                        strokeDasharray={`${(userStats.completedQuizzes / userStats.totalQuizzes) * 251} 251`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className={`text-2xl font-bold block ${textStyles[theme].primary}`}>
                        {userStats.totalQuizzes > 0
                          ? Math.round((userStats.completedQuizzes / userStats.totalQuizzes) * 100)
                          : 0}
                        %
                      </span>
                      <span className={`text-xs block ${textStyles[theme].muted}`}>
                        {userStats.completedQuizzes} / {userStats.totalQuizzes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Average Score */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                    Average Score
                  </h3>
                  <div className="flex items-end mb-2">
                    <p className={`text-3xl font-bold mr-2 ${textStyles[theme].primary}`}>
                      {userStats.averageScore}
                    </p>
                    <span className={textStyles[theme].muted}>%</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm mr-2 ${textStyles[theme].muted}`}>Trend:</span>
                    {getTrendIcon(userStats.accuracyTrend)}
                    <span
                      className={`text-sm ml-1 capitalize ${
                        userStats.accuracyTrend === "improving"
                          ? "text-green-500"
                          : userStats.accuracyTrend === "declining"
                          ? "text-red-500"
                          : textStyles[theme].secondary
                      }`}
                    >
                      {userStats.accuracyTrend}
                    </span>
                  </div>
                </div>

                {/* Achievement */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                    Achievement
                  </h3>
                  <div className="flex items-center">
                    <p className={`text-xl font-bold mr-2 ${textStyles[theme].primary}`}>
                      {getAchievementLevel()}
                    </p>
                    <span className="text-xl">✨</span>
                  </div>
                </div>

                {/* Highest Score */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                    Highest Score
                  </h3>
                  <div className="flex items-end mb-2">
                    <p className={`text-3xl font-bold mr-2 ${textStyles[theme].primary}`}>
                      {userStats.highestScore}
                    </p>
                    <span className={textStyles[theme].muted}>%</span>
                  </div>
                  <div>
                    <span className={`text-sm ${textStyles[theme].muted}`}>Your personal best</span>
                  </div>
                </div>

                {/* Recent Performance */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                    Recent Score
                  </h3>
                  <div className="flex items-end mb-2">
                    <p
                      className={`text-3xl font-bold mr-2 ${
                        userStats.recentScore >= 80
                          ? "text-green-500"
                          : userStats.recentScore >= 50
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {userStats.recentScore}
                    </p>
                    <span className={textStyles[theme].muted}>%</span>
                  </div>
                  <div>
                    <span className={`text-sm ${textStyles[theme].muted}`}>Latest attempt</span>
                  </div>
                </div>
              </div>
            )}

            
          </div>
        )}

        {/* Quizzes and Mock Tests Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          

          {/* Quizzes and Mock Tests Content */}
          <div className="flex-1">
            {/* Quizzes Section */}
           {/* Compact Filtering Section */}
<div className="mb-6">
  <div className="flex flex-col md:flex-row md:items-center gap-4">
    {/* Search Input - Always visible */}
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="text-gray-400" size={16} />
      </div>
      <input
        type="text"
        placeholder="Search quizzes or mock tests..."
        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
          theme === "dark"
            ? "bg-gray-700 border-gray-600 focus:ring-blue-500 text-white"
            : "bg-white border-gray-300 focus:ring-blue-400 text-gray-800"
        }`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Mobile Filter Toggle */}
<div className="md:hidden">
  <button
    onClick={() => setShowMobileFilters(!showMobileFilters)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full justify-center ${
      theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    <Filter size={16} />
    <span>Filters</span>
  </button>
</div>

    

    {/* Desktop Filters - Always visible */}
    <div className="hidden md:flex gap-2">
      {/* Quiz Status Filter Dropdown */}
      <div className="relative">
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as QuizFilter)}
          className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 focus:ring-blue-500 text-white"
              : "bg-white border-gray-300 focus:ring-blue-400 text-gray-800"
          }`}
        >
          <option value="all">All Quizzes</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="ended">Ended</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Difficulty Filter Dropdown */}
      <div className="relative">
        <select
          value={difficultyFilter}
          onChange={(e) => {
            setDifficultyFilter(e.target.value);
            setMockFilter(e.target.value as any);
          }}
          className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 focus:ring-blue-500 text-white"
              : "bg-white border-gray-300 focus:ring-blue-400 text-gray-800"
          }`}
        >
          <option value="all">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
{/* Mobile Filters - Expandable */}
{showMobileFilters && (
  <div className="md:hidden space-y-2">
    <div className="grid grid-cols-2 gap-2">
      {/* Quiz Status Filter */}
      <div>
        <label className={`block text-xs font-medium mb-1 ${textStyles[theme].secondary}`}>
          Quiz Status
        </label>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as QuizFilter)}
          className={`w-full pl-2 pr-6 py-1.5 rounded text-xs border ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="ended">Ended</option>
        </select>
      </div>

      {/* Difficulty Filter */}
      <div>
        <label className={`block text-xs font-medium mb-1 ${textStyles[theme].secondary}`}>
          Difficulty
        </label>
        <select
          value={difficultyFilter}
          onChange={(e) => {
            setDifficultyFilter(e.target.value);
            setMockFilter(e.target.value as any);
          }}
          className={`w-full pl-2 pr-6 py-1.5 rounded text-xs border ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          <option value="all">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>
  </div>
)}
    {/* Mobile Filters - Expandable */}
    {showStats && (
      <div className="md:hidden space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Quiz Status Filter */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${textStyles[theme].secondary}`}>
              Quiz Status
            </label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as QuizFilter)}
              className={`w-full pl-2 pr-6 py-1.5 rounded text-xs border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${textStyles[theme].secondary}`}>
              Difficulty
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setMockFilter(e.target.value as any);
              }}
              className={`w-full pl-2 pr-6 py-1.5 rounded text-xs border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option value="all">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

            <div className="space-y-2 ">
              {Object.keys(organizedQuizzes).map((section) => (
                <div
                  key={section}
                  className={`rounded-xl shadow-sm border overflow-hidden transition-all duration-200 ${cardStyles[theme]}`}
                >
                  <div
                    className={`flex p-5 justify-between items-center cursor-pointer transition-all duration-200 ${
                      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleSection(section)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`text-lg font-bold ${
                            theme === "dark" ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {section.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-base text-blue-600 font-semibold">{section}</h3>
                      <span
                        className={`ml-2 text-xs px-2 py-1 rounded-full transition-all ${
                          theme === "dark" ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {Object.values(organizedQuizzes[section]).reduce(
                          (acc, levelQuizzes) => acc + levelQuizzes.length,
                          0
                        )}{" "}
                        quizzes
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        expandedSections[section] ? "rotate-180" : ""
                      } ${textStyles[theme].secondary}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {expandedSections[section] && (
                    <div className="divide-y divide-gray-200 animate-fadeIn">
                      {(["Easy", "Medium", "Hard", "Other"] as const).map((level) => {
                        if (
                          organizedQuizzes[section][level].length === 0 ||
                          (difficultyFilter !== "all" && difficultyFilter !== level.toLowerCase())
                        )
                          return null;

                        return (
                          <div key={`${section}-${level}`} className="p-2">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                              {organizedQuizzes[section][level].map((quiz) => (
                                <div
                                  key={quiz._id}
                                  className={`p-5 border-s-4 border-green-500 rounded-lg shadow-md ${
                                    theme === "dark" ? "bg-gray-700 hover:bg-gray-650" : "bg-gray-50 hover:bg-white"
                                  } transition-all duration-200 hover:shadow-lg`}
                                >
                                  <div className="flex justify-between items-center">
                                    <h4
                                      className={`font-semibold text-sm ${
                                        theme === "dark" ? "text-white" : "text-gray-900"
                                      }`}
                                    >
                                      {quiz.name}
                                    </h4>
                                    <span
                                      className={`text-xs flex items-center ${
                                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                                      }`}
                                    >
                                      <svg
                                        className="w-3.5 h-3.5 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        ></path>
                                      </svg>
                                      {quiz.totalRegistrations} players
                                    </span>
                                  </div>
                                  <p
                                    className={`text-sm mt-2 font-sans font-medium text-green-600 dark:text-green-400`}
                                  >
                                    {quiz.userPlayed ? `Your Score: ${quiz.userScore}/${quiz.maxScore}` : ""}
                                  </p>
                                  
                                  <div className="mt-4 flex justify-between items-center">
  {quiz.userPlayed ? (
    <>
      <span className={`text-xs font-semibold flex items-center ${
        theme === "dark" ? "text-green-400" : "text-green-600"
      }`}>
        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Completed
      </span>
      <div className="flex gap-3">
        <Link href={`/quiz-result/${quiz._id}`} className="text-xs p-2 text-white bg-green-400 rounded-lg ${
      
        ">
          Leaderboard
        </Link>
        <Link href={`/dashboard/result/${quiz._id}`} className={`px-4 py-1.5 text-xs font-medium rounded-lg ${
          theme === "dark" ? "bg-purple-600 hover:bg-purple-500 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
        } transition-colors shadow-sm hover:shadow flex items-center`}>
          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Result
        </Link>
      </div>
    </>
  ) : (
    <Link
      href={`/quiz-play/${quiz._id}`}
      aria-label={`Start ${quiz.name} quiz`}
      className={`w-full text-center px-4 py-2 text-sm font-medium rounded-lg ${
        theme === "dark" 
          ? "bg-green-600 hover:bg-green-500 text-white" 
          : "bg-green-600 hover:bg-green-700 text-white"
      } transition-colors shadow-sm hover:shadow flex items-center justify-center`}
    >
      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Start Quiz
    </Link>
  )}
</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mock Tests Section */}
            <div className="mt-12">
              <div className="flex gap-2 ml-2 items-center mb-6">
                <svg
                  className={`w-7 h-7 ${theme === "dark" ? "text-white" : "text-blue-600"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h2 className="text-xl font-bold text-blue-500">TCS Mock Tests</h2>
              </div>

              {filteredMockTests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-sm mb-4">No mock tests found</div>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setMockFilter("all");
                      setDifficultyFilter("all");
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredMockTests.map((mock) => (
                    <div
                      key={mock._id}
                      className={`rounded-xl shadow-lg overflow-hidden border transition-all duration-200 hover:shadow-xl ${
                        theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className={`text-sm font-semibold ${textStyles[theme].primary}`}>
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
                              theme === "dark" ? "bg-blue-700 text-blue-200" : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {mock.category || "TCS"}
                          </span>
                          {mock.createdAt && (
                            <span className={`text-sm ${textStyles[theme].muted}`}>
                              {new Date(mock.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className={`flex items-center text-sm ${textStyles[theme].secondary}`}>
                            <svg
                              className="w-4 h-4 mr-2 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {mock.durationMinutes || 60} mins
                          </div>
                          <div className={`flex items-center text-sm ${textStyles[theme].secondary}`}>
                            <svg
                              className="w-4 h-4 mr-2 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            75 questions
                          </div>
                          <div className={`flex items-center text-sm ${textStyles[theme].secondary}`}>
                            <svg
                              className="w-4 h-4 mr-2 text-purple-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            {(mock.quizAttempts?.length || 0) + (mock.userPlayed?mock.userPlayed:0)} students
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Link
                            href={`/playy/${mock.shareCode}`}
                            className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg ${
                              theme === "dark"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                            }`}
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Play Now
                          </Link>

                          <div className="flex gap-3">
                            <Link
                              href={`/mock-tests/${mock._id}/user-results`}
                              className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 flex-1 border ${
                                theme === "dark"
                                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200"
                              }`}
                            >
                              <svg
                                className="w-4 h-4 mr-2 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                              Results
                            </Link>
                            <Link
                              href={`/mock-tests/${mock._id}/results`}
                              className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 flex-1 border ${
                                theme === "dark"
                                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200"
                              }`}
                            >
                              <svg
                                className="w-4 h-4 mr-2 text-yellow-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 9.143m-3.143 7.714L20 21m-2-2h-4m-5 0H5m4-6l-2.286-6.857L3 9.143"
                                />
                              </svg>
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
                Showing {filteredMockTests.length} of {mockTests.length} mock tests
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Link href="/contact">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Contact Us for More Quizzes
                </button>
              </Link>
              <Link href="/quiz-setup">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  Contribute More Quizzes
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
   
  );
};

export default QuizDashboard;