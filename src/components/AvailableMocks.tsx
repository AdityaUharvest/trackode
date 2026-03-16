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
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface MockTest {
  _id: string;
  title: string;
  durationMinutes: number;
  shareCode: string;
  attemptCount?: number;
  userPlayed?: number;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  createdAt?: string;
  tag: string;
  creator: string;
  sections?: Array<{ name: string; count: number }>;
  questionCount?: number;
}

interface MockTestsListClientProps {
  initialTests: MockTest[];
}

export default function MockTestsListClient({
  initialTests,
}: MockTestsListClientProps) {
  const { theme } = useTheme();
  const [mockTests, setMockTests] = useState<MockTest[]>(initialTests);
  const [filteredTests, setFilteredTests] = useState<MockTest[]>(initialTests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [showContactForm, setShowContactForm] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMockTests(initialTests);
    setFilteredTests(initialTests);
  }, [initialTests]);

  useEffect(() => {
    let results = mockTests;

    if (searchTerm) {
      results = results.filter(
        (test) =>
          test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (test.category &&
            test.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (test.creator &&
            test.creator.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

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
          ? "bg-violet-900 text-violet-300"
          : "bg-violet-100 text-violet-800";
      default:
        return "";
    }
  };

  if (mockTests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        {showContactForm ? (
          <div className="w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Request More Tests
              </h2>
              <button 
                onClick={() => setShowContactForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  message: formData.get('message') as string,
                  subject: "Mock Test Request"
                };

                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });

                  if (response.ok) {
                    toast.success('Request sent successfully!');
                    setShowContactForm(false);
                  } else {
                    toast.error('Failed to send request. Please try again.');
                  }
                } catch (error) {
                  toast.error('An error occurred. Please try again.');
                }
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={session?.user?.name || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={session?.user?.email || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    What tests would you like to see?
                  </label>
                  <textarea
                    name="message"
                    defaultValue="I'd like to request mock tests for: [Specify category/exam]"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  onClick={() => toast.loading('Sending request...')}
                  className={`w-full py-2 px-4 ${
                    theme === "dark" 
                      ? "bg-violet-600 hover:bg-violet-700" 
                      : "bg-violet-500 hover:bg-violet-600"
                  } text-white font-medium rounded-lg transition`}
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <Award className="inline-block mb-4 text-yellow-400" size={36} />
              <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                No mock tests available yet
              </h3>
              <p className={`max-w-md mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                We're working hard to add more tests for this category. 
                Request specific tests and we'll prioritize creating them!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/mocks"
                className={`px-6 py-2 ${getThemeClasses("button-primary")} rounded-lg transition`}
              >
                Explore Available Tests
              </Link>
              
              <button
                onClick={() => setShowContactForm(true)}
                className={`px-6 py-2 ${theme === "dark" 
                  ? "bg-gray-700 hover:bg-gray-600 text-white" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"} rounded-lg transition`}
              >
                Request Specific Tests
              </button>
            </div>
          </>
        )}
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
            placeholder="Search tests or creators..."
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
            No mock tests found matching your criteria
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
              <div className="px-4 py-3">
                <div className="flex justify-between items-start mb-2">
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

                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded ${
                      theme === "dark"
                        ? "bg-indigo-900 text-indigo-300"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {mock.tag || "TCS"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                    <Clock size={16} className="mr-2 text-indigo-500" />
                    {mock.durationMinutes || 60} mins
                  </div>
                  <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    {mock.questionCount || 0} questions
                  </div>
                  <div className={`flex items-center text-sm ${getThemeClasses("text-muted")}`}>
                    <Users size={16} className="mr-2 text-violet-500" />
                    {(mock.attemptCount || 0) + (mock.userPlayed || 0)}{" "}
                    students
                  </div>
                </div>

                {Array.isArray(mock.sections) && mock.sections.length > 0 && (
                  <div className="mb-4">
              
                    <div className="flex flex-wrap gap-2">
                      {mock.sections.slice(0, 4).map((section) => (
                        <span
                          key={`${mock._id}-${section.name}`}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-gray-100 text-gray-700"
                          }`}
                          title={`${section.count} questions`}
                        >
                          <span>{section.name.replace("-", " ").trim()}</span>
                          <span className={`rounded-full px-1 ${theme === "dark" ? "bg-gray-600" : "bg-white"}`}>
                            {section.count}
                          </span>
                        </span>
                      ))}
                      {mock.sections.length > 4 && (
                        <span className={`text-xs ${getThemeClasses("text-muted")}`}>
                          +{mock.sections.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

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