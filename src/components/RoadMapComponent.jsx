"use client"
import React, { useState } from 'react';
import { useTheme } from './ThemeContext';

    const colorMap = {
        "C": {
            borderGradient: "linear-gradient(to right, #FFD700, #DAA520)",
            badgeGradient: "linear-gradient(to right, #FFD700, #DAA520)",
            textClass: "text-yellow-500",
        },
        "C++": {
            borderGradient: "linear-gradient(to right, #FFD700, #DAA520)",
            badgeGradient: "linear-gradient(to right, #FFD700, #DAA520)",
            textClass: "text-yellow-500",
        },
        "Java": {
            borderGradient: "linear-gradient(to right, #F43F5E, #E11D48)",
            badgeGradient: "linear-gradient(to right, #F43F5E, #E11D48)",
            textClass: "text-rose-500",
        },
        "Python": {
            borderGradient: "linear-gradient(to right, #0EA5E9, #0284C7)",
            badgeGradient: "linear-gradient(to right, #0EA5E9, #0284C7)",
            textClass: "text-sky-500",
        },
        "TCS NQT": {
            borderGradient: "linear-gradient(to right, #10B981, #059669)",
            badgeGradient: "linear-gradient(to right, #10B981, #059669)",
            textClass: "text-emerald-500",
        },
    };

    const programmingRoadmapData = {
      C: [
        {
          milestone: "Milestone 1: Basics and Syntax",
          topics: [
            "Introduction to C: History, setup (GCC), basic program structure",
            "Data Types: int, float, char, double, ranges",
            "Variables and Constants: Declaration, initialization, scope",
            "Operators: Arithmetic, relational, logical, bitwise",
            "Input/Output: printf, scanf, getchar, putchar",
            "Control Structures: if, if-else, switch-case",
          ],
        },
        {
          milestone: "Milestone 2: Loops and Arrays",
          topics: [
            "Loops: for, while, do-while, nested loops",
            "Arrays: 1D arrays, declaration, initialization",
            "Multi-dimensional Arrays: 2D arrays for matrices",
            "String Handling: Character arrays, strlen, strcpy, strcmp",
          ],
        },
        {
          milestone: "Milestone 3: Functions and Pointers",
          topics: [
            "Functions: Declaration, definition, calling",
            "Parameter Passing: Call by value, recursion basics",
            "Pointers: Concept, declaration, pointer arithmetic",
            "Pointers with Arrays: Accessing elements via pointers",
          ],
        },
        {
          milestone: "Milestone 4: Advanced Concepts",
          topics: [
            "Structures and Unions: Definition, accessing members",
            "Dynamic Memory: malloc, calloc, free",
            "File Handling: Reading and writing files",
            "Data Structures: Linked lists, stacks, queues",
          ],
        },
        {
          milestone: "Milestone 5: Real-world Applications",
          topics: [
            "Building small projects: Contact management system",
            "Algorithm implementation: Sorting, searching",
            "Memory management techniques",
            "Performance optimization basics",
          ],
        },
      ],
      "C++": [
        {
          milestone: "Milestone 1: C++ Fundamentals",
          topics: [
            "Introduction: Setup (g++), differences from C",
            "Data Types: int, float, char, string class",
            "Operators: Arithmetic, logical, relational, bitwise",
            "Input/Output: cin, cout, string streams",
          ],
        },
        {
          milestone: "Milestone 2: STL and Modern C++",
          topics: [
            "Standard Template Library: Containers, algorithms",
            "Vectors, lists, maps: Declaration and usage",
            "Range-based loops, auto keyword",
            "Smart pointers: unique_ptr, shared_ptr",
          ],
        },
        {
          milestone: "Milestone 3: OOP Concepts",
          topics: [
            "Classes and Objects: Constructors, destructors",
            "Inheritance: Single, multiple, hierarchical",
            "Polymorphism: Virtual functions, abstract classes",
            "Operator overloading",
          ],
        },
        {
          milestone: "Milestone 4: Advanced Features",
          topics: [
            "Templates: Function and class templates",
            "Exception handling: try, catch, throw",
            "Multithreading basics",
            "File I/O operations",
          ],
        },
        {
          milestone: "Milestone 5: Project Development",
          topics: [
            "Design patterns in C++",
            "Building small games or utilities",
            "Performance measurement and optimization",
            "Cross-platform development basics",
          ],
        },
      ],
      Java: [
        {
          milestone: "Milestone 1: Core Java",
          topics: [
            "Introduction: JVM, JRE, JDK setup",
            "Data Types: Primitive and object types",
            "Control Statements: if-else, switch, loops",
            "Arrays and Strings: Manipulation techniques",
          ],
        },
        {
          milestone: "Milestone 2: OOP Principles",
          topics: [
            "Classes and Objects: Constructors, methods",
            "Inheritance and Polymorphism",
            "Encapsulation and Abstraction",
            "Interfaces and Abstract classes",
          ],
        },
        {
          milestone: "Milestone 3: Java Collections",
          topics: [
            "List implementations: ArrayList, LinkedList",
            "Set and Map interfaces",
            "Iterators and Comparators",
            "Stream API and Lambda expressions",
          ],
        },
        {
          milestone: "Milestone 4: Advanced Java",
          topics: [
            "Exception Handling: Checked and unchecked",
            "Multithreading: Thread class, Runnable",
            "File Handling: Readers, Writers",
            "Networking basics",
          ],
        },
        {
          milestone: "Milestone 5: Application Development",
          topics: [
            "Building console applications",
            "JDBC and database connectivity",
            "Unit testing with JUnit",
            "Introduction to Spring Framework",
          ],
        },
      ],
      Python: [
        {
          milestone: "Milestone 1: Python Basics",
          topics: [
            "Introduction: Setup, interpreters, IDEs",
            "Data Types: int, float, str, list, tuple, dict",
            "Control Structures: if-elif-else, loops",
            "Functions: Defining, lambda, recursion",
          ],
        },
        {
          milestone: "Milestone 2: Data Structures",
          topics: [
            "Lists: Slicing, list comprehension",
            "Tuples, Sets, Dictionaries: Operations",
            "String manipulation techniques",
            "Generators and Iterators",
          ],
        },
        {
          milestone: "Milestone 3: OOP in Python",
          topics: [
            "Classes and Objects: init, self",
            "Inheritance and Polymorphism",
            "Magic methods",
            "Decorators and Properties",
          ],
        },
        {
          milestone: "Milestone 4: Advanced Concepts",
          topics: [
            "File Handling: Reading/writing files",
            "Exception Handling: try-except-else-finally",
            "Modules and Packages",
            "Working with APIs (requests library)",
          ],
        },
        {
          milestone: "Milestone 5: Real-world Projects",
          topics: [
            "Web scraping with BeautifulSoup",
            "Data analysis with Pandas",
            "Building small web applications",
            "Automation scripts",
          ],
        },
      ],
    };

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

