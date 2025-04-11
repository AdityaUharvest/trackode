"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { FaSort, FaFilter } from "react-icons/fa";
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
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("/api/quiz-result/", {
          params: { quizId: id },
        });
        setResults(response.data.attempted);
      } catch (error) {
       
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

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

  const chartData = {
    labels: filteredResults.map((result) => result.student.name),
    datasets: [
      {
        label: "Score",
        data: filteredResults.map((result) => result.score),
        backgroundColor: theme === "light" ? "rgba(75, 192, 192, 0.6)" : "rgba(75, 192, 192, 0.8)",
        borderColor: theme === "light" ? "rgba(75, 192, 192, 1)" : "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div><Loader2></Loader2></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={`min-h-screen p-4 md:p-8 ${
      theme === "light" ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"
    }`}>
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Quiz Results</h1>

      {/* Responsive Filters and Sorting */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-2">
          <FaFilter className="text-xl flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`w-full md:w-auto p-2 rounded-lg ${
              theme === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-100"
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <FaSort className="text-xl flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`w-full md:w-auto p-2 rounded-lg ${
              theme === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-100"
            }`}
          >
            <option value="score">Sort by Score</option>
            <option value="timeTaken">Sort by Time Taken</option>
            <option value="accuracy">Sort by Accuracy</option>
          </select>
        </div>
      </div>

      {/* Chart Container with Responsive Height */}
      <div className="mb-6 md:mb-8 w-full h-[300px] md:h-[400px] lg:h-[500px]">
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
                  size: 16,
                  weight: 'bold'
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
                  color: theme === "light" ? "#e5e7eb" : "#374151",
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
                  color: theme === "light" ? "#e5e7eb" : "#374151",
                },
              },
            },
          }}
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className={`${
                theme === "light" ? "bg-gray-200 text-gray-900" : "bg-gray-800 text-gray-100"
              }`}>
                <tr>
                  <th className="p-4 text-left whitespace-nowrap">Player's Name</th>
                  <th className="p-4 text-left whitespace-nowrap">Score</th>
                  <th className="p-4 text-left whitespace-nowrap">Correct</th>
                  <th className="p-4 text-left whitespace-nowrap">Incorrect</th>
                  <th className="p-4 text-left whitespace-nowrap">Time</th>
                  <th className="p-4 text-left whitespace-nowrap">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => (
                  <tr
                    key={index}
                    className={`${
                      theme === "light"
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-700 hover:bg-gray-600"
                    } transition-colors`}
                  >
                    <td className="p-4 whitespace-nowrap">{result.student.name}</td>
                    <td className="p-4 whitespace-nowrap">{result.score}</td>
                    <td className="p-4 whitespace-nowrap">{result.correctAnswers}</td>
                    <td className="p-4 whitespace-nowrap">{result.totalQuestions - result.correctAnswers}</td>
                    <td className="p-4 whitespace-nowrap">{new Date(result.attemptedAt).toLocaleTimeString()}</td>
                    <td className="p-4 whitespace-nowrap">
                      {((result.correctAnswers / result.totalQuestions) * 100 || 0).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}