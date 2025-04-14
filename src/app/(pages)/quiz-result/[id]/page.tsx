"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { FaSort, FaFilter, FaTrophy, FaMedal } from "react-icons/fa";
import axios from "axios";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@/components/ThemeContext";
import { Loader2, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Quiz from "@/app/model/Quiz";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface QuizResult {
  student: {
    name: string;
  };
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  attemptedAt: string;
}

export default function QuizResults({ params }: any) {
  const { theme } = useTheme();
  const id = params.id;

  const [results, setResults] = useState<QuizResult[]>([]);
  const [sortBy, setSortBy] = useState("score");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("/api/quiz-result/", {
          params: { quizId: id },
        });
        setResults(response.data.attempted);
        setTimeout(() => setShowAnimation(true), 500);
      } catch (error) {
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);
  console.log(results);
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "score") return b?.score - a?.score;
    if (sortBy === "timeTaken") return new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime();
    if (sortBy === "accuracy") {
      const accuracyA = (a.correctAnswers / a.totalQuestions) * 100;
      const accuracyB = (b.correctAnswers / b.totalQuestions) * 100;
      return accuracyB - accuracyA;
    }
    return 0;
  });

  const filteredResults = sortedResults.filter((result) =>
    result.student.name.toLowerCase().includes(filter.toLowerCase())
  );

  const topThree = sortedResults.slice(0, 3);

  const chartData = {
    labels: filteredResults.map((result) => result.student.name),
    datasets: [
      {
        label: "Score",
        data: filteredResults.map((result) => result.score),
        backgroundColor: theme === "light" 
          ? "rgba(75, 192, 192, 0.6)" 
          : "rgba(75, 192, 192, 0.8)",
        borderColor: theme === "light" 
          ? "rgba(75, 192, 192, 1)" 
          : "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

  const getPosition = (index: number) => {
    switch (index) {
      case 0: return { icon: <FaTrophy size={38} className="text-yellow-800" />, color: "bg-gradient-to-r from-yellow-300 to-yellow-400", label: "1st Place" };
      case 1: return { icon: <FaMedal size={34} className="text-gray-800" />, color: "bg-gradient-to-r from-gray-300 to-gray-500", label: "2nd Place" };
      case 2: return { icon: <FaMedal size={30} className="text-amber-800" />, color: "bg-gradient-to-r from-amber-600 to-amber-800", label: "3rd Place" };
      default: return { icon: null, color: "", label: "" };
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${
      theme === "light" ? "bg-gradient-to-b from-indigo-50 to-white text-gray-900" : "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
    }`}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-2xl md:text-2xl font-bold text-center mb-8 md:mb-10 font-serif"
      >
        Our Quiz Champions
      </motion.h1>

      {/* Top 3 Winners Podium */}
      <div className="mb-10">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-xl font-semibold text-center mb-6"
        >
          <span className="inline-flex items-center gap-2">
            <Award className="text-yellow-500" /> Top Performers <Award className="text-yellow-500" />
          </span>
        </motion.h2>
        
        <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-8">
          {topThree.map((result, index) => {
            const position = getPosition(index);
            const height = index === 0 ? "h-64" : index === 1 ? "h-52" : "h-48";
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.7 }}
                className={`relative w-full md:w-64 ${height} rounded-t-lg ${position.color} shadow-lg flex flex-col justify-end overflow-hidden`}
              >
                {showAnimation && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 1], scale: [0.8, 1.2, 1] }}
                    transition={{ delay: 1 + index * 0.3, duration: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <Sparkles className="text-white" />
                  </motion.div>
                )}
                
                <div className="absolute top-4 left-0 right-0 flex justify-center">
                  {position.icon}
                </div>
                
                <div className="text-center text-white p-4 font-semibold">
                  <div className="text-lg mb-1">🏆{position.label}</div>
                  <div className="text-xl mb-2">{result.student.name}</div>
                  <div className="text-2xl">
                    {result.score} pts
                  </div>
                  <div className="text-sm opacity-80">
                    {((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)}% accuracy
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Responsive Filters and Sorting */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        className="flex flex-col  md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8"
      >
        <div className="flex items-center gap-2">
          <FaFilter className="text-xl flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`w-full md:w-auto p-2 rounded-lg shadow-sm ${
              theme === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-100"
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <FaSort className="text-xl flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`w-full md:w-auto p-2 rounded-lg shadow-sm ${
              theme === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-100"
            }`}
          >
            <option value="score">Sort by Score</option>
            <option value="timeTaken">Sort by Time Taken</option>
            <option value="accuracy">Sort by Accuracy</option>
          </select>
        </div>
      </motion.div>

      {/* Chart Container with Responsive Height */}
      

      {/* Responsive Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.7 }}
        className="overflow-x-auto rounded-xl shadow-lg"
      >
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-xl">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className={`${
                theme === "light" ? "bg-indigo-100 text-indigo-900" : "bg-indigo-900 text-indigo-100"
              }`}>
                <tr>
                  <th className="p-4 text-left whitespace-nowrap font-semibold">Rank</th>
                  <th className="p-4 text-left whitespace-nowrap font-semibold">Player's Name</th>
                  <th className="p-4 text-left whitespace-nowrap font-semibold">Score</th>
                  <th className="p-4 text-left whitespace-nowrap font-semibold">Correct</th>
                  <th className="p-4 text-left whitespace-nowrap font-semibold">Incorrect</th>
                  <th className="p-4 text-left whitespace-nowrap font-semibold">Time</th>
                  <th className="p-4 text-left whitespace-nowrap font-semibold">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result, index) => {
                  const isTopThree = index < 3;
                  const position = isTopThree ? getPosition(index) : null;
                  
                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8 + index * 0.05, duration: 0.5 }}
                      className={`${
                        isTopThree
                          ? theme === "light"
                            ? "bg-gradient-to-r from-indigo-50 to-white hover:bg-indigo-100"
                            : "bg-gradient-to-r from-indigo-900/30 to-gray-800 hover:bg-indigo-800/30"
                          : theme === "light"
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-800 hover:bg-gray-700"
                      } transition-colors`}
                    >
                      <td className="p-4 whitespace-nowrap">
                        {isTopThree ? (
                          <div className="flex items-center">
                            {position?.icon}
                          </div>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap font-medium">{result.student.name}</td>
                      <td className="p-4 whitespace-nowrap font-bold">{result.score}</td>
                      <td className="p-4 whitespace-nowrap text-green-600">{result.correctAnswers}</td>
                      <td className="p-4 whitespace-nowrap text-red-500">{result.totalQuestions - result.correctAnswers}</td>
                      <td className="p-4 text-sm whitespace-nowrap">{new Date(result.attemptedAt).toLocaleDateString()}⌚{new Date(result.attemptedAt).toLocaleTimeString()} 
                        </td>
                      
                      <td className="p-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(result.correctAnswers / result.totalQuestions) * 100 || 0}%` }}
                          ></div>
                        </div>
                        <div className="text-xs">
                          {((result.correctAnswers / result.totalQuestions) * 100 || 0).toFixed(1)}%
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="mb-8 mt-4 md:mb-10 w-full h-[300px] md:h-[400px] lg:h-[500px] p-4 rounded-xl shadow-lg bg-opacity-50 backdrop-blur-sm"
        style={{
          background: theme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(30, 41, 59, 0.8)"
        }}
      >
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Player Scores",
                color: theme === "light" ? "#000" : "#fff",
                font: {
                  size: 18,
                  weight: 'bold',
                  family: "'Helvetica', 'Arial', sans-serif"
                }
              },
            },
            scales: {
              x: {
                ticks: {
                  color: theme === "light" ? "#000" : "#fff",
                  maxRotation: 45,
                  minRotation: 45,
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: theme === "light" ? "rgba(156, 163, 175, 0.3)" : "rgba(71, 85, 105, 0.3)",
                },
              },
              y: {
                ticks: {
                  color: theme === "light" ? "#000" : "#fff",
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: theme === "light" ? "rgba(156, 163, 175, 0.3)" : "rgba(71, 85, 105, 0.3)",
                },
              },
            },
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            }
          }}
        />
      </motion.div>
    </div>
  );
}