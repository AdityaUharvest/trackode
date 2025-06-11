"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  JavaScript: {
    borderGradient: "linear-gradient(to right, #F7DF1E, #E5C107)",
    badgeGradient: "linear-gradient(to right, #F7DF1E, #E5C107)",
    textClass: "text-yellow-400",
  },
};

const programmingRoadmapData = {
  JavaScript: [
    {
      milestone: "Milestone 1: Basics",
      topics: [
        "Variables: var, let, const",
        "Data Types: number, string, boolean",
        "Operators: arithmetic, logical, comparison",
        "Control Structures: if-else, switch, loops",
        "Functions: declarations, expressions, arrow functions",
      ],
      books: ["JavaScript: The Definitive Guide by David Flanagan"],
      resources: ["MDN Web Docs", "freeCodeCamp"],
    },
    {
      milestone: "Milestone 2: Intermediate",
      topics: [
        "Arrays: methods (map, filter, reduce), iteration",
        "Objects: properties, methods, prototypes",
        "ES6 Features: destructuring, spread/rest operators",
        "DOM Manipulation: selecting, modifying elements",
      ],
      books: ["Eloquent JavaScript by Marijn Haverbeke"],
      resources: ["Codecademy", "Udemy"],
    },
    {
      milestone: "Milestone 3: Advanced",
      topics: [
        "Asynchronous JavaScript: callbacks, promises, async/await",
        "Modules: import/export, ES modules",
        "Error Handling: try-catch, custom errors",
        "Closures and Scope: lexical scoping",
      ],
      books: ["You Don’t Know JS by Kyle Simpson"],
      resources: ["LeetCode", "HackerRank"],
    },
    {
      milestone: "Milestone 4: Projects",
      topics: [
        "Build a To-Do App with localStorage",
        "API Integration with Fetch/Axios",
        "Simple Game Development (e.g., Snake game)",
        "Deploy a web app using Netlify",
      ],
      books: [],
      resources: ["GitHub", "CodePen"],
    },
  ],
};

const JavaScriptRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          JavaScript Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.JavaScript.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.JavaScript.textClass} border-4`}
                style={{
                  borderImage: colorMap.JavaScript.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.JavaScript.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.JavaScript.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.JavaScript.textClass}`}>
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
              {index < programmingRoadmapData.JavaScript.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.JavaScript.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JavaScriptRoadmap;