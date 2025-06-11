"use client"
import React from 'react';
import { useTheme } from '../ThemeContext';

const sscCHSLRoadmap = {
  sections: [
    {
      name: "General Intelligence & Reasoning",
      topics: [
        {
          name: "Verbal Reasoning",
          questions: "15-20",
          time: "15-20 mins",
          cutoff: "60%",
          subtopics: [
            "Analogy",
            "Classification",
            "Series Completion",
            "Coding-Decoding",
            "Blood Relations"
          ],
        },
        {
          name: "Non-Verbal Reasoning",
          questions: "5-10",
          time: "10-15 mins",
          cutoff: "60%",
          subtopics: [
            "Pattern Recognition",
            "Figure Formation",
            "Mirror Images",
            "Paper Folding"
          ],
        },
      ],
      books: [
        "A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal",
        ],
    },
    {
      name: "General Awareness",
      topics: [
        {
          name: "Current Affairs",
          questions: "10-15",
          time: "10-15 mins",
          cutoff: "60%",
          subtopics: [
            "National & International Events",
            "Sports",
            "Awards & Honors",
            "Books & Authors"
          ],
        },
        {
          name: "Static GK",
          questions: "10-15",
          time: "10-15 mins",
          cutoff: "60%",
          subtopics: [
            "History",
            "Geography",
            "Indian Polity",
            "Economics",
            "Science & Technology"
          ],
        },
      ],
      books: [
        "Lucent's General Knowledge",
        "Manorama Yearbook"
      ],
    },
    {
      name: "Quantitative Aptitude",
      topics: [
        {
          name: "Arithmetic",
          questions: "10-12",
          time: "15-20 mins",
          cutoff: "60%",
          subtopics: [
            "Number System",
            "Percentage",
            "Profit & Loss",
            "Ratio & Proportion",
            "Time & Work"
          ],
        },
        {
          name: "Algebra & Geometry",
          questions: "8-10",
          time: "10-15 mins",
          cutoff: "60%",
          subtopics: [
            "Simple Equations",
            "Mensuration",
            "Trigonometry",
            "Data Interpretation"
          ],
        },
      ],
      books: [
        "Quantitative Aptitude by R.S. Aggarwal",
        "Fast Track Objective Arithmetic by Rajesh Verma"
      ],
    },
    {
      name: "English Language",
      topics: [
        {
          name: "Comprehension",
          questions: "5-10",
          time: "10-15 mins",
          cutoff: "60%",
          subtopics: [
            "Reading Passages",
            "Theme Detection",
            "Contextual Vocabulary"
          ],
        },
        {
          name: "Grammar & Vocabulary",
          questions: "15-20",
          time: "15-20 mins",
          cutoff: "60%",
          subtopics: [
            "Error Spotting",
            "Sentence Improvement",
            "Synonyms & Antonyms",
            "Idioms & Phrases"
          ],
        },
      ],
      books: [
        "Objective General English by S.P. Bakshi",
        "High School English Grammar by Wren & Martin"
      ],
    },
  ],
  generalTips: [
    "Focus on speed and accuracy as the exam is time-bound",
    "Practice previous year question papers regularly",
    "Stay updated with current affairs from last 6 months",
    "Improve calculation speed for quantitative section",
    "Take sectional mock tests weekly"
  ],
};

const SSCCHSLPreparation = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          SSC CHSL Preparation Guide
        </h2>
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>
            SSC CHSL Complete Preparation Guide
          </h3>
          
          <div className="mb-8">
            <h4 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              Exam Pattern Overview
            </h4>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-blue-50 border-blue-100' : 'bg-blue-900 border-blue-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>Tier 1</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>100 questions</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>60 minutes</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Cutoff: ~110-130</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-purple-50 border-purple-100' : 'bg-purple-900 border-purple-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>Tier 2</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Objective + Descriptive</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>60+60 minutes</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Cutoff: ~45%</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-green-50 border-green-100' : 'bg-green-900 border-green-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>Negative Marking</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>0.25 marks per question</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Tier 1 only</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-yellow-50 border-yellow-100' : 'bg-yellow-900 border-yellow-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'}`}>Total Marks</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Tier 1: 200</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Tier 2: 300</p>
              </div>
            </div>
          </div>

          {sscCHSLRoadmap.sections.map((section, index) => (
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
            </div>
          ))}

          <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900 border-blue-800'}`}>
            <h4 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-blue-800' : 'text-blue-400'}`}>Preparation Tips</h4>
            <ul className={`list-disc pl-5 space-y-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
              {sscCHSLRoadmap.generalTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SSCCHSLPreparation;