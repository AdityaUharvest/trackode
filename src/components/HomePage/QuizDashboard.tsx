"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import Link from "next/link";
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
      <div className={` ${containerStyles[theme]} transition-colors duration-300`}>
        <div className="container rounded-lg mx-auto px-3 py-4">
          

          <div className=" gap-6">
            <div className="flex-1">
             

              <div className="mb-16 mt-10">
                <div className="items-center mb-10 ">
                  <h2
                className={`text-3xl sm:text-4xl text-center font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Technology <span className='text-indigo-500'>We Cover</span> 
              </h2>
              <p className={`mt-2 max-w-2xl mx-auto text-center text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Explore our extensive tech stack quizzes and challenges
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
                    {Object.keys(organizedQuizzes).slice(0,8).map((section) => {
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

            

            
          </div>
          {/* CTA Button */}
          <div className="text-center">
             <Link
                                    href="/programming-quiz"
                                    className="inline-flex items-center justify-center px-6 py-3 hover:bg-indigo-500 hover:text-white text-indigo-500 bg-transparent border-indigo-600 border-2  font-semibold rounded-sm transition-colors duration-200"
                                >
                                    Explore All Quizzes
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
          </div>
                               
        </div>
      </div>
    </main>
  );
};

export default QuizDashboard;