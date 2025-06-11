"use client"
import React from 'react';
import { useTheme } from '../ThemeContext';

const gateRoadmap = {
  sections: [
    {
      name: "General Aptitude",
      topics: [
        {
          name: "Verbal Ability",
          questions: "5",
          time: "15 mins",
          cutoff: "15%",
          subtopics: [
            "English Grammar",
            "Sentence Completion",
            "Word Groups",
            "Critical Reasoning"
          ],
        },
        {
          name: "Numerical Ability",
          questions: "5",
          time: "15 mins",
          cutoff: "15%",
          subtopics: [
            "Numerical Computation",
            "Data Interpretation",
            "Numerical Estimation"
          ],
        },
      ],
      books: [
        "General Aptitude for GATE by GKP",
        "Verbal & Non-Verbal Reasoning by R.S. Aggarwal"
      ],
    },
    {
      name: "Engineering Mathematics",
      topics: [
        {
          name: "Linear Algebra",
          questions: "2-3",
          time: "10 mins",
          cutoff: "70%",
          subtopics: [
            "Matrix Algebra",
            "Systems of Equations",
            "Eigenvalues & Eigenvectors"
          ],
        },
        {
          name: "Calculus",
          questions: "2-3",
          time: "10 mins",
          cutoff: "70%",
          subtopics: [
            "Limits & Continuity",
            "Partial Derivatives",
            "Maxima & Minima"
          ],
        },
        {
          name: "Probability & Statistics",
          questions: "2-3",
          time: "10 mins",
          cutoff: "70%",
          subtopics: [
            "Random Variables",
            "Probability Distributions",
            "Hypothesis Testing"
          ],
        },
      ],
      books: [
        "Higher Engineering Mathematics by B.S. Grewal",
        "Engineering Mathematics by GATE Academy"
      ],
    },
    {
      name: "Core Subjects (Computer Science)",
      topics: [
        {
          name: "Digital Logic",
          questions: "3-4",
          time: "15 mins",
          cutoff: "70%",
          subtopics: [
            "Number Representation",
            "Combinational Circuits",
            "Sequential Circuits"
          ],
        },
        {
          name: "Algorithms",
          questions: "5-6",
          time: "20 mins",
          cutoff: "70%",
          subtopics: [
            "Asymptotic Analysis",
            "Sorting & Searching",
            "Graph Algorithms",
            "Dynamic Programming"
          ],
        },
        {
          name: "Operating Systems",
          questions: "4-5",
          time: "15 mins",
          cutoff: "70%",
          subtopics: [
            "Process Management",
            "Memory Management",
            "File Systems"
          ],
        },
        {
          name: "Computer Networks",
          questions: "4-5",
          time: "15 mins",
          cutoff: "70%",
          subtopics: [
            "OSI & TCP/IP Models",
            "Routing Algorithms",
            "Network Security"
          ],
        },
      ],
      books: [
        "Computer Networks by Andrew S. Tanenbaum",
        "Operating System Concepts by Silberschatz",
        "Introduction to Algorithms by Cormen"
      ],
    },
    {
      name: "Practice & Revision",
      topics: [
        {
          name: "Mock Tests",
          questions: "65",
          time: "3 hours",
          cutoff: "Varies",
          subtopics: [
            "Full-length Tests",
            "Subject-wise Tests",
            "Previous Year Papers"
          ],
        },
        {
          name: "Revision Strategy",
          questions: "NA",
          time: "Daily",
          cutoff: "NA",
          subtopics: [
            "Formula Sheets",
            "Important Concepts",
            "Common Mistakes"
          ],
        },
      ],
      resources: [
        "GATE Overflow Community",
        "Made Easy Test Series",
        "NPTEL Video Lectures"
      ],
    },
  ],
  generalTips: [
    "Focus on core subjects as they carry maximum weightage",
    "Solve previous 10 years' GATE papers",
    "Join online test series for regular evaluation",
    "Create formula sheets for quick revision",
    "Balance preparation between technical and aptitude sections"
  ],
};

const GATEPreparation = () => {
  const { theme } = useTheme();
  return (
    <section className={`relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      <div className="mx-auto px-4">
        <h2 className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          GATE Preparation Guide
        </h2>
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>
            GATE Complete Preparation Guide
          </h3>
          
          <div className="mb-8">
            <h4 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              Exam Pattern Overview
            </h4>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-blue-50 border-blue-100' : 'bg-blue-900 border-blue-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>Total Marks</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>100 marks</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>65 questions</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-purple-50 border-purple-100' : 'bg-purple-900 border-purple-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>Duration</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>3 hours</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Computer-based Test</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-green-50 border-green-100' : 'bg-green-900 border-green-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>Marking Scheme</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>1/2 Marks: +1/+2</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>MCQs: -0.33/NAT: 0</p>
              </div>
              <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-yellow-50 border-yellow-100' : 'bg-yellow-900 border-yellow-800'}`}>
                <h5 className={`font-bold ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'}`}>Cutoff</h5>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Varies by branch</p>
                <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>CS: ~25-35/100</p>
              </div>
            </div>
          </div>

          {gateRoadmap.sections.map((section, index) => (
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
              {gateRoadmap.generalTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GATEPreparation;