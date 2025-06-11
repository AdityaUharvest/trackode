"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  Rust: {
    borderGradient: "linear-gradient(to right, #DE3423, #A3251A)",
    badgeGradient: "linear-gradient(to right, #DE3423, #A3251A)",
    textClass: "text-red-500",
  },
};

const programmingRoadmapData = {
  Rust: [
    {
      milestone: "Milestone 1: Rust Basics",
      topics: [
        "Introduction: Rustup, Cargo setup",
        "Data Types: i32, f64, str, String",
        "Control Flow: if, match, loops",
        "Ownership and Borrowing basics",
      ],
      books: ["The Rust Programming Language by Steve Klabnik"],
      resources: ["Rust by Example", "Rustlings"],
    },
    {
      milestone: "Milestone 2: Intermediate Rust",
      topics: [
        "Structs and Enums",
        "Pattern Matching with match",
        "Modules and Crates",
        "Error Handling: Result, Option",
      ],
      books: ["Rust for Rustaceans by Jon Gjengset"],
      resources: ["HackerRank", "Exercism"],
    },
    {
      milestone: "Milestone 3: Advanced Rust",
      topics: [
        "Concurrency: Threads, async/await",
        "Lifetimes and Memory Safety",
        "Macros: Declarative and procedural",
        "Unsafe Rust basics",
      ],
      books: ["Programming Rust by Jim Blandy"],
      resources: ["LeetCode", "Rust Playground"],
    },
    {
      milestone: "Milestone 4: Projects",
      topics: [
        "Build a CLI tool with Clap",
        "Create a web server with Actix",
        "Systems programming with Rust",
        "Contribute to open-source Rust projects",
      ],
      books: [],
      resources: ["GitHub", "Crates.io"],
    },
  ],
};

const RustRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          Rust Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.Rust.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.Rust.textClass} border-4`}
                style={{
                  borderImage: colorMap.Rust.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.Rust.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.Rust.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.Rust.textClass}`}>
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
              {index < programmingRoadmapData.Rust.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.Rust.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RustRoadmap;