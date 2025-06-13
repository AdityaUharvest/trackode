import { useEffect, useState } from 'react'
import Link from 'next/link';
import React from 'react'
import { useTheme } from './ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
interface Question {
  text: string;
  options: {
    text: string;
    correct: boolean;
  }[];
  marks: number;
}

interface Questions {
  JavaScript: Question[];
  Python: Question[];
  C: Question[];
  "C++": Question[];
  React: Question[];
  [key: string]: Question[]; // Add index signature
}

const InteractiveQuiz = () => {

  const [currentTopic, setCurrentTopic] = useState('JavaScript');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { theme } = useTheme();
// Reset quiz state when topic changes
useEffect(() => {
  setCurrentQuestion(0);
  setScore(0);
  setShowScore(false);
}, [currentTopic]);
const questions:Questions = {
    JavaScript: [
      {
        text: "What is the output of console.log(typeof null);?",
        options: [
          { text: "object", correct: true },
          { text: "null", correct: false },
          { text: "undefined", correct: false },
          { text: "string", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which method adds one or more elements to the end of an array?",
        options: [
          { text: "push()", correct: true },
          { text: "pop()", correct: false },
          { text: "shift()", correct: false },
          { text: "unshift()", correct: false }
        ],
        marks: 1
      },
      {
        text: "What does 'this' refer to in a JavaScript object method?",
        options: [
          { text: "The object itself", correct: true },
          { text: "The window object", correct: false },
          { text: "The parent object", correct: false },
          { text: "It's undefined", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which of these is NOT a JavaScript framework?",
        options: [
          { text: "React", correct: false },
          { text: "Angular", correct: false },
          { text: "Laravel", correct: true },
          { text: "Vue", correct: false }
        ],
        marks: 1
      },
      {
        text: "What will Boolean('false') return?",
        options: [
          { text: "true", correct: true },
          { text: "false", correct: false },
          { text: "undefined", correct: false },
          { text: "NaN", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which operator returns true if operands are of the same type and value?",
        options: [
          { text: "==", correct: false },
          { text: "===", correct: true },
          { text: "=", correct: false },
          { text: "!==", correct: false }
        ],
        marks: 1
      },
      {
        text: "What does the 'NaN' value represent?",
        options: [
          { text: "Not a Number", correct: true },
          { text: "Null and None", correct: false },
          { text: "Negative Number", correct: false },
          { text: "No assigned Number", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which method converts a string to lowercase letters?",
        options: [
          { text: "toLowerCase()", correct: true },
          { text: "toLower()", correct: false },
          { text: "changeCase('lower')", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the purpose of the 'use strict' directive?",
        options: [
          { text: "Enforces stricter parsing and error handling", correct: true },
          { text: "Makes the code run faster", correct: false },
          { text: "Enables experimental features", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which of these is a valid way to create an object?",
        options: [
          { text: "let obj = {}", correct: true },
          { text: "let obj = new Object()", correct: true },
          { text: "let obj = Object.create(null)", correct: true },
          { text: "All of these", correct: true }
        ],
        marks: 1
      }
    ],
    Python: [
      {
        text: "How do you create an empty list in Python?",
        options: [
          { text: "list()", correct: true },
          { text: "[]", correct: true },
          { text: "new list()", correct: false },
          { text: "list.new()", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the output of print(3 * 'abc')?",
        options: [
          { text: "abcabcabc", correct: true },
          { text: "3abc", correct: false },
          { text: "abc abc abc", correct: false },
          { text: "Error", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which of these is NOT a Python built-in data type?",
        options: [
          { text: "list", correct: false },
          { text: "tuple", correct: false },
          { text: "array", correct: true },
          { text: "dict", correct: false }
        ],
        marks: 1
      },
      {
        text: "What does the 'pass' statement do?",
        options: [
          { text: "Nothing - it's a placeholder", correct: true },
          { text: "Passes control to the next loop iteration", correct: false },
          { text: "Terminates the program", correct: false },
          { text: "Passes arguments to a function", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which method is used to read user input?",
        options: [
          { text: "input()", correct: true },
          { text: "get_input()", correct: false },
          { text: "read()", correct: false },
          { text: "scan()", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the correct way to create a virtual environment?",
        options: [
          { text: "python -m venv myenv", correct: true },
          { text: "virtualenv myenv", correct: true },
          { text: "python create virtualenv myenv", correct: false },
          { text: "env.create('myenv')", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which of these is used for single-line comments?",
        options: [
          { text: "#", correct: true },
          { text: "//", correct: false },
          { text: "--", correct: false },
          { text: "/*", correct: false }
        ],
        marks: 1
      },
      {
        text: "What does the 'yield' keyword do?",
        options: [
          { text: "Creates a generator function", correct: true },
          { text: "Returns a value from a function", correct: false },
          { text: "Yields CPU time to other threads", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which module is used for regular expressions?",
        options: [
          { text: "re", correct: true },
          { text: "regex", correct: false },
          { text: "pyre", correct: false },
          { text: "pattern", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the output of print(2 ** 3)?",
        options: [
          { text: "8", correct: true },
          { text: "6", correct: false },
          { text: "9", correct: false },
          { text: "23", correct: false }
        ],
        marks: 1
      }
    ],
    C: [
      {
        text: "What is the size of an 'int' in C on a 32-bit system?",
        options: [
          { text: "4 bytes", correct: true },
          { text: "2 bytes", correct: false },
          { text: "8 bytes", correct: false },
          { text: "Depends on compiler", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which is NOT a valid storage class specifier?",
        options: [
          { text: "auto", correct: false },
          { text: "register", correct: false },
          { text: "extern", correct: false },
          { text: "stack", correct: true }
        ],
        marks: 1
      },
      {
        text: "What does the '->' operator do?",
        options: [
          { text: "Accesses a member of a structure through pointer", correct: true },
          { text: "Points to a function", correct: false },
          { text: "Dereferences a pointer", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which header file is needed for dynamic memory allocation?",
        options: [
          { text: "stdlib.h", correct: true },
          { text: "stdio.h", correct: false },
          { text: "memory.h", correct: false },
          { text: "alloc.h", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the correct way to declare a pointer?",
        options: [
          { text: "int *ptr;", correct: true },
          { text: "int ptr*;", correct: false },
          { text: "*int ptr;", correct: false },
          { text: "ptr int*;", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which function is used to read a string from stdin?",
        options: [
          { text: "fgets()", correct: true },
          { text: "scanf()", correct: false },
          { text: "getline()", correct: false },
          { text: "read()", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the default return type of a function if not specified?",
        options: [
          { text: "int", correct: true },
          { text: "void", correct: false },
          { text: "char", correct: false },
          { text: "Compiler error", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which operator has the highest precedence?",
        options: [
          { text: "()", correct: true },
          { text: "++", correct: false },
          { text: "*", correct: false },
          { text: "=", correct: false }
        ],
        marks: 1
      },
      {
        text: "What does the 'volatile' keyword do?",
        options: [
          { text: "Prevents compiler optimization of variable", correct: true },
          { text: "Makes variable thread-safe", correct: false },
          { text: "Speeds up variable access", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which is NOT a valid loop construct?",
        options: [
          { text: "for", correct: false },
          { text: "while", correct: false },
          { text: "do-while", correct: false },
          { text: "repeat-until", correct: true }
        ],
        marks: 1
      }
    ],
    "C++": [
      {
        text: "Which is NOT a C++ access specifier?",
        options: [
          { text: "public", correct: false },
          { text: "private", correct: false },
          { text: "protected", correct: false },
          { text: "internal", correct: true }
        ],
        marks: 1
      },
      {
        text: "What is the correct way to create a class in C++?",
        options: [
          { text: "class MyClass {}", correct: true },
          { text: "class MyClass;", correct: false },
          { text: "new class MyClass {}", correct: false },
          { text: "MyClass class {}", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which operator is used for dynamic memory allocation?",
        options: [
          { text: "new", correct: true },
          { text: "malloc", correct: false },
          { text: "alloc", correct: false },
          { text: "create", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is function overloading?",
        options: [
          { text: "Multiple functions with same name but different parameters", correct: true },
          { text: "Functions that call themselves", correct: false },
          { text: "Functions that can take any number of arguments", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which is used for input in C++?",
        options: [
          { text: "cin", correct: true },
          { text: "scanf", correct: false },
          { text: "input", correct: false },
          { text: "read", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is a constructor?",
        options: [
          { text: "Special member function for object initialization", correct: true },
          { text: "Function that constructs strings", correct: false },
          { text: "Function that returns a constructed object", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which is NOT a type of inheritance in C++?",
        options: [
          { text: "Single", correct: false },
          { text: "Multiple", correct: false },
          { text: "Multilevel", correct: false },
          { text: "Parallel", correct: true }
        ],
        marks: 1
      },
      {
        text: "What is the 'this' pointer?",
        options: [
          { text: "Pointer to current object instance", correct: true },
          { text: "Pointer to current function", correct: false },
          { text: "Pointer to parent class", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which STL container provides fast random access?",
        options: [
          { text: "vector", correct: true },
          { text: "list", correct: false },
          { text: "map", correct: false },
          { text: "set", correct: false }
        ],
        marks: 1
      },
      {
        text: "What does 'cout' stand for?",
        options: [
          { text: "Character output", correct: true },
          { text: "Console output", correct: false },
          { text: "Common output", correct: false },
          { text: "Class output", correct: false }
        ],
        marks: 1
      }
    ],
    React: [
      {
        text: "Which hook is used to perform side effects in function components?",
        options: [
          { text: "useEffect", correct: true },
          { text: "useState", correct: false },
          { text: "useContext", correct: false },
          { text: "useReducer", correct: false }
        ],
        marks: 1
      },
      {
        text: "What does JSX stand for?",
        options: [
          { text: "JavaScript XML", correct: true },
          { text: "JavaScript Extension", correct: false },
          { text: "JavaScript Syntax", correct: false },
          { text: "JavaScript Execute", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which method is called before a component is removed from the DOM?",
        options: [
          { text: "componentWillUnmount", correct: true },
          { text: "componentDidMount", correct: false },
          { text: "componentWillUpdate", correct: false },
          { text: "shouldComponentUpdate", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is used to pass data to a component from outside?",
        options: [
          { text: "props", correct: true },
          { text: "state", correct: false },
          { text: "context", correct: false },
          { text: "variables", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which hook manages local component state?",
        options: [
          { text: "useState", correct: true },
          { text: "useEffect", correct: false },
          { text: "useContext", correct: false },
          { text: "useReducer", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the correct way to render a list in React?",
        options: [
          { text: "Using map() method", correct: true },
          { text: "Using for loop", correct: false },
          { text: "Using forEach() method", correct: false },
          { text: "Using while loop", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which is NOT a React lifecycle method?",
        options: [
          { text: "componentDidMount", correct: false },
          { text: "componentWillUnmount", correct: false },
          { text: "componentWillRender", correct: true },
          { text: "shouldComponentUpdate", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the purpose of keys in React lists?",
        options: [
          { text: "Help React identify which items have changed", correct: true },
          { text: "Make items sortable", correct: false },
          { text: "Provide unique IDs for database operations", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      },
      {
        text: "Which tool can you use to create a new React app?",
        options: [
          { text: "create-react-app", correct: true },
          { text: "react-cli", correct: false },
          { text: "react-starter", correct: false },
          { text: "react-init", correct: false }
        ],
        marks: 1
      },
      {
        text: "What is the virtual DOM?",
        options: [
          { text: "A lightweight copy of the real DOM", correct: true },
          { text: "A shadow version of the DOM", correct: false },
          { text: "A backup of the DOM", correct: false },
          { text: "None of these", correct: false }
        ],
        marks: 1
      }
    ]
  };

 useEffect(() => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
  }, [currentTopic]);

  const handleAnswer = () => {
    if (selectedOption === null) {
      toast.error("Please select an option!");
      return;
    }

    const currentQ = questions[currentTopic][currentQuestion];
    const isCorrect = currentQ.options[selectedOption].correct;
    const marks = currentQ.marks;

    if (isCorrect) {
      setScore(score + marks);
      toast.success(`Correct! +${marks} mark${marks > 1 ? 's' : ''}`);
    } else {
      toast.error("Incorrect!");
    }

    setSelectedOption(null);
    
    if (currentQuestion < questions[currentTopic].length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1000);
    } else {
      setTimeout(() => setShowScore(true), 1000);
    }
  };

  return (
    <div className="px-4 mx-auto  sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          
          <p
            className={`mt-4 max-w-2xl mx-auto lg:text-base text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Experience our interactive quizzes with this quick demo.
          </p>
        </div>

        <div
          className={`lg:p-10 p-5 rounded-xl shadow-lg ${
            theme === "dark" ? "bg-gray-700/50" : "bg-white"
          } max-w-5xl mx-auto`}
        >
          {/* Topic Selection */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {Object.keys(questions).map((topic) => (
              <button
                key={topic}
                onClick={() => setCurrentTopic(topic)}
                className={`px-2 py-1 rounded-md text-sm  transition-colors ${
                  currentTopic === topic
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : theme === "dark"
                    ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          <h3
            className={`lg:text-base text-sm font-semibold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {currentTopic} Quiz
          </h3>

          {showScore ? (
            <div className="text-center">
              <h3 className={`lg:text-base text-sm  font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Quiz Completed!
              </h3>
              <p className={`lg:text-base text-sm mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Your score: {score} out of {questions[currentTopic].reduce((total, q) => total + q.marks, 0)}
              </p>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowScore(false);
                  setSelectedOption(null);
                }}
                className={`px-6 py-2 text-sm rounded-md font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p
                  className={`lg:text-base text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {questions[currentTopic][currentQuestion].text}
                </p>
                <div className="mt-4 space-y-2">
  {questions[currentTopic][currentQuestion].options.map((option, index) => {
    // Determine if this option is selected and whether it's correct
    const isSelected = selectedOption === index;
    const isCorrect = option.correct;
    const showFeedback = selectedOption !== null; // Show feedback when any option is selected

    return (
      <label
        key={index}
        className={`flex items-center text-sm p-3 rounded-lg cursor-pointer transition-all duration-300 ${
          theme === "dark"
            ? isSelected
              ? isCorrect
                ? "bg-green-600" // Correct answer in dark mode
                : "bg-red-600"   // Incorrect answer in dark mode
              : "bg-gray-600 hover:bg-gray-500"
            : isSelected
            ? isCorrect
              ? "bg-green-500 text-white" // Correct answer in light mode
              : "bg-red-500 text-white"  // Incorrect answer in light mode
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <input
          type="radio"
          name={`${currentTopic}-question`}
          className="mr-3 text-sm"
          checked={isSelected}
          onChange={() => setSelectedOption(index)}
          disabled={showFeedback} // Disable further selection after choosing
        />
        <span className={`text-sm lg:text-base ${
          theme === "dark" && !isSelected
            ? "text-gray-300"
            : isSelected
            ? "text-white"
            : "text-gray-600"
        }`}>
          {option.text}
        </span>
        
        {/* Feedback icon */}
        {showFeedback && (
          <span className="ml-auto">
            {isCorrect ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </span>
        )}
      </label>
    );
  })}
</div>
              </div>

              {/* Navigation and Progress */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-1">
                  {currentQuestion > 0 && (
                    <button
                      onClick={() => {
                        setCurrentQuestion(currentQuestion - 1);
                        setSelectedOption(null);
                      }}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                        theme === "dark"
                          ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Previous
                    </button>
                  )}
                </div>
                
                <div className="text-center">
                  <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Question {currentQuestion + 1} of {questions[currentTopic].length}
                  </span>
                </div>
                
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={handleAnswer}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                      theme === "dark"
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {currentQuestion < questions[currentTopic].length - 1 ? "Next" : "Finish"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Explore More Button */}
      
    </div>
  );
};

export default InteractiveQuiz;