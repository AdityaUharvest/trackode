"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import {
  Clock,
  Play,
  Award,
  BarChart,
  Users,
  CheckCircle,
  Search,
  Filter,
  User,
  X
} from "lucide-react";

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

const languageLogos: Record<string, string> = {
  C: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  CPP: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  "React.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  "HTML/CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  AWS: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonaws.svg",
  DSA: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/codepen/codepen-original.svg",
  DBMS: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
};

const getLanguageLogo = (section: string) => {
  if (!section) return null;
  const normalizedSection = section.trim().toLowerCase();
  const languageMap: Record<string, string> = {
    java: languageLogos["Java"],
    javascript: languageLogos["JavaScript"],
    python: languageLogos["Python"],
    c: languageLogos["C"],
    cpp: languageLogos["CPP"],
    "c++": languageLogos["CPP"],
    "react.js": languageLogos["React.js"],
    "node.js": languageLogos["Node.js"],
    typescript: languageLogos["TypeScript"],
    sql: languageLogos["SQL"],
    html: languageLogos["HTML/CSS"],
    css: languageLogos["HTML/CSS"],
    git: languageLogos["Git"],
    docker: languageLogos["Docker"],
    aws: languageLogos["AWS"],
    dsa: languageLogos["DSA"],
    dbms: languageLogos["DBMS"],
  };
  return languageMap[normalizedSection] || null;
};

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
  const [showStats, setShowStats] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

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
          ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-indigo-400 focus:border-indigo-400"
          : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500";
      case "button-primary":
        return theme === "dark"
          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
          : "bg-indigo-500 hover:bg-indigo-600 text-white";
      case "button-secondary":
        return theme === "dark"
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
          : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200";
      case "text-muted":
        return theme === "dark" ? "text-gray-400" : "text-gray-500";
      case "creator":
        return theme === "dark"
          ? "bg-purple-900 text-purple-300"
          : "bg-purple-100 text-purple-800";
      case "modal":
        return theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-white text-gray-800";
      default:
        return "";
    }
  };

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
        console.log(`No match for quiz: ${quiz.name}`);
        const section = "Uncategorized";
        if (!organized[section]) {
          organized[section] = { Easy: [], Medium: [], Hard: [], Other: [] };
        }
        organized[section].Other.push({ ...quiz, section, level: "Other" });
      }
    });
    return organized;
  };

  useEffect(() => {
    const organized = organizeQuizzesBySectionAndLevel(quizzes);
    setOrganizedQuizzes(organized);

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

  const openModal = (section: string) => {
    setSelectedSection(section);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSection(null);
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

  const getSectionColor = (section: string) => {
    const lowerSection = section.toLowerCase();
    if (lowerSection.includes("java")) return "bg-indigo-100 text-indigo-800";
    if (lowerSection.includes("python")) return "bg-indigo-100 text-indigo-800";
    if (lowerSection.includes("c++") || lowerSection.includes("cpp")) return "bg-indigo-200 text-indigo-900";
    if (lowerSection.includes("javascript")) return "bg-yellow-100 text-yellow-800";
    if (lowerSection.includes("sql")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
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
        <div className="container rounded-lg mx-auto px-3 py-4">
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
                  <div
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
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
                          className="text-indigo-500"
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

                  <div
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
                  >
                    <h3 className={`text-lg font-semibold mb-2 ${textStyles[theme].primary}`}>
                      Average Score
                    </h3>
                    <div className="flex items-end mb-2">
                      <p className={`text-3xl font-bold mr-2 ${textStyles[theme].primary}`}>
                        {userStats.averageScore.toFixed(1)}
                      </p>
                      <span className={textStyles[theme].muted}>%</span>
                    </div>
                    <div>
                      <span className={`text-sm ${textStyles[theme].muted}`}>Across all quizzes</span>
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

                  <div
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
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

                  <div
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
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

                  <div
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${cardStyles[theme]}`}
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

          <div className=" gap-6">
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search quizzes or mock tests..."
                      className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${getThemeClasses("input")}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

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

                  <div className="hidden md:flex gap-2">
                    <div className="relative">
                      <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value as QuizFilter)}
                        className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 ${getThemeClasses("input")}`}
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

                    <div className="relative">
                      <select
                        value={difficultyFilter}
                        onChange={(e) => {
                          setDifficultyFilter(e.target.value);
                          setMockFilter(e.target.value as any);
                        }}
                        className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 ${getThemeClasses("input")}`}
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
                </div>

                {showMobileFilters && (
                  <div className="md:hidden space-y-2 mt-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textStyles[theme].secondary}`}>
                          Quiz Status
                        </label>
                        <select
                          value={activeFilter}
                          onChange={(e) => setActiveFilter(e.target.value as QuizFilter)}
                          className={`w-full pl-2 pr-6 py-1.5 rounded text-sm border ${getThemeClasses("input")}`}
                        >
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="ended">Ended</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-1 ${textStyles[theme].secondary}`}>
                          Difficulty
                        </label>
                        <select
                          value={difficultyFilter}
                          onChange={(e) => {
                            setDifficultyFilter(e.target.value);
                            setMockFilter(e.target.value as any);
                          }}
                          className={`w-full pl-2 pr-6 py-1.5 rounded text-sm border ${getThemeClasses("input")}`}
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

              <div className="mb-16 mt-10">
                <div className="items-center mb-10">
                  <h2 className={`text-2xl text-center font-bold ${textStyles[theme].primary}`}>
                    Programming Quizzes
                  </h2>
                  <p className={`text-center text-sm ${textStyles[theme].secondary}`}>
                    Explore quizzes across various programming languages and levels
                  </p>
                </div>

                {Object.keys(organizedQuizzes).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-sm mb-4">No quizzes found matching your criteria</div>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setActiveFilter("all");
                        setDifficultyFilter("all");
                      }}
                      className={`px-6 py-2 rounded-lg transition ${getThemeClasses("button-primary")}`}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Object.keys(organizedQuizzes).map((section) => {
                      const sectionLogo = getLanguageLogo(section);
                      return (
                        <div
                          key={section}
                          className={`rounded-lg shadow-sm border overflow-hidden transition-all duration-200 cursor-pointer ${cardStyles[theme]}`}
                          onClick={() => openModal(section)}
                        >
                          <div
                            className={`flex p-7 items-center transition-all duration-200 ${
                              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center w-full">
                              {sectionLogo ? (
                                <div className="flex items-center justify-center rounded-lg mr-3 overflow-hidden">
                                  <img
                                    src={sectionLogo}
                                    alt={`${section} logo`}
                                    className="w-12 h-12"
                                    onError={() => console.error(`Failed to load logo for ${section}: ${sectionLogo}`)}
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${
                                    theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                                  }`}
                                >
                                  <span
                                    className={`text-lg font-bold ${textStyles[theme].primary}`}
                                  >
                                    {section.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col flex-1">
                                <h3 className={`text-lg font-bold ${textStyles[theme].primary}`}>
                                  {section}
                                </h3>
                                <div className="flex gap-2 mt-1">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-lg ${getSectionColor(section)}`}
                                  >
                                    {Object.values(organizedQuizzes[section]).reduce(
                                      (acc, levelQuizzes) => acc + levelQuizzes.length,
                                      0
                                    )}{" "}
                                    quizzes
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {modalOpen && selectedSection && (
                <div className="fixed inset-0 px-2 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div
                    className={`rounded-sm   w-full max-w-3xl max-h-[70vh] overflow-y-auto ${getThemeClasses("modal")} shadow-2xl border border-indigo-200`}
                  >
                    <div className="p-3 sticky bg-indigo-100  top-0 z-10 border-b border-indigo-200">
                      <div className="flex justify-between items-center">
                        <h2 className={`text-lg font-bold  ${textStyles[theme].primary} dark:text-neutral-600`}>
                          {selectedSection} Quizzes
                        </h2>
                        <button
                          onClick={closeModal}
                          className="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                        >
                          <X size={24} className="text-indigo-600 dark:text-indigo-400" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      {(["Easy", "Medium", "Hard", "Other"] as const).map((level) => {
                        if (
                          organizedQuizzes[selectedSection][level].length === 0 ||
                          (difficultyFilter !== "all" && difficultyFilter !== level.toLowerCase())
                        )
                          return null;

                        return (
                          <div key={`${selectedSection}-${level}`} className="mb-6">
                            <div className="flex items-center mb-3">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-lg ${getDifficultyColor(level)}`}
                              >
                                {level}
                              </span>
                              <span className={`text-xs ml-2 ${textStyles[theme].muted}`}>
                                {organizedQuizzes[selectedSection][level].length} quizzes
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {organizedQuizzes[selectedSection][level].map((quiz) => (
                                <div
                                  key={quiz._id}
                                  className={`p-5 border-l-4 ${
                                    level === "Easy"
                                      ? "border-green-500"
                                      : level === "Medium"
                                      ? "border-yellow-500"
                                      : level === "Hard"
                                      ? "border-red-500"
                                      : "border-gray-500"
                                  } rounded-lg shadow-md ${
                                    theme === "dark" ? "bg-gray-700 hover:bg-gray-650" : "bg-gray-50 hover:bg-white"
                                  } transition-all duration-200 hover:shadow-lg`}
                                >
                                  <div className="flex justify-between items-start">
                                    <h4
                                      className={`font-semibold text-sm ${textStyles[theme].primary}`}
                                    >
                                      {quiz.name.replace("(", "").replace(")", "").trim()}
                                    </h4>
                                    <span
                                      className={`text-xs flex items-center ${textStyles[theme].muted}`}
                                    >
                                      <Users size={14} className="mr-1" />
                                      {quiz.totalRegistrations} players
                                    </span>
                                  </div>
                                  {quiz.userPlayed && (
                                    <p
                                      className={`text-sm mt-2 font-medium ${
                                        level === "Easy"
                                          ? "text-green-600 dark:text-green-400"
                                          : level === "Medium"
                                          ? "text-yellow-600 dark:text-yellow-400"
                                          : level === "Hard"
                                          ? "text-red-600 dark:text-red-400"
                                          : "text-gray-600 dark:text-gray-400"
                                      }`}
                                    >
                                      Your Score: {quiz.userScore}/{quiz.maxScore}
                                    </p>
                                  )}
                                  <div className="mt-4 flex justify-between items-center">
                                    {quiz.userPlayed ? (
                                      <>
                                        <span
                                          className={`text-xs font-semibold flex items-center ${
                                            level === "Easy"
                                              ? "text-green-600 dark:text-green-400"
                                              : level === "Medium"
                                              ? "text-yellow-600 dark:text-yellow-400"
                                              : level === "Hard"
                                              ? "text-red-600 dark:text-red-400"
                                              : "text-gray-600 dark:text-gray-400"
                                          }`}
                                        >
                                          <CheckCircle size={14} className="mr-1" />
                                          Completed
                                        </span>
                                        <div className="flex gap-2">
                                          <Link
                                            href={`/quiz-result/${quiz._id}`}
                                            className={`text-xs px-3 py-1.5 rounded-lg ${getThemeClasses("button-secondary")}`}
                                          >
                                            Leaderboard
                                          </Link>
                                          <Link
                                            href={`/dashboard/result/${quiz._id}`}
                                            className={`px-4 py-1.5 text-xs font-medium rounded-lg ${getThemeClasses("button-primary")} flex items-center`}
                                          >
                                            <svg
                                              className="w-3.5 h-3.5 mr-1"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                              />
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                              />
                                            </svg>
                                            Result
                                          </Link>
                                        </div>
                                      </>
                                    ) : (
                                      <Link
                                        href={`/quiz-play/${quiz._id}`}
                                        aria-label={`Start ${quiz.name} quiz`}
                                        className={`mt-5 text-center px-4 py-2 text-sm font-medium rounded-lg ${getThemeClasses(
                                          "button-primary"
                                        )} flex items-center justify-center`}
                                      >
                                        <svg
                                          className="w-3.5 h-3.5 mr-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
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
                  </div>
                </div>
              )}
            </div>

            <div className="mt-16">
              <div className="items-center mb-6">
                <h1 className={`text-2xl text-center font-bold ${textStyles[theme].primary}`}>
                  Free Mock Tests
                </h1>
                <p className={`text-sm text-center ${textStyles[theme].muted}`}>
                  Explore our collection of free mock tests to prepare for your next coding interview or exam.
                </p>
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
                    className={`px-6 py-2 rounded-lg ${getThemeClasses("button-primary")}`}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMockTests.map((mock) => (
                    <div
                      key={mock._id}
                      className={`rounded-lg shadow-lg overflow-hidden border ${getThemeClasses("card")} ${getThemeClasses("card-hover")} transition-shadow duration-300`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-base font-semibold">{mock.title}</h2>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(mock.difficulty || "")}`}
                          >
                            {mock.difficulty}
                          </span>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-1 items-center">
                          <span
                            className={`inline-block text-xs px-2 py-1 rounded mr-2 ${
                              theme === "dark" ? "bg-indigo-900 text-indigo-300" : "bg-indigo-100 text-indigo-800"
                            }`}
                          >
                            {mock.tag || "TCS"}
                          </span>
                          
                          {mock.createdAt && (
                            <span className={getThemeClasses("text-muted") + " text-sm"}>
                              {new Date(mock.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                            <Clock size={16} className="mr-2 text-indigo-500" />
                            {mock.durationMinutes || 60} mins
                          </div>
                          <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                            <CheckCircle size={16} className="mr-2 text-green-500" />
                            75 questions
                          </div>
                          <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                            <Users size={16} className="mr-2 text-indigo-500" />
                            {(mock.quizAttempts?.length || 0) + (mock.userPlayed || 0)} students
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Link
                            href={`/assessment/${mock.shareCode}/${slugify(mock.title)}`}
                            className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-200 border-indigo-500 border-2 hover:shadow-lg  bg-transparent hover:bg-indigo-600 text-indigo-700 hover:text-white font-medium`}
                          >
                            <Play size={18} className="mr-2" />
                            Play Now
                          </Link>

                         
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

            <div className="lg:flex lg:justify-between mt-6">
              <Link href="/contact">
                <button
                  className={`px-4 w-full mb-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getThemeClasses("button-primary")}`}
                >
                  Contact Us for More Quizzes
                </button>
              </Link>
              <Link href="/quiz-setup">
                <button
                  className={`px-4 py-2 w-full rounded-lg text-sm font-medium transition-all duration-200 ${
                    theme === "dark" ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
                >
                  Contribute More Quizzes
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QuizDashboard;