const RoadmapComponent = () => {
  const [selectedTab, setSelectedTab] = useState('programming');
  const [selectedLanguage, setSelectedLanguage] = useState('C');
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
          Personalized Roadmaps
        </h2>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setSelectedTab('tcs')}
            className={`px-6 py-2 rounded-l-lg text-sm font-semibold transition-colors ${
              selectedTab === 'tcs'
                ? theme === 'light'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-500 text-white'
                : theme === 'light'
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            TCS NQT Preparation
          </button>
          <button
            onClick={() => setSelectedTab('programming')}
            className={`px-6 py-2 rounded-r-lg text-sm font-semibold transition-colors ${
              selectedTab === 'programming'
                ? theme === 'light'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-500 text-white'
                : theme === 'light'
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            Programming Languages
          </button>
          
        </div>

        {selectedTab === 'programming' ? (
          <>
            <div className="flex justify-center mb-8">
              {Object.keys(programmingRoadmapData).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`mx-2 px-4 py-2 rounded-lg font-semibold transition-colors `}
                  style={{
                    background:
                      selectedLanguage === lang
                        ? colorMap[lang].badgeGradient
                        : theme === 'light'
                        ? '#e5e7eb'
                        : '#374151',
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="relative">
              {programmingRoadmapData[selectedLanguage].map((milestone, index) => (
                <div
                  key={index}
                  className={`relative mb-5 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute top-0 w-6 h-6 rounded-full ${colorMap[selectedLanguage].textClass} border-4`}
                    style={{
                      borderImage: colorMap[selectedLanguage].borderGradient,
                      borderImageSlice: 1,
                      left: index % 2 === 0 ? '0' : 'auto',
                      right: index % 2 === 0 ? 'auto' : '0',
                    }}
                  ></div>

                  {/* Milestone Content */}
                  <div
                    className={`p-6 rounded-lg shadow-md mb-4 ${
                      index % 2 === 0 ? 'ml-6' : 'mr-6'
                    } ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
                    style={{
                      borderLeft:
                        index % 2 === 0
                          ? `4px solid ${colorMap[selectedLanguage].borderGradient}`
                          : 'none',
                      borderRight:
                        index % 2 === 0
                          ? 'none'
                          : `4px solid ${colorMap[selectedLanguage].borderGradient}`,
                    }}
                  >
                    <h3
                      className={`text-xl font-semibold mb-4 ${colorMap[selectedLanguage].textClass}`}
                    >
                      {milestone.milestone}
                    </h3>
                    <ul
                      className={`list-disc pl-5 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}
                    >
                      {milestone.topics.map((topic, idx) => (
                        <li key={idx} className="mb-2">{topic}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Timeline connector */}
{/* Timeline connector */}
{/* Timeline connector */}
{/* Timeline connector */}
{/* Timeline connector */}
{/* Timeline connector */}
{index < programmingRoadmapData[selectedLanguage].length - 1 && (
  <div
    className={`absolute top-6 h-[calc(100%+48px)] w-1 ${
      index % 2 === 0 ? 'left-3' : 'right-3'
    }`}
    style={{
      background: colorMap[selectedLanguage].borderGradient,
    }}
  ></div>
)}
                </div>
              ))}
            </div>
          </>
        ) : (
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
                      ? 'bg-indigo-50 border-indigo-100'
                      : 'bg-indigo-900 border-indigo-800'
                  }`}
                >
                  <h5
                    className={`font-bold ${
                      theme === 'light' ? 'text-indigo-700' : 'text-indigo-400'
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
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'bg-indigo-900 border-indigo-800'
              }`}
            >
              <h4
                className={`text-xl font-semibold mb-4 ${
                  theme === 'light' ? 'text-indigo-800' : 'text-indigo-400'
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
        )}
      </div>
    </section>
  );
};

export default RoadmapComponent;