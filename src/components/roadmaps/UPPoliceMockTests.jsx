"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const upPoliceMockTestData = {
  exam: "UP Police Constable",
  platforms: [
    { name: "Testbook", url: "https://testbook.com/up-police" },
    { name: "Jagran Josh", url: "https://www.jagranjosh.com/exams/up-police/mock-tests" },
    { name: "Adda247", url: "https://www.adda247.com/up-police-mock-tests" },
  ],
  sampleQuestions: [
    "Numerical Ability: Find the average of numbers from 1 to 10.",
    "General Hindi: Correct the sentence: 'वह पुस्तक पढ़ता है रोज।'",
    "General Knowledge: Who is the Governor of Uttar Pradesh in 2025?",
    "Mental Ability: Find the missing number: 4, 9, 16, ?, 36.",
  ],
};

const UPPoliceMockTests = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          UP Police Constable Mock Tests
        </h2>
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {upPoliceMockTestData.exam} Practice Resources
          </h3>
          <div className="mb-4">
            <h4 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Practice Platforms:</h4>
            <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
              {upPoliceMockTestData.platforms.map((platform, i) => (
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
              {upPoliceMockTestData.sampleQuestions.map((question, i) => (
                <li key={i} className="mb-1">{question}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UPPoliceMockTests;