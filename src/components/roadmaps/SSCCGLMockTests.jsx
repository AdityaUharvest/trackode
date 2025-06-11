"use client"
import React from 'react';
import { useTheme } from '../ThemeContext';

const sscCGLRoadmap = {
  sections: [
    {
      name: "Tier 1: Quantitative Aptitude",
      topics: [
        {
          name: "Basic Mathematics",
          questions: "15-20",
          time: "20-25 mins",
          cutoff: "60%",
          subtopics: [
            "Number System",
            "Percentage",
            "Ratio & Proportion",
            "Average",
            "Profit & Loss"
          ],
        },
        {
          name: "Advanced Mathematics",
          questions: "10-15",
          time: "15-20 mins",
          cutoff: "60%",
          subtopics: [
            "Algebra",
            "Geometry",
            "Trigonometry",
            "Mensuration",
            "Data Interpretation"
          ],
        },
      ],
      books: [
        "Quantitative Aptitude by R.S. Aggarwal",
        "Advanced Mathematics by Rakesh Yadav"
      ],
    },
    {
      name: "Tier 1: General Intelligence & Reasoning",
      topics: [
        {
          name: "Verbal Reasoning",
          questions: "15-20",
          time: "15-20 mins",
          cutoff: "60%",
          subtopics: [
            "Analogy",
            "Classification",
            "Series",
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
      name: "Tier 1: English Language",
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
    {
      name: "Tier 1: General Awareness",
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
      name: "Tier 2: Statistics",
      topics: [
        {
          name: "Statistical Concepts",
          questions: "30-40",
          time: "120 mins",
          cutoff: "40%",
          subtopics: [
            "Collection & Representation of Data",
            "Measures of Central Tendency",
            "Correlation & Regression",
            "Probability Theory",
            "Sampling Techniques"
          ],
        },
      ],
      books: [
        "Fundamentals of Statistics by S.C. Gupta",
        "Statistics for Economics by Class XI NCERT"
      ],
    },
    {
      name: "Tier 3: Descriptive Test",
      topics: [
        {
          name: "Essay Writing",
          questions: "1",
          time: "60 mins",
          cutoff: "33%",
          subtopics: [
            "Social Issues",
            "Economic Policies",
            "Environmental Concerns",
            "Technology & Innovation"
          ],
        },
        {
          name: "Letter/Application",
          questions: "1",
          time: "30 mins",
          cutoff: "33%",
          subtopics: [
            "Formal Letter Writing",
            "Informal Letter Writing",
            "Application Writing"
          ],
        },
      ],
      books: [
        "Descriptive English by K.K. Singh",
        "High School English Grammar by Wren & Martin"
      ],
    },
  ],
  generalTips: [
    "Focus on accuracy in Tier 1 due to negative marking",
    "Practice previous year papers for Tier 2 statistics section",
    "Develop essay writing skills for Tier 3",
    "Create a monthly current affairs revision schedule",
    "Join online test series for regular practice"
  ],
};

const SSCCGLPreparation = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          SSC CGL Preparation Guide
        </h2>
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>
            SSC CGL Complete Preparation Guide
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
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Cutoff: ~120-150</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-purple-50 border-purple-100' : 'bg-purple-900 border-purple-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>Tier 2</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>4 Papers</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>330 minutes</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Cutoff: ~40-50%</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-green-50 border-green-100' : 'bg-green-900 border-green-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>Tier 3</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Descriptive Test</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>60 minutes</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>100 marks</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-yellow-50 border-yellow-100' : 'bg-yellow-900 border-yellow-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'}`}>Tier 4</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Skill Test</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Computer Proficiency</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Qualifying Nature</p>
              </div>
            </div>
          </div>

          {sscCGLRoadmap.sections.map((section, index) => (
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
              {sscCGLRoadmap.generalTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SSCCGLPreparation;