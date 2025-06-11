"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const bankingExamsMockTestData = {
  exam: "Banking Exams (IBPS PO, SBI PO, etc.)",
  platforms: [
    { name: "Oliveboard", url: "https://www.oliveboard.in/banking-mock-tests" },
    { name: "Testbook", url: "https://testbook.com/banking" },
    { name: "Bankers Adda", url: "https://www.bankersadda.com/mock-tests" },
  ],
  sampleQuestions: [
    "Quantitative Aptitude: A train travels 360 km in 4 hours. Find its speed in km/h.",
    "Reasoning: Solve the puzzle: Arrange 5 people in a circular table with constraints.",
    "English: Spot the error: 'The team have won the match.'",
    "General Awareness: What is the repo rate set by RBI in 2025?",
  ],
};

const BankingExamsMockTests = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          Banking Exams Mock Tests
        </h2>
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {bankingExamsMockTestData.exam} Practice Resources
          </h3>
          <div className="mb-4">
            <h4 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Practice Platforms:</h4>
            <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
              {bankingExamsMockTestData.platforms.map((platform, i) => (
                <li key={i} className="mb-1">
                  <a href={platform.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {platform.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Sample Questions:</h4>
            <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
              {bankingExamsMockTestData.sampleQuestions.map((question, i) => (
                <li key={i} className="mb-1">{question}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankingExamsMockTests;