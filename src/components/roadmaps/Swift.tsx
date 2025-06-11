"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  Swift: {
    borderGradient: "linear-gradient(to right, #FA7343, #D14F1F)",
    badgeGradient: "linear-gradient(to right, #FA7343, #D14F1F)",
    textClass: "text-orange-500",
  },
};

const programmingRoadmapData = {
  Swift: [
    {
      milestone: "Milestone 1: Swift Basics",
      topics: [
        "Introduction: Xcode setup, playgrounds",
        "Data Types: Int, Double, String, Bool",
        "Control Flow: if, switch, loops",
        "Optionals: Declaration, unwrapping",
      ],
      books: ["Swift Programming by Matt Neuburg"],
      resources: ["Hacking with Swift", "Ray Wenderlich"],
    },
    {
      milestone: "Milestone 2: Intermediate Swift",
      topics: [
        "Functions and Closures: Parameters, returns",
        "Collections: Arrays, dictionaries, sets",
        "Protocols and Extensions",
        "Structs and Enums",
      ],
      books: ["Swift Apprentice by Ray Wenderlich"],
      resources: ["Codewars", "HackerRank"],
    },
    {
      milestone: "Milestone 3: Advanced Swift",
      topics: [
        "Concurrency: Grand Central Dispatch, async/await",
        "Memory Management: ARC, retain cycles",
        "Property Wrappers",
        "SwiftUI: Building UI components",
      ],
      books: ["Advanced Swift by Chris Eidhof"],
      resources: ["LeetCode", "Swift.org"],
    },
    {
      milestone: "Milestone 4: iOS Development",
      topics: [
        "Build a simple iOS app",
        "Core Data for persistence",
        "Networking with URLSession",
        "App Store deployment basics",
      ],
      books: [],
      resources: ["GitHub", "Apple Developer"],
    },
  ],
};

const SwiftRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          Swift Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.Swift.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.Swift.textClass} border-4`}
                style={{
                  borderImage: colorMap.Swift.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.Swift.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.Swift.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.Swift.textClass}`}>
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
              {index < programmingRoadmapData.Swift.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.Swift.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SwiftRoadmap;