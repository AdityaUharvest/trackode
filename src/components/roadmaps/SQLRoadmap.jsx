"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const colorMap = {
  SQL: {
    borderGradient: "linear-gradient(to right, #3366CC, #003366)",
    badgeGradient: "linear-gradient(to right, #3366CC, #003366)",
    textClass: "text-blue-600",
  },
};

const programmingRoadmapData = {
  SQL: [
    {
      milestone: "Milestone 1: SQL Basics",
      topics: [
        "Introduction: Database setup, MySQL/PostgreSQL",
        "Basic Queries: SELECT, INSERT, UPDATE, DELETE",
        "Data Types: INT, VARCHAR, DATE",
        "Constraints: Primary key, foreign key",
      ],
      books: ["SQL in 10 Minutes, Sams Teach Yourself by Ben Forta"],
      resources: ["W3Schools", "SQLZoo"],
    },
    {
      milestone: "Milestone 2: Intermediate SQL",
      topics: [
        "Joins: INNER, LEFT, RIGHT, FULL",
        "Subqueries and Nested Queries",
        "Aggregations: COUNT, SUM, AVG, GROUP BY",
        "Indexes and Performance",
      ],
      books: ["SQL Queries for Mere Mortals by John L. Viescas"],
      resources: ["HackerRank", "LeetCode"],
    },
    {
      milestone: "Milestone 3: Advanced SQL",
      topics: [
        "Window Functions: ROW_NUMBER, RANK",
        "Common Table Expressions (CTEs)",
        "Stored Procedures and Triggers",
        "Database Optimization",
      ],
      books: ["SQL Cookbook by Anthony Molinaro"],
      resources: ["Mode Analytics", "SQLBolt"],
    },
    {
      milestone: "Milestone 4: Projects",
      topics: [
        "Design a database schema",
        "Build a reporting system",
        "Query optimization for large datasets",
        "Integrate SQL with a backend",
      ],
      books: [],
      resources: ["GitHub", "DB Fiddle"],
    },
  ],
};

const SQLRoadmap = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          SQL Learning Roadmap
        </h2>
        <div className="relative">
          {programmingRoadmapData.SQL.map((milestone, index) => (
            <div key={index} className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
              <div
                className={`absolute top-0 w-6 h-6 rounded-full ${colorMap.SQL.textClass} border-4`}
                style={{
                  borderImage: colorMap.SQL.borderGradient,
                  borderImageSlice: 1,
                  left: index % 2 === 0 ? '0' : 'auto',
                  right: index % 2 === 0 ? 'auto' : '0',
                }}
              ></div>
              <div
                className={`p-6 rounded-lg shadow-md mb-4 ${index % 2 === 0 ? 'ml-6' : 'mr-6'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                style={{
                  borderLeft: index % 2 === 0 ? `4px solid ${colorMap.SQL.borderGradient}` : 'none',
                  borderRight: index % 2 === 0 ? 'none' : `4px solid ${colorMap.SQL.borderGradient}`,
                }}
              >
                <h3 className={`text-xl font-semibold mb-4 ${colorMap.SQL.textClass}`}>
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
              {index < programmingRoadmapData.SQL.length - 1 && (
                <div
                  className={`absolute top-6 h-[calc(100%+48px)] w-1 ${index % 2 === 0 ? 'left-3' : 'right-3'}`}
                  style={{ background: colorMap.SQL.borderGradient }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SQLRoadmap;