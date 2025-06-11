"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  PHP: {
    borderGradient: "linear-gradient(to right, #777BB3, #4F5B93)",
    badgeGradient: "linear-gradient(to right, #777BB3, #4F5B93)",
    textClass: "text-indigo-500",
  },
};

const programmingRoadmapData = {
  PHP: [
    {
      milestone: "Milestone 1: PHP Basics",
      topics: [
        "Introduction: PHP setup, XAMPP, basic syntax",
        "Data Types: Integer, string, array",
        "Control Structures: if, switch, loops",
        "Functions: Defining, parameters",
      ],
      books: ["PHP and MySQL Web Development by Luke Welling"],
      resources: ["PHP.net", "W3Schools"],
    },
    {
      milestone: "Milestone 2: Intermediate PHP",
      topics: [
        "Arrays: Associative, multidimensional",
        "Sessions and Cookies",
        "Form Handling: GET, POST",
        "Database Connectivity: MySQLi, PDO",
      ],
      books: ["Modern PHP by Josh Lockhart"],
      resources: ["HackerRank", "Codewars"],
    },
    {
      milestone: "Milestone 3: Advanced PHP",
      topics: [
        "OOP: Classes, objects, inheritance",
        "Frameworks: Laravel basics",
        "Security: SQL injection, XSS prevention",
        "RESTful APIs with PHP",
      ],
      books: ["Learning PHP, MySQL & JavaScript by Robin Nixon"],
      resources: ["LeetCode", "Laracasts"],
    },
    {
      milestone: "Milestone 4: Projects",
      topics: [
        "Build a CMS with PHP",
        "Create a REST API with Laravel",
        "E-commerce website",
        "Deploy PHP app to Heroku",
      ],
      books: [],
      resources: ["GitHub", "PHP The Right Way"],
    },
  ],
};

const PHPRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          PHP Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.PHP.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.PHP.textClass} border-4`}
                style={{
                  borderImage: colorMap.PHP.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.PHP.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.PHP.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.PHP.textClass}`}>
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
              {index < programmingRoadmapData.PHP.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.PHP.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PHPRoadmap;