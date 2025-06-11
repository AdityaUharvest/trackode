"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  R: {
    borderGradient: "linear-gradient(to right, #198CE7, #0051A8)",
    badgeGradient: "linear-gradient(to right, #198CE7, #0051A8)",
    textClass: "text-blue-500",
  },
};

const programmingRoadmapData = {
  R: [
    {
      milestone: "Milestone 1: R Basics",
      topics: [
        "Introduction: R setup, RStudio",
        "Data Types: Numeric, character, factors",
        "Control Structures: if, for, while",
        "Vectors and Data Frames",
      ],
      books: ["R for Data Science by Hadley Wickham"],
      resources: ["RStudio Education", "DataCamp"],
    },
    {
      milestone: "Milestone 2: Intermediate R",
      topics: [
        "Data Manipulation: dplyr, tidyr",
        "Visualization: ggplot2 basics",
        "Functions: Writing custom functions",
        "Lists and Matrices",
      ],
      books: ["R Programming for Data Science by Roger Peng"],
      resources: ["HackerRank", "Kaggle"],
    },
    {
      milestone: "Milestone 3: Advanced R",
      topics: [
        "Statistical Modeling: Linear regression",
        "Shiny: Building interactive apps",
        "Parallel Computing: foreach, doParallel",
        "Package Development",
      ],
      books: ["Advanced R by Hadley Wickham"],
      resources: ["LeetCode", "R-Bloggers"],
    },
    {
      milestone: "Milestone 4: Projects",
      topics: [
        "Build a data dashboard with Shiny",
        "Data analysis with real datasets",
        "Machine learning with caret",
        "Publish an R package",
      ],
      books: [],
      resources: ["GitHub", "CRAN"],
    },
  ],
};

const RRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          R Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.R.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.R.textClass} border-4`}
                style={{
                  borderImage: colorMap.R.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.R.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.R.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.R.textClass}`}>
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
              {index < programmingRoadmapData.R.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.R.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RRoadmap;