"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  Kotlin: {
    borderGradient: "linear-gradient(to right, #A370F0, #7039B0)",
    badgeGradient: "linear-gradient(to right, #A370F0, #7039B0)",
    textClass: "text-purple-500",
  },
};

const programmingRoadmapData = {
  Kotlin: [
    {
      milestone: "Milestone 1: Kotlin Basics",
      topics: [
        "Introduction: IntelliJ setup, Kotlin REPL",
        "Data Types: Int, Double, String, Boolean",
        "Control Flow: if, when, loops",
        "Functions: Inline, default parameters",
      ],
      books: ["Kotlin in Action by Dmitry Jemerov"],
      resources: ["Kotlinlang.org", "JetBrains Academy"],
    },
    {
      milestone: "Milestone 2: Intermediate Kotlin",
      topics: [
        "Collections: Lists, maps, sets",
        "Classes and Objects: Data classes, sealed classes",
        "Null Safety: Nullable types, safe calls",
        "Lambdas and Higher-Order Functions",
      ],
      books: ["Kotlin Programming by Josh Skeen"],
      resources: ["HackerRank", "LeetCode"],
    },
    {
      milestone: "Milestone 3: Advanced Kotlin",
      topics: [
        "Coroutines: Async programming, flows",
        "DSL Creation: Domain-specific languages",
        "Testing: Kotest, JUnit",
        "Android Development: Jetpack Compose",
      ],
      books: ["Kotlin for Android Developers by Antonio Leiva"],
      resources: ["Codewars", "Kotlin Playground"],
    },
    {
      milestone: "Milestone 4: Projects",
      topics: [
        "Build an Android app",
        "Create a backend with Ktor",
        "Multiplatform development",
        "Contribute to open-source Kotlin projects",
      ],
      books: [],
      resources: ["GitHub", "Exercism"],
    },
  ],
};

const KotlinRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          Kotlin Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.Kotlin.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.Kotlin.textClass} border-4`}
                style={{
                  borderImage: colorMap.Kotlin.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.Kotlin.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.Kotlin.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.Kotlin.textClass}`}>
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
              {index < programmingRoadmapData.Kotlin.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.Kotlin.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KotlinRoadmap;