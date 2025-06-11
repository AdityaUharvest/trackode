"use client"
import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

   

    

    const tcsNqtRoadmap = {
      sections: [
        {
          name: "Numerical Ability",
          topics: [
            {
              name: "Number Systems",
              questions: "3-5",
              time: "5-7 mins",
              cutoff: "60%",
              subtopics: [
                "Divisibility rules",
                "LCM and HCF",
                "Decimals and Fractions",
                "Surds and Indices",
              ],
            },
            {
              name: "Algebra",
              questions: "3-4",
              time: "4-6 mins",
              cutoff: "60%",
              subtopics: [
                "Linear Equations",
                "Quadratic Equations",
                "Progressions",
                "Inequalities",
              ],
            },
            {
              name: "Geometry",
              questions: "2-3",
              time: "3-5 mins",
              cutoff: "60%",
              subtopics: [
                "Lines and Angles",
                "Triangles and Circles",
                "Mensuration",
                "Coordinate Geometry",
              ],
            },
            {
              name: "Trigonometry",
              questions: "1-2",
              time: "2-3 mins",
              cutoff: "60%",
              subtopics: [
                "Ratios and Identities",
                "Height and Distance",
                "Trigonometric Equations",
              ],
            },
            {
              name: "Probability & Statistics",
              questions: "2-3",
              time: "3-4 mins",
              cutoff: "60%",
              subtopics: [
                "Permutations & Combinations",
                "Probability Theory",
                "Mean, Median, Mode",
                "Standard Deviation",
              ],
            },
          ],
          books: [
            "Quantitative Aptitude by R.S. Aggarwal",
            "Fast Track Objective Arithmetic by Rajesh Verma",
            "Quantitative Aptitude for Competitive Examinations by Abhijit Guha",
          ],
        },
        {
          name: "Verbal Ability",
          topics: [
            {
              name: "Reading Comprehension",
              questions: "3-5",
              time: "5-7 mins",
              cutoff: "60%",
              subtopics: [
                "Passage-based questions",
                "Inference questions",
                "Vocabulary in context",
              ],
            },
            {
              name: "Grammar",
              questions: "2-3",
              time: "3-5 mins",
              cutoff: "60%",
              subtopics: [
                "Subject-Verb Agreement",
                "Tenses",
                "Prepositions",
                "Articles",
              ],
            },
            {
              name: "Vocabulary",
              questions: "3-5",
              time: "4-6 mins",
              cutoff: "60%",
              subtopics: [
                "Synonyms & Antonyms",
                "Idioms & Phrases",
                "Word Usage",
                "One-word Substitution",
              ],
            },
            {
              name: "Para Jumbles",
              questions: "1-3",
              time: "2-4 mins",
              cutoff: "60%",
              subtopics: [
                "Sentence Rearrangement",
                "Paragraph Completion",
                "Sentence Elimination",
              ],
            },
            {
              name: "Word Completion",
              questions: "1-3",
              time: "2-3 mins",
              cutoff: "60%",
              subtopics: [
                "Fill in the blanks",
                "Cloze Test",
              ],
            },
            {
              name: "Sentence Completion",
              questions: "1-3",
              time: "2-3 mins",
              cutoff: "60%",
              subtopics: [
                "Sentence Completion",
                "Error Spotting",
              ],
            },
            {
              name: "Error Identification",
              questions: "2-3",
              time: "3-4 mins",
              cutoff: "60%",
              subtopics: [
                "Spotting Errors",
                "Grammar Corrections",
              ],
            },
          ],
          books: [
            "Word Power Made Easy by Norman Lewis",
            "High School English Grammar by Wren & Martin",
            "Objective General English by S.P. Bakshi",
          ],
        },
        {
          name: "Reasoning Ability",
          topics: [
            {
              name: "Logical Reasoning",
              questions: "3-5",
              time: "5-7 mins",
              cutoff: "60%",
              subtopics: [
                "Number Series",
                "Letter Series",
                "Coding-Decoding",
                "Blood Relations",
              ],
            },
            {
              name: "Analytical Reasoning",
              questions: "3-4",
              time: "4-6 mins",
              cutoff: "60%",
              subtopics: [
                "Direction Sense",
                "Seating Arrangement",
                "Puzzles",
                "Syllogism",
              ],
            },
            {
              name: "Non-Verbal Reasoning",
              questions: "2-3",
              time: "3-5 mins",
              cutoff: "60%",
              subtopics: [
                "Pattern Completion",
                "Figure Series",
                "Mirror Images",
                "Paper Folding",
              ],
            },
          ],
          books: [
            "A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal",
            "Analytical Reasoning by M.K. Pandey",
            "Logical and Analytical Reasoning by A.K. Gupta",
          ],
        },
        {
          name: "Programming Concepts",
          topics: [
            {
              name: "Basic Programming",
              questions: "2-3",
              time: "3-5 mins",
              cutoff: "70%",
              subtopics: [
                "Data Types",
                "Operators",
                "Control Structures",
                "Functions",
              ],
            },
            {
              name: "Data Structures",
              questions: "2-3",
              time: "3-4 mins",
              cutoff: "70%",
              subtopics: [
                "Arrays",
                "Strings",
                "Linked Lists",
                "Stacks and Queues",
              ],
            },
            {
              name: "Algorithms",
              questions: "1-2",
              time: "2-3 mins",
              cutoff: "70%",
              subtopics: [
                "Sorting Algorithms",
                "Searching Algorithms",
                "Complexity Analysis",
                "Recursion",
              ],
            },
            {
              name: "DBMS Basics",
              questions: "1-2",
              time: "2-3 mins",
              cutoff: "70%",
              subtopics: [
                "SQL Queries",
                "Normalization",
                "ER Diagrams",
                "Keys and Constraints",
              ],
            },
          ],
          books: [
            "Programming in C by E Balagurusamy",
            "Data Structures and Algorithms Made Easy by Narasimha Karumanchi",
            "Database System Concepts by Abraham Silberschatz",
          ],
        },
        {
          name: "Advanced Section",
          topics: [
            {
              name: "Advanced Quantitative Ability",
              questions: "3-5",
              time: "5-7 mins",
              cutoff: "65%",
              subtopics: [
                "Advanced Percentages",
                "Complex Ratios",
                "Probability",
                "Time & Work",
                "Data Interpretation",
              ],
            },
            {
              name: "Advanced Reasoning Ability",
              questions: "3-5",
              time: "5-7 mins",
              cutoff: "65%",
              subtopics: [
                "Advanced Coding-Decoding",
                "Complex Puzzles",
                "Syllogisms",
                "Statement and Assumption",
                "Logical Sequence",
              ],
            },
            {
              name: "Advanced Coding",
              questions: "3",
              time: "90 mins",
              cutoff: "2-3 problems",
              subtopics: [
                "Data Structures (Arrays, Strings, Linked Lists)",
                "Algorithms (Sorting, Searching, Recursion)",
                "Complexity Analysis",
                "Coding in C/C++/Java/Python/Perl",
              ],
            },
          ],
          resources: [
            "GeeksforGeeks TCS NQT Advanced Coding Questions",
            "HackerRank Advanced Coding Challenges",
            "LeetCode Medium to Hard Problems",
            "CodeChef Competitive Programming",
          ],
        },
        {
          name: "Coding Practice",
          topics: [
            {
              name: "Pattern Problems",
              questions: "1-2",
              time: "10-15 mins",
              cutoff: "1-2 problems",
              subtopics: [
                "Star Patterns",
                "Number Patterns",
                "Character Patterns",
              ],
            },
            {
              name: "Array Manipulation",
              questions: "1-2",
              time: "10-15 mins",
              cutoff: "1-2 problems",
              subtopics: [
                "Searching and Sorting",
                "Subarray Problems",
                "Matrix Operations",
              ],
            },
            {
              name: "String Problems",
              questions: "1-2",
              time: "10-15 mins",
              cutoff: "1-2 problems",
              subtopics: [
                "Palindrome Checks",
                "Anagram Detection",
                "String Reversal",
              ],
            },
            {
              name: "Mathematical Problems",
              questions: "1-2",
              time: "10-15 mins",
              cutoff: "1-2 problems",
              subtopics: [
                "Prime Numbers",
                "Factorials",
                "Fibonacci Series",
              ],
            },
          ],
          resources: [
            "GeeksforGeeks TCS Coding Questions",
            "HackerRank TCS Practice Section",
            "LeetCode Easy Problems",
            "CodeChef Beginner Problems",
          ],
        },
      ],
      generalTips: [
        "Practice at least 2 mock tests per week under timed conditions",
        "Focus on accuracy rather than attempting all questions",
        "Learn keyboard shortcuts for the TCS test interface",
        "Manage time effectively - don't spend too long on any single question",
        "Review basic formulas and concepts regularly",
      ],
    };

