"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  Java: {
    borderGradient: "linear-gradient(to right, #F43F5E, #E11D48)",
    badgeGradient: "linear-gradient(to right, #F43F5E, #E11D48)",
    textClass: "text-rose-500",
  },
};

const programmingRoadmapData = {
  Java: [
    {
      milestone: "Milestone 1: Core Java",
      topics: [
        "Introduction: JVM, JRE, JDK setup",
        "Data Types: Primitive and object types",
        "Control Statements: if-else, switch, loops",
        "Arrays and Strings: Manipulation techniques",
      ],
      books: ["Head First Java by Kathy Sierra"],
      resources: ["GeeksforGeeks", "TutorialsPoint"],
    },
    {
      milestone: "Milestone 2: OOP Principles",
      topics: [
        "Classes and Objects: Constructors, methods",
        "Inheritance and Polymorphism",
        "Encapsulation and Abstraction",
        "Interfaces and Abstract classes",
      ],
      books: ["Effective Java by Joshua Bloch"],
      resources: ["HackerRank", "LeetCode"],
    },
    {
      milestone: "Milestone 3: Java Collections",
      topics: [
        "List implementations: ArrayList, LinkedList",
        "Set and Map interfaces",
        "Iterators and Comparators",
        "Stream API and Lambda expressions",
      ],
      books: ["Java: The Complete Reference by Herbert Schildt"],
      resources: ["Codeforces", "CodeChef"],
    },
    {
      milestone: "Milestone 4: Advanced Java",
      topics: [
        "Exception Handling: Checked and unchecked",
        "Multithreading: Thread class, Runnable",
        "File Handling: Readers, Writers",
        "Networking basics",
      ],
      books: ["Java Concurrency in Practice by Brian Goetz"],
      resources: ["InterviewBit", "GeeksforGeeks"],
    },
    {
      milestone: "Milestone 5: Application Development",
      topics: [
        "Building console applications",
        "JDBC and database connectivity",
        "Unit testing with JUnit",
        "Introduction to Spring Framework",
      ],
      books: [],
      resources: ["GitHub", "HackerEarth"],
    },
  ],
};

const JavaRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          Java Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.Java.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.Java.textClass} border-4`}
                style={{
                  borderImage: colorMap.Java.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.Java.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.Java.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.Java.textClass}`}>
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
              {index < programmingRoadmapData.Java.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.Java.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JavaRoadmap;