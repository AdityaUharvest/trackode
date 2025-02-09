"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeContext";
import { Check, X, Clock, AlertCircle } from "lucide-react";

interface Quiz {
  _id: string;
  name: string;
  instructions: string;
  questions: Question[];
  duration: number; // Duration in minutes
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

const QuizPlayer: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<"instructions" | "terms" | "quiz" | "summary">("instructions");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: string]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60); // Convert minutes to seconds
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Timer
  useEffect(() => {
    if (currentStep === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setQuizCompleted(true);
      setCurrentStep("summary");
    }
  }, [currentStep, timeLeft]);

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // Handle mark for review
  const handleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Handle navigation to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Handle navigation to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    setCurrentStep("summary");
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case "instructions":
        return (
          <Card className={`w-full max-w-2xl mx-auto ${theme === "dark" ? "bg-neutral-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="text-2xl">Quiz Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>{quiz.instructions}</p>
                <Button onClick={() => setCurrentStep("terms")} className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "terms":
        return (
          <Card className={`w-full max-w-2xl mx-auto ${theme === "dark" ? "bg-neutral-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>By continuing, you agree to the terms and conditions of this quiz.</p>
                <div className="flex gap-4">
                  <Button onClick={() => setAcceptedTerms(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Check size={16} className="mr-2" />
                    Agree
                  </Button>
                  <Button onClick={() => setAcceptedTerms(false)} className="flex-1 bg-red-600 hover:bg-red-700">
                    <X size={16} className="mr-2" />
                    Disagree
                  </Button>
                </div>
                {acceptedTerms && (
                  <Button onClick={() => setCurrentStep("quiz")} className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "quiz":
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const isAnswered = answers[currentQuestion._id] !== undefined;
        const isMarkedForReview = markedForReview[currentQuestion._id];

        return (
          <Card className={`w-full max-w-2xl mx-auto ${theme === "dark" ? "bg-neutral-800" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="text-2xl flex justify-between items-center">
                <span>Question {currentQuestionIndex + 1}</span>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg">{currentQuestion.question}</p>
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                      className={`w-full text-left justify-start ${answers[currentQuestion._id] === option ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-600"}`}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                    Previous
                  </Button>
                  <Button
                    onClick={handleMarkForReview.bind(null, currentQuestion._id)}
                    className={isMarkedForReview ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-500 hover:bg-gray-600"}
                  >
                    <AlertCircle size={16} className="mr-2" />
                    {isMarkedForReview ? "Unmark Review" : "Mark for Review"}
                  </Button>
                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <Button onClick={handleNextQuestion}>Next</Button>
                  ) : (
                    <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                      Submit Quiz
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "summary":
        const attemptedQuestions = Object.keys(answers).length;
        const unattemptedQuestions = quiz.questions.length - attemptedQuestions;

        return (
          <div className="flex justify-center items-center h-screen">
            <Card className={`w-full max-w-2xl mx-auto ${theme === "dark" ? "bg-neutral-800" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="text-2xl">Quiz Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Thank you for completing the quiz!</p>
                  <p>Attempted Questions: {attemptedQuestions}</p>
                  <p>Unattempted Questions: {unattemptedQuestions}</p>
                  <Button onClick={() => window.close()} className="w-full bg-blue-600 hover:bg-blue-700">
                    Exit Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`p-6 ${theme === "dark" ? "bg-neutral-900 text-white" : "bg-amber-50 text-black"}`}>
      {renderStep()}
    </div>
  );
};

export default QuizPlayer;