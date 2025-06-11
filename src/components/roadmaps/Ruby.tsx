"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  Ruby: {
    borderGradient: "linear-gradient(to right, #CC0000, #990000)",
    badgeGradient: "linear-gradient(to right, #CC0000, #990000)",
    textClass: "text-red-600",
  },
};

const programmingRoadmapData = {
  Ruby: [
    {
      milestone: "Milestone 1: Ruby Basics",
      topics: [
        "Introduction: Setup, IRB, basic syntax",
        "Data Types: Numbers, strings, arrays, hashes",
        "Control Structures: if-else, loops, case",
        "Methods: Defining, calling, blocks",
      ],
      books: ["Programming Ruby by Dave Thomas"],
      resources: ["RubyGuides", "TutorialsPoint"],
    },
    {
      milestone: "Milestone 2: Intermediate Ruby",
      topics: [
        "Modules and Mixins: Organizing code",
        "Gems: Using RubyGems, bundler",
        "File Handling: Reading/writing files",
        "Regular Expressions: Pattern matching",
      ],
      books: ["The Well-Grounded Rubyist by David A. Black"],
      resources: ["Codewars", "HackerRank"],
    },
    {
      milestone: "Milestone 3: Advanced Ruby",
      topics: [
        "Metaprogramming: Dynamic methods",
        "Concurrency: Threads, fibers",
        "Testing: RSpec, Minitest",
        "Ruby on Rails: MVC basics",
      ],
      books: ["Eloquent Ruby by Russ Olsen"],
      resources: ["LeetCode", "RubyMonk"],
    },
    {
      milestone: "Milestone 4: Projects",
      topics: [
        "Build a command-line app",
        "Create a simple Rails web app",
        "API integration with HTTParty",
        "Automate tasks with Rake",
      ],
      books: [],
      resources: ["GitHub", "CodePen"],
    },
  ],
};

const RubyRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          Ruby Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.Ruby.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.Ruby.textClass} border-4`}
                style={{
                  borderImage: colorMap.Ruby.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.Ruby.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.Ruby.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.Ruby.textClass}`}>
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
              {index < programmingRoadmapData.Ruby.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.Ruby.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RubyRoadmap;