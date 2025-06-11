"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  C: {
    borderGradient: "linear-gradient(to right, #FFD700, #DAA520)",
    badgeGradient: "linear-gradient(to right, #FFD700, #DAA520)",
    textClass: "text-yellow-500",
  },
};

const programmingRoadmapData = {
  C: [
    {
      milestone: "Milestone 1: Basics and Syntax",
      topics: [
        "Introduction to C: History, setup (GCC), basic program structure",
        "Data Types: int, float, char, double, ranges",
        "Variables and Constants: Declaration, initialization, scope",
        "Operators: Arithmetic, relational, logical, bitwise",
        "Input/Output: printf, scanf, getchar, putchar",
        "Control Structures: if, if-else, switch-case",
      ],
      books: ["C Programming Language by Kernighan and Ritchie"],
      resources: ["GeeksforGeeks", "TutorialsPoint"],
    },
    {
      milestone: "Milestone 2: Loops and Arrays",
      topics: [
        "Loops: for, while, do-while, nested loops",
        "Arrays: 1D arrays, declaration, initialization",
        "Multi-dimensional Arrays: 2D arrays for matrices",
        "String Handling: Character arrays, strlen, strcpy, strcmp",
      ],
      books: ["Let Us C by Yashavant Kanetkar"],
      resources: ["HackerRank", "CodeChef"],
    },
    {
      milestone: "Milestone 3: Functions and Pointers",
      topics: [
        "Functions: Declaration, definition, calling",
        "Parameter Passing: Call by value, recursion basics",
        "Pointers: Concept, declaration, pointer arithmetic",
        "Pointers with Arrays: Accessing elements via pointers",
      ],
      books: ["Programming in C by E Balagurusamy"],
      resources: ["LeetCode", "Codeforces"],
    },
    {
      milestone: "Milestone 4: Advanced Concepts",
      topics: [
        "Structures and Unions: Definition, accessing members",
        "Dynamic Memory: malloc, calloc, free",
        "File Handling: Reading and writing files",
        "Data Structures: Linked lists, stacks, queues",
      ],
      books: ["Data Structures Using C by Reema Thareja"],
      resources: ["GeeksforGeeks", "InterviewBit"],
    },
    {
      milestone: "Milestone 5: Real-world Applications",
      topics: [
        "Building small projects: Contact management system",
        "Algorithm implementation: Sorting, searching",
        "Memory management techniques",
        "Performance optimization basics",
      ],
      books: [],
      resources: ["GitHub", "HackerEarth"],
    },
  ],
};

const CRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          C Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.C.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.C.textClass} border-4`}
                style={{
                  borderImage: colorMap.C.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.C.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.C.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.C.textClass}`}>
                  {milestone.milestone}
                </h3>
                <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'an '}`}>
                  {milestone.topics.map((topic, idx) => (
                    <li key={idx} className="mb-2">{topic}</li>
                  ))}
                </ul>
                {milestone.books.length > 0 && (
                  <div className="mt-4">
                    <h5 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Recommended Books:</h5>
                    <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                      {milestone.books.map((book, i) => (
                        <li key={i} className="mb-1">{book}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {milestone.resources.length > 0 && (
                  <div className="mt-4">
                    <h5 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Practice Resources:</h5>
                    <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                      {milestone.resources.map((resource, i) => (
                        <li key={i} className="mb-1">{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {index < programmingRoadmapData.C.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.C.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CRoadmap;