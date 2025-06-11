"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  "C++": {
    borderGradient: "linear-gradient(to right, #FFD700, #DAA520)",
    badgeGradient: "linear-gradient(to right, #FFD700, #DAA520)",
    textClass: "text-yellow-500",
  },
};

const programmingRoadmapData = {
  "C++": [
    {
      milestone: "Milestone 1: C++ Fundamentals",
      topics: [
        "Introduction: Setup (g++), differences from C",
        "Data Types: int, float, char, string class",
        "Operators: Arithmetic, logical, relational, bitwise",
        "Input/Output: cin, cout, string streams",
      ],
      books: ["C++ Primer by Stanley B. Lippman"],
      resources: ["GeeksforGeeks", "TutorialsPoint"],
    },
    {
      milestone: "Milestone 2: STL and Modern C++",
      topics: [
        "Standard Template Library: Containers, algorithms",
        "Vectors, lists, maps: Declaration and usage",
        "Range-based loops, auto keyword",
        "Smart pointers: unique_ptr, shared_ptr",
      ],
      books: ["Effective Modern C++ by Scott Meyers"],
      resources: ["HackerRank", "LeetCode"],
    },
    {
      milestone: "Milestone 3: OOP Concepts",
      topics: [
        "Classes and Objects: Constructors, destructors",
        "Inheritance: Single, multiple, hierarchical",
        "Polymorphism: Virtual functions, abstract classes",
        "Operator overloading",
      ],
      books: ["Object-Oriented Programming with C++ by E Balagurusamy"],
      resources: ["Codeforces", "CodeChef"],
    },
    {
      milestone: "Milestone 4: Advanced Features",
      topics: [
        "Templates: Function and class templates",
        "Exception handling: try, catch, throw",
        "Multithreading basics",
        "File I/O operations",
      ],
      books: ["The C++ Programming Language by Bjarne Stroustrup"],
      resources: ["InterviewBit", "GeeksforGeeks"],
    },
    {
      milestone: "Milestone 5: Project Development",
      topics: [
        "Design patterns in C++",
        "Building small games or utilities",
        "Performance measurement and optimization",
        "Cross-platform development basics",
      ],
      books: [],
      resources: ["GitHub", "HackerEarth"],
    },
  ],
};

const CPlusPlusRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          C++ Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData["C++"].map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap["C++"].textClass} border-4`}
                style={{
                  borderImage: colorMap["C++"].borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap["C++"].borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap["C++"].borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap["C++"].textClass}`}>
                  {milestone.milestone}
                </h3>
                <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
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
              {index < programmingRoadmapData["C++"].length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap["C++"].borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CPlusPlusRoadmap;