"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  Python: {
    borderGradient: "linear-gradient(to right, #0EA5E9, #0284C7)",
    badgeGradient: "linear-gradient(to right, #0EA5E9, #0284C7)",
    textClass: "text-sky-500",
  },
};

const programmingRoadmapData = {
  Python: [
    {
      milestone: "Milestone 1: Python Basics",
      topics: [
        "Introduction: Setup, interpreters, IDEs",
        "Data Types: int, float, str, list, tuple, dict",
        "Control Structures: if-elif-else, loops",
        "Functions: Defining, lambda, recursion",
      ],
      books: ["Python Crash Course by Eric Matthes"],
      resources: ["GeeksforGeeks", "Real Python"],
    },
    {
      milestone: "Milestone 2: Data Structures",
      topics: [
        "Lists: Slicing, list comprehension",
        "Tuples, Sets, Dictionaries: Operations",
        "String manipulation techniques",
        "Generators and Iterators",
      ],
      books: ["Learning Python by Mark Lutz"],
      resources: ["HackerRank", "LeetCode"],
    },
    {
      milestone: "Milestone 3: OOP in Python",
      topics: [
        "Classes and Objects: init, self",
        "Inheritance and Polymorphism",
        "Magic methods",
        "Decorators and Properties",
      ],
      books: ["Fluent Python by Luciano Ramalho"],
      resources: ["Codeforces", "CodeChef"],
    },
    {
      milestone: "Milestone 4: Advanced Concepts",
      topics: [
        "File Handling: Reading/writing files",
        "Exception Handling: try-except-else-finally",
        "Modules and Packages",
        "Working with APIs (requests library)",
      ],
      books: ["Python Programming by John Zelle"],
      resources: ["InterviewBit", "GeeksforGeeks"],
    },
    {
      milestone: "Milestone 5: Real-world Projects",
      topics: [
        "Web scraping with BeautifulSoup",
        "Data analysis with Pandas",
        "Building small web applications",
        "Automation scripts",
      ],
      books: [],
      resources: ["GitHub", "Kaggle"],
    },
  ],
};

const PythonRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          Python Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.Python.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.Python.textClass} border-4`}
                style={{
                  borderImage: colorMap.Python.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.Python.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.Python.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.Python.textClass}`}>
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
              {index < programmingRoadmapData.Python.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.Python.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PythonRoadmap;