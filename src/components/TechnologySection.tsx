"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeContext"; // Adjust the import path as needed
import { motion } from "framer-motion";

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

interface SectionLevels {
  [section: string]: {
    Easy: Quiz[];
    Medium: Quiz[];
    Hard: Quiz[];
    Other: Quiz[];
  };
}

// Map technologies to image URLs (use your own image assets or external CDN)
const techImageMap: Record<string, string> = {
  "C": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "CPP": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "React.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  "HTML/CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  AWS:  "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/codeforces.svg",
  DSA: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codepen/codepen-original.svg", // Placeholder for DSA
  DBMS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
};

export default function TechStackQuizSystem() {
  const router = useRouter();
  const { theme } = useTheme(); // Get theme from context
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [organizedQuizzes, setOrganizedQuizzes] = useState<SectionLevels>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/total-quizes");
        const quizData = response.data.quizes;
        setQuizResults(quizData);

        const organized = organizeQuizzesBySectionAndLevel(quizData);
        setOrganizedQuizzes(organized);

        // Initialize all sections as expanded by default
        const initialExpanded: Record<string, boolean> = {};
        Object.keys(organized).forEach((section) => {
          initialExpanded[section] = true;
        });
        setExpandedSections(initialExpanded);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchData();
  }, []);

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
          organized[section].Other.push({
            ...quiz,
            section,
            level: "Other",
          });
        }
      } else {
        const section = "Uncategorized";
        if (!organized[section]) {
          organized[section] = { Easy: [], Medium: [], Hard: [], Other: [] };
        }
        organized[section].Other.push({
          ...quiz,
          section,
          level: "Other",
        });
      }
    });

    return organized;
  };

  const handleTechClick = (tech: string) => {
    router.push(`/free-tech-quiz/${encodeURIComponent(tech)}`);
  };

  return (
    <div className={`min-h-screen rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2
              className={`inline-flex items-center font-semibold lg:text-xl px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md`}
            >
              Technologies We
              <span className="ml-2 px-3 py-1 rounded-md bg-white text-purple-600 font-bold">Cover</span>
            </h2>
          </motion.div>
        </div>

        {!selectedTech ? (
          <>
            <div className="max-w-3xl mx-auto text-center">
              <p className={`mt-4 lg:text-base text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Practice with quizzes and challenges in all major programming languages and frameworks
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-12 sm:grid-cols-3 lg:grid-cols-4">
              {Object.keys(organizedQuizzes)
                .filter((section) => section !== "Uncategorized")
                .map((tech) => {
                  const totalQuizzes =
                    (organizedQuizzes[tech].Easy?.length || 0) +
                    (organizedQuizzes[tech].Medium?.length || 0) +
                    (organizedQuizzes[tech].Hard?.length || 0) +
                    (organizedQuizzes[tech].Other?.length || 0);

                  const colorMap: Record<string, string> = {
                    "C": "indigo",
                    JavaScript: "yellow",
                    Python: "blue",
                    Java: "orange",
                    "C++": "indigo",
                    
                    "React.js": "purple",
                    "Node.js": "green",
                    TypeScript: "blue",
                    SQL: "orange",
                    "HTML/CSS": "red",
                    Git: "orange",
                    Docker: "blue",
                    AWS: "green",
                    DSA: "purple",
                    DBMS: "green",
                  };

                  const color = colorMap[tech] || "green";

                  return (
                    <motion.div
                      key={tech}
                      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex flex-col items-center p-5 rounded-xl transition-all duration-300 cursor-pointer ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"
                      } border-l-4 border-${color}-400 shadow-lg`}
                    >
                      {/* Tech Icon */}
                      <div className="mb-2 mt-3">
                        <img
                          src={techImageMap[tech] || "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/codeforces.svg"}
                          alt={`${tech} icon`}
                          className={`w-10 h-10 ${theme === "dark" ? "invert" : ""}`}
                        />
                      </div>

                      {/* Tech Name */}
                      <span className={` text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {tech}
                      </span>

                      {/* Quiz Count Badge */}
                      <div
                        className={`absolute top-2 right-2 p-1 rounded-full text-xs ${
                          theme === "dark"
                            ? `bg-${color}-600 text-white`
                            : `bg-${color}-100 text-${color}-800`
                        }`}
                      >
                        {totalQuizzes} {totalQuizzes === 1 ? "Quiz" : "Quizzes"}
                      </div>

                      {/* Click Handler */}
                      <button
                        onClick={() => handleTechClick(tech)}
                        className="absolute inset-0 w-full h-full opacity-0"
                        aria-label={`Select ${tech} quizzes`}
                      />
                    </motion.div>
                  );
                })}
            </div>
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Your selected tech view */}
          </div>
        )}
      </div>
    </div>
  );
}