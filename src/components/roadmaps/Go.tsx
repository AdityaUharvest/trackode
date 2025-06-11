"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  Go: {
    borderGradient: "linear-gradient(to right, #00ADD8, #0078A8)",
    badgeGradient: "linear-gradient(to right, #00ADD8, #0078A8)",
    textClass: "text-cyan-500",
  },
};

const programmingRoadmapData = {
  Go: [
    {
      milestone: "Milestone 1: Go Basics",
      topics: [
        "Introduction: Go setup, GOPATH, go run",
        "Data Types: int, float64, string, bool",
        "Control Structures: if, switch, for loops",
        "Functions: Multiple returns, variadic",
      ],
      books: ["The Go Programming Language by Alan Donovan"],
      resources: ["Go by Example", "Tour of Go"],
    },
    {
      milestone: "Milestone 2: Intermediate Go",
      topics: [
        "Slices and Maps: Declaration, usage",
        "Structs and Interfaces",
        "Pointers and Memory Management",
        "Packages and Modules",
      ],
      books: ["Go in Action by William Kennedy"],
      resources: ["HackerRank", "LeetCode"],
    },
    {
      milestone: "Milestone 3: Advanced Go",
      topics: [
        "Concurrency: Goroutines, channels",
        "Error Handling: Errors as values",
        "Testing: Go test, table-driven tests",
        "HTTP Servers: net/http package",
      ],
      books: ["Concurrency in Go by Katherine Cox-Buday"],
      resources: ["Codewars", "Go.dev"],
    },
    {
      milestone: "Milestone 4: Projects",
      topics: [
        "Build a REST API server",
        "Create a CLI tool",
        "Real-time chat application",
        "Deploy a Go app to cloud",
      ],
      books: [],
      resources: ["GitHub", "Exercism"],
    },
  ],
};

const GoRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          Go Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.Go.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.Go.textClass} border-4`}
                style={{
                  borderImage: colorMap.Go.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.Go.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.Go.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.Go.textClass}`}>
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
              {index < programmingRoadmapData.Go.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.Go.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoRoadmap;