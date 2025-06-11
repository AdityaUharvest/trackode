"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const upscCSEMockTestData = {
  exam: "UPSC CSE (Prelims)",
  platforms: [
    { name: "Vision IAS", url: "https://www.visionias.in/test-series" },
    { name: "Drishti IAS", url: "https://www.drishtiias.com/mock-tests" },
    { name: "Testbook", url: "https://testbook.com/upsc" },
  ],
  sampleQuestions: [
    "Polity: What is the significance of Article 356 in the Indian Constitution?",
    "History: Who was the founder of the Maurya Empire?",
    "Geography: Name the largest river basin in India.",
    "Current Affairs: What is India’s renewable energy target for 2030?",
  ],
};

const UPSCCSEMockTests = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          UPSC CSE Prelims Mock Tests
        </h2>
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {upscCSEMockTestData.exam} Practice Resources
          </h3>
          <div className="mb-4">
            <h4 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Practice Platforms:</h4>
            <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
              {upscCSEMockTestData.platforms.map((platform, i) => (
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
              {upscCSEMockTestData.sampleQuestions.map((question, i) => (
                <li key={i} className="mb-1">{question}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UPSCCSEMockTests;