const TCS = () => {
  
  
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  return (
    <section
      className={` relative overflow-hidden ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}
    >
      <div className=" mx-auto px-4">
        {/* Theme Toggle Button */}
        

        <h2
          className={`lg:text-4xl text-3xl font-bold text-center mb-5 ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-100'
          }`}
        >
          TCS NQT Roadmaps
        </h2>

        {/* Tab Selection */}
        

        
          <div
            className={`rounded-lg shadow-lg p-6 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-900'
            }`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${
                theme === 'light' ? 'text-green-700' : 'text-green-400'
              }`}
            >
              TCS NQT Complete Preparation Guide
            </h3>

            <div className="mb-8">
              <h4
                className={`text-lg font-semibold mb-4 ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                }`}
              >
                Exam Pattern Overview
              </h4>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div
                  className={`p-4 rounded-lg border ${
                    theme === 'light'
                      ? 'bg-green-50 border-green-100'
                      : 'bg-green-900 border-green-800'
                  }`}
                >
                  <h5
                    className={`font-bold ${
                      theme === 'light' ? 'text-green-700' : 'text-green-400'
                    }`}
                  >
                    Numerical Ability
                  </h5>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    20 questions
                  </p>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    25 minutes
                  </p>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    Cutoff: ~60%
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    theme === 'light'
                      ? 'bg-blue-50 border-blue-100'
                      : 'bg-blue-900 border-blue-800'
                  }`}
                >
                  <h5
                    className={`font-bold ${
                      theme === 'light' ? 'text-blue-700' : 'text-blue-400'
                    }`}
                  >
                    Verbal Ability
                  </h5>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    25 questions
                  </p>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    25 minutes
                  </p>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    Cutoff: ~60%
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    theme === 'light'
                      ? 'bg-purple-50 border-purple-100'
                      : 'bg-purple-900 border-purple-800'
                  }`}
                >
                  <h5
                    className={`font-bold ${
                      theme === 'light' ? 'text-purple-700' : 'text-purple-400'
                    }`}
                  >
                    Reasoning Ability
                  </h5>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    20 questions
                  </p>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    25 minutes
                  </p>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    Cutoff: ~60%
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    theme === 'light'
                      ? 'bg-yellow-50 border-yellow-100'
                      : 'bg-yellow-900 border-yellow-800'
                  }`}
                >
                  <h5
                    className={`font-bold ${
                      theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'
                    }`}
                  >
                    Advanced Section
                  </h5>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    33 questions
                  </p>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    115 minutes
                  </p>
                  <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    Cutoff: ~65%
                  </p>
                </div>
              </div>
            </div>

            {tcsNqtRoadmap.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h4
                  className={`text-xl font-semibold mb-4 ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                  }`}
                >
                  {section.name}
                </h4>
                <div className="overflow-x-auto">
                  <table
                    className={`min-w-full border ${
                      theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
                    }`}
                  >
                    <thead
                      className={theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}
                    >
                      <tr>
                        <th
                          className={`py-2 px-4 border-b ${
                            theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                          }`}
                        >
                          Topic
                        </th>
                        <th
                          className={`py-2 px-4 border-b ${
                            theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                          }`}
                        >
                          Questions
                        </th>
                        <th
                          className={`py-2 px-4 border-b ${
                            theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                          }`}
                        >
                          Time
                        </th>
                        <th
                          className={`py-2 px-4 border-b ${
                            theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                          }`}
                        >
                          Cutoff
                        </th>
                        <th
                          className={`py-2 px-4 border-b ${
                            theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                          }`}
                        >
                          Subtopics
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.topics.map((topic, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0
                              ? theme === 'light'
                                ? 'bg-gray-50'
                                : 'bg-gray-800'
                              : theme === 'light'
                              ? 'bg-white'
                              : 'bg-gray-900'
                          }
                        >
                          <td
                            className={`py-2 px-4 border-b font-medium ${
                              theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                            }`}
                          >
                            {topic.name}
                          </td>
                          <td
                            className={`py-2 px-4 border-b ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                            }`}
                          >
                            {topic.questions}
                          </td>
                          <td
                            className={`py-2 px-4 border-b ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                            }`}
                          >
                            {topic.time}
                          </td>
                          <td
                            className={`py-2 px-4 border-b ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                            }`}
                          >
                            {topic.cutoff}
                          </td>
                          <td
                            className={`py-2 px-4 border-b ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                            }`}
                          >
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
                    <h5
                      className={`font-semibold mb-2 ${
                        theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                      }`}
                    >
                      Recommended Books:
                    </h5>
                    <ul
                      className={`list-disc pl-5 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}
                    >
                      {section.books.map((book, i) => (
                        <li key={i} className="mb-1">{book}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.resources && (
                  <div className="mt-4">
                    <h5
                      className={`font-semibold mb-2 ${
                        theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                      }`}
                    >
                      Practice Resources:
                    </h5>
                    <ul
                      className={`list-disc pl-5 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}
                    >
                      {section.resources.map((resource, i) => (
                        <li key={i} className="mb-1">{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div
              className={`p-6 rounded-lg border ${
                theme === 'light'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-blue-900 border-blue-800'
              }`}
            >
              <h4
                className={`text-xl font-semibold mb-4 ${
                  theme === 'light' ? 'text-blue-800' : 'text-blue-400'
                }`}
              >
                Preparation Tips
              </h4>
              <ul
                className={`list-disc pl-5 space-y-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}
              >
                {tcsNqtRoadmap.generalTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        
      </div>
    </section>
  );
};

export default TCS;