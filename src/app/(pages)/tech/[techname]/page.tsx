"use client"
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';

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

export default function TechQuizPage({params}:any) {
  const router = useRouter();
  const techName  = params.techname;
  const [theme] = useState("light");
  const [organizedQuizzes, setOrganizedQuizzes] = useState<SectionLevels>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/total-quizes");
        const quizData = response.data.quizes;
        const organized = organizeQuizzesBySectionAndLevel(quizData);
        if(response){
          setLoading(false);
        }
        setOrganizedQuizzes(organized);
        
        // Initialize expanded sections
        const initialExpanded: Record<string, boolean> = {};
        if (organized[techName as string]) {
          Object.keys(organized[techName as string]).forEach(difficulty => {
            initialExpanded[`${techName}-${difficulty}`] = true;
          });
        }
        setExpandedSections(initialExpanded);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    if (techName) {
      fetchData();
    }
  }, [techName]);

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

  const handleBackToTechs = () => {
    router.push('/quiz-list');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between  mb-8">
            <button 
              onClick={handleBackToTechs}
              className={`flex items-center text-sm p-2 rounded-lg ${
                theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              More Quizzes
            </button>
            
            <h2 className={`text-base  font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {techName}
            </h2>
            
            
          </div>

          <div className="space-y-6">
            {organizedQuizzes[techName as string] && Object.entries(organizedQuizzes[techName as string]).map(([difficulty, quizzes]) => {
              if (quizzes.length === 0) return null;
              
              return (
                <div key={difficulty} className={`rounded-lg overflow-hidden ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}>
                  <div 
                    className={`p-4 flex justify-between items-center cursor-pointer ${
                      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleSection(`${techName}-${difficulty}`)}
                  > 
                    <h3 className={`text-base  font-semibold capitalize ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {difficulty}
                      <span className='text-sm text-gray-700'> ({quizzes.length} Quizzes) </span>
                    </h3>
                    
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedSections[`${techName}-${difficulty}`] ? "rotate-180" : ""
                      } ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {expandedSections[`${techName}-${difficulty}`] && (
  <div className="border-t p-2 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
    {quizzes.map((quiz) => (
      <div
        key={quiz._id}
        className={`p-5 border-s-4 border-green-500 rounded-lg shadow-md ${
          theme === "dark" ? "bg-gray-700 hover:bg-gray-650" : "bg-gray-50 hover:bg-white"
        } transition-all duration-200 hover:shadow-lg`}
      >
        <h4 className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {quiz.name}
        </h4>
        <p className='text-sm mt-2 font-sans font-medium text-green-600 dark:text-green-400'>
          {quiz.userPlayed ? `Your Score: ${quiz.userScore}/${quiz.maxScore}` : ""}
        </p>
        <p className={`text-sm mt-2 leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {quiz.description}
        </p>
          
        <div className="mt-4 flex justify-between items-center">
          <span className={`text-xs flex items-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            {quiz.totalRegistrations} players
          </span>
          
          {quiz.userPlayed && (
            <>
              <span className={`text-xs font-semibold flex items-center ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}>
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Completed
              </span>
              
              <div className="flex gap-2">
                <Link href={`/quiz-result/${quiz._id}`} className={`text-xs ${
                  theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                }`}>
                  View Leaderboard
                </Link>
              </div>
              
              
            </>
          )}
          {quiz.userPlayed ? (
            <Link
            className={`px-4 py-1.5 text-sm font-medium rounded-full ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            } transition-colors shadow-sm hover:shadow flex items-center`}
            href={`/dashboard/result/${quiz._id}`}
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Result
          </Link>
          ):
          (
<Link
href={`/quiz-play/${quiz._id}`}
            className={`px-4 py-1.5 text-sm font-medium rounded-full ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            } transition-colors shadow-sm hover:shadow flex items-center`}
            onClick={() => {
              console.log("Starting quiz:", quiz._id);
            }}
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Start
          </Link>
          )}
          
          
        </div>
      </div>
    ))}
  </div>
)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}