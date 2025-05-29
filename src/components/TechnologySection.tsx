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
  DSA: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codepen/codepen-original.svg",
  DBMS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
};

export default function TechStackQuizSystem() {
  const router = useRouter();
  const { theme } = useTheme();
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
    <div className={`px-6 py-8 rounded-xl max-w-7xl mx-auto ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="">

        {!selectedTech ? (
          <>
            <div className="grid grid-cols-2 gap-6 sm:gap-8 mt-12 sm:grid-cols-3 lg:grid-cols-5">
              {Object.keys(organizedQuizzes)
                .filter((section) => section !== "Uncategorized")
                .map((tech, index) => {
                  const totalQuizzes =
                    (organizedQuizzes[tech].Easy?.length || 0) +
                    (organizedQuizzes[tech].Medium?.length || 0) +
                    (organizedQuizzes[tech].Hard?.length || 0) +
                    (organizedQuizzes[tech].Other?.length || 0);

                  const colorMap: Record<string, string> = {
                    "C": "gold",
                    JavaScript: "amber",
                    Python: "sky",
                    Java: "rose",
                    "CPP": "gold",
                    "React.js": "violet",
                    "Node.js": "emerald",
                    TypeScript: "sky",
                    SQL: "rose",
                    "HTML/CSS": "red",
                    Git: "rose",
                    Docker: "sky",
                    AWS: "emerald",
                    DSA: "violet",
                    DBMS: "emerald",
                  };

                  const color = colorMap[tech] || "emerald";

                  return (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: theme === "dark" 
                          ? "0 15px 30px rgba(255, 255, 255, 0.1)" 
                          : "0 15px 30px rgba(0, 0, 0, 0.15)",
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex flex-col items-center p-6 rounded-2xl cursor-pointer backdrop-blur-md transition-all duration-300 
                        ${theme === "dark" 
                          ? "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50" 
                          : "bg-white/50 border border-gray-200/50 hover:bg-gray-100/50"} 
                        shadow-xl group
                      `}
                    >
                      {/* Gradient Border Overlay */}
                      <div 
                        className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-${color}-400 group-hover:to-${color}-600 transition-all duration-500 opacity-0 group-hover:opacity-100`}
                      ></div>

                      {/* Tech Icon with Gradient Background */}
                      <div className={`relative mb-4 p-3 rounded-full bg-gradient-to-br from-${color}-200 to-${color}-400 group-hover:from-${color}-300 group-hover:to-${color}-500 transition-all duration-300`}>
                        <img
                          src={techImageMap[tech] || "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/codeforces.svg"}
                          alt={`${tech} icon`}
                          className="lg:h-16 lg:w-16 h-12 w-12  rounded-xl group-hover:rotate-12 transition-transform duration-300"
                        />
                      </div>

                      {/* Tech Name */}
                      <span 
                        className={`text-base font-serif tracking-wide ${theme === "dark" ? "text-gray-100" : "text-gray-900"} group-hover:text-${color}-500 transition-colors duration-300`} 
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {tech}
                      </span>
                       <span 
                        className={`text-base px-2 py-1 absolute top-2 rounded-full border-2 right-2 font-serif tracking-wide ${theme === "dark" ? "text-gray-100" : "text-gray-900"} group-hover:text-${color}-500 text-${color}-500 transition-colors duration-300`} 
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {totalQuizzes}
                      </span>
                      {/* Quiz Count Badge */}
                      

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

      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .border-gradient-to-r {
          background: linear-gradient(to right, var(--tw-gradient-stops));
          background-size: 200% 200%;
          animation: gradientFlow 3s ease infinite;
        }
      `}</style>
    </div>
  );
}