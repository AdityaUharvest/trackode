"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeContext'; // Adjust the import path as needed

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
  }
}

export default function TechStackQuizSystem() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme(); // Get theme from context
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [quizResults, setQuizResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [organizedQuizzes, setOrganizedQuizzes] = useState<SectionLevels>({});
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const technologies = [
    { name: 'JavaScript', color: 'yellow' },
    { name: 'Python', color: 'blue' },
    { name: 'Java', color: 'orange' },
    { name: 'C++', color: 'indigo' },
    { name: 'React', color: 'cyan' },
    { name: 'Node.js', color: 'green' },
    { name: 'TypeScript', color: 'blue' },
    { name: 'SQL', color: 'orange' },
    { name: 'HTML/CSS', color: 'red' },
    { name: 'Git', color: 'orange' },
    { name: 'Docker', color: 'blue' },
    { name: 'AWS', color: 'yellow' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/total-quizes");
      const quizData = response.data.quizes;
      setQuizzes(quizData);
      setFilteredQuizzes(quizData);
      
      const organized = organizeQuizzesBySectionAndLevel(quizData);
      setOrganizedQuizzes(organized);
      
      // Initialize all sections as expanded by default
      const initialExpanded: Record<string, boolean> = {};
      Object.keys(organized).forEach(section => {
        initialExpanded[section] = true;
      });
      setExpandedSections(initialExpanded);
      
      // Calculate stats
      const totalQuizzes = quizData.length;
      const percentages = quizResults.map(
        (result: any) => Number(((result?.score / result?.totalQuestions) * 100).toFixed(1)))
      
      let accuracyTrend = 'stable';
      if (totalQuizzes >= 3) {
        const firstHalf = percentages.slice(0, Math.floor(percentages.length/2));
        const secondHalf = percentages.slice(Math.floor(percentages.length/2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        accuracyTrend = secondAvg > firstAvg ? 'improving' : secondAvg < firstAvg ? 'declining' : 'stable';
      }
    };

    fetchData();
  }, [quizResults]);

  const handleBackToTechs = () => {
    setSelectedTech(null);
  };

  const organizeQuizzesBySectionAndLevel = (quizList: Quiz[]) => {
    const organized: SectionLevels = {};
    
    quizList.forEach(quiz => {
      const match = quiz.name.match(/\(([^)]+)\)\s*-\s*(\w+)/);
      
      if (match) {
        const section = match[1].trim();
        const level = match[2].trim();
        
        if (!organized[section]) {
          organized[section] = {
            Easy: [],
            Medium: [],
            Hard: [],
            Other: []
          };
        }
        
        if (['Easy', 'Medium', 'Hard'].includes(level)) {
          organized[section][level as 'Easy' | 'Medium' | 'Hard'].push({
            ...quiz,
            section,
            level
          });
        } else {
          organized[section].Other.push({
            ...quiz,
            section,
            level: 'Other'
          });
        }
      } else {
        const section = "Uncategorized";
        if (!organized[section]) {
          organized[section] = {
            Easy: [],
            Medium: [],
            Hard: [],
            Other: []
          };
        }
        organized[section].Other.push({
          ...quiz,
          section,
          level: 'Other'
        });
      }
    });
    
    return organized;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTechClick = (tech: string) => {
    router.push(`/free-tech-quiz/${encodeURIComponent(tech)}`);
  };

  return (
    <div className={`min-h-screen rounded-3xl ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-12">
        {!selectedTech ? (
          <>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${theme === "dark" ? "bg-gray-700 text-purple-300" : "bg-purple-100 text-purple-700"}`}>
                Multiple Technologies
              </span>
              
              <h2 id="tech-stack-heading" className={`text-2xl font-bold sm:text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Technologies We Cover
              </h2>
              
              <p className={`mt-4 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Practice with quizzes and challenges in all major programming languages and frameworks
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-12 sm:grid-cols-3 lg:grid-cols-6">
              {Object.keys(organizedQuizzes).filter(section => section !== "Uncategorized").map((tech) => {
                const totalQuizzes = 
                  (organizedQuizzes[tech].Easy?.length || 0) +
                  (organizedQuizzes[tech].Medium?.length || 0) +
                  (organizedQuizzes[tech].Hard?.length || 0) +
                  (organizedQuizzes[tech].Other?.length || 0);
                
                const colorMap: Record<string, string> = {
                  'JavaScript': 'yellow',
                  'Python': 'blue',
                  'Java': 'orange',
                  'C++': 'indigo',
                  'React.js': 'cyan',
                  'Node.js': 'green',
                  'TypeScript': 'blue',
                  'SQL': 'orange',
                  'HTML/CSS': 'red',
                  'Git': 'orange',
                  'Docker': 'blue',
                  'AWS': 'yellow',
                  'DSA': 'purple',
                  'DBMS': 'green',
                  'Reasoning': 'indigo',
                  'Verbal Ability': 'blue'
                };
                
                const color = colorMap[tech] || 'gray';

                return (
                  <button
                    key={tech}
                    onClick={() => handleTechClick(tech)}
                    className={`flex flex-col items-center p-5 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                      theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"
                    }`}
                    style={{
                      boxShadow: theme === "dark" ? "0 4px 20px -5px rgba(0, 0, 0, 0.3)" : "0 4px 20px -5px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          color === 'yellow' ? (theme === "dark" ? "bg-yellow-500" : "bg-yellow-400") :
                          color === 'blue' ? (theme === "dark" ? "bg-blue-500" : "bg-blue-400") :
                          color === 'orange' ? (theme === "dark" ? "bg-orange-500" : "bg-orange-400") :
                          color === 'indigo' ? (theme === "dark" ? "bg-indigo-500" : "bg-indigo-400") :
                          color === 'cyan' ? (theme === "dark" ? "bg-cyan-500" : "bg-cyan-400") :
                          color === 'green' ? (theme === "dark" ? "bg-green-500" : "bg-green-400") :
                          color === 'red' ? (theme === "dark" ? "bg-red-500" : "bg-red-400") :
                          color === 'purple' ? (theme === "dark" ? "bg-purple-500" : "bg-purple-400") :
                          (theme === "dark" ? "bg-gray-500" : "bg-gray-400")
                        }`}
                      ></span>
                      <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {tech}
                      </span>
                    </div>
                    <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {totalQuizzes} {totalQuizzes === 1 ? 'quiz' : 'quizzes'}
                    </span>
                  </button>
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