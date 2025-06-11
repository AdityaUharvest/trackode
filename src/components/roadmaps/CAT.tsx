"use client";
import React from 'react';
import { useTheme } from '../ThemeContext';

const catPreparationData = {
  sections: [
    {
      name: "Verbal Ability & Reading Comprehension",
      topics: [
        {
          name: "Reading Comprehension",
          questions: "8-10",
          time: "15-20 mins",
          cutoff: "60%",
          subtopics: ["Passage Analysis", "Inference Questions", "Vocabulary in Context"],
        },
        {
          name: "Grammar & Vocabulary",
          questions: "6-8",
          time: "10-12 mins",
          cutoff: "60%",
          subtopics: ["Sentence Correction", "Synonyms & Antonyms", "Fill in the Blanks"],
        },
      ],
      books: ["How to Prepare for Verbal Ability by Arun Sharma"],
      resources: ["Shiksha.com", "Byju’s"],
    },
    {
      name: "Data Interpretation & Logical Reasoning",
      topics: [
        {
          name: "Data Interpretation",
          questions: "10-12",
          time: "15-18 mins",
          cutoff: "60%",
          subtopics: ["Tables", "Graphs", "Charts"],
        },
        {
          name: "Logical Reasoning",
          questions: "10-12",
          time: "15-18 mins",
          cutoff: "60%",
          subtopics: ["Puzzles", "Seating Arrangements", "Blood Relations"],
        },
      ],
      books: ["How to Prepare for Data Interpretation by Arun Sharma"],
      resources: ["Testbook", "Oliveboard"],
    },
    {
      name: "Quantitative Ability",
      topics: [
        {
          name: "Arithmetic",
          questions: "8-10",
          time: "12-15 mins",
          cutoff: "60%",
          subtopics: ["Percentages", "Profit & Loss", "Time & Work"],
        },
        {
          name: "Algebra",
          questions: "6-8",
          time: "10-12 mins",
          cutoff: "60%",
          subtopics: ["Linear Equations", "Quadratic Equations", "Inequalities"],
        },
      ],
      books: ["Quantitative Aptitude for CAT by Nishit K. Sinha"],
      resources: ["Career Launcher", "IMS Learning"],
    },
  ],
  generalTips: [
    "Practice mock tests weekly",
    "Focus on time management",
    "Review weak areas regularly",
    "Solve previous year papers",
  ],
};

const CATPreparation = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          CAT Preparation Guide
        </h2>
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
            CAT Complete Preparation Guide
          </h3>
          <div className="mb-8">
            <h4 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              Exam Pattern Overview
            </h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-blue-50 border-blue-100' : 'bg-blue-900 border-blue-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>VARC</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>24 questions</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>40 minutes</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Cutoff: ~60%</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-purple-50 border-purple-100' : 'bg-purple-900 border-purple-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>DILR</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>22 questions</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>40 minutes</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Cutoff: ~60%</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-green-50 border-green-100' : 'bg-green-900 border-green-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>QA</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>22 questions</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>40 minutes</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Cutoff: ~60%</p>
              </div>
            </div>
          </div>
          {catPreparationData.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h4 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                {section.name}
              </h4>
              <div className="overflow-x-auto">
                <table className={`min-w-full border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
                  <thead className={theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}>
                    <tr>
                      <th className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Topic</th>
                      <th className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Questions</th>
                      <th className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Time</th>
                      <th className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Cutoff</th>
                      <th className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Subtopics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.topics.map((topic, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? (theme === 'light' ? 'bg-gray-50' : 'bg-gray-800') : (theme === 'light' ? 'bg-white' : 'bg-gray-900')}>
                        <td className={`py-2 px-4 border-b font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>{topic.name}</td>
                        <td className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{topic.questions}</td>
                        <td className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{topic.time}</td>
                        <td className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{topic.cutoff}</td>
                        <td className={`py-2 px-4 border-b ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                          <ul className="list-disc list-inside">
                            {topic.subtopics.map((subtopic, i) => (
                              <li key={i} className="text-sm">{subtopic}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {section.books && (
                <div className="mt-4">
                  <h5 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Recommended Books:</h5>
                  <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                    {section.books.map((book, i) => (
                      <li key={i} className="mb-1">{book}</li>
                    ))}
                  </ul>
                </div>
              )}
              {section.resources && (
                <div className="mt-4">
                  <h5 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Practice Resources:</h5>
                  <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                    {section.resources.map((resource, i) => (
                      <li key={i} className="mb-1">{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900 border-blue-800'}`}>
            <h4 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-blue-800' : 'text-blue-400'}`}>Preparation Tips</h4>
            <ul className={`list-disc pl-5 space-y-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
              {catPreparationData.generalTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CATPreparation;