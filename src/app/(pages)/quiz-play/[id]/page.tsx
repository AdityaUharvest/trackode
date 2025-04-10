"use client";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/ThemeContext";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';




const requestFullscreen = (elem: any) => {
  if (elem.requestFullscreen) {
    return elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    return elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    return elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    return elem.msRequestFullscreen();
  }
  return Promise.reject(new Error('Fullscreen API not supported'));
};

export default function QuizPage({ params }: any) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizData, setQuizData] = useState<any>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionStatus, setQuestionStatus] = useState<
    Array<{ answered: boolean; marked: boolean }>
  >([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [declarationsAgreed, setDeclarationsAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [fullScreenViolations, setFullScreenViolations] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visibilityChanged, setVisibilityChanged] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = params.id;

  const fullscreenContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobile(isMobileDevice);

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (isMobileDevice && viewportMeta) {
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }

    return () => {
      if (isMobileDevice && viewportMeta) {
        viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0");
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && hasStarted && !submitted) {
        setVisibilityChanged((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleSubmitQuiz();
            toast.error("Quiz submitted due to leaving app 3 times");
            return 3;
          }
          toast.warn(`Warning ${newCount}/3: Return to quiz immediately`);
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasStarted, submitted]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && hasStarted && !submitted) {
        setFullScreenViolations(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleSubmitQuiz();
            toast.error("Quiz submitted due to exiting fullscreen");
            return 3;
          }
          toast.error(`Please return to fullscreen (${newCount}/3 violations)`);
          return newCount;
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasStarted && !submitted) {
        const blockedKeys = [
          'Escape', 'F11', 'F4', 
          'Alt', 'Meta', 'Control',
          'Tab', 'PrintScreen'
        ];
        
        if (blockedKeys.includes(e.key) || 
            e.ctrlKey && ['w', 'q', 'tab'].includes(e.key.toLowerCase()) ||
            e.altKey && e.key !== 'Alt') {
          e.preventDefault();
          e.stopPropagation();
          toast.error("Function disabled during quiz");
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [hasStarted, submitted]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
   
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }, []);

  const handleStartQuiz = async () => {
    try {
      if (fullscreenContentRef.current) {
        await requestFullscreen(fullscreenContentRef.current);
        setHasStarted(true);
      }
    } catch (error) {
      toast.error("Failed to enter fullscreen mode. Please allow fullscreen and try again.");
    }
  };

  useEffect(() => {
    if (!id || !session?.user?.id) return;

    const checkAttempt = async () => {
      try {
        const response = await axios.get("/api/attempted-quiz", {
          params: { id, userId: session?.user?.id },
        });

        if (response.data.success) {
          setHasAttempted(true);
          toast.error("You have already attempted this quiz.");
        }
      } catch (error) {
        console.error("Error checking quiz attempt:", error);
        toast.error("Failed to check quiz attempt.");
      }
    };

    checkAttempt();
  }, [id,session?.user?.id]);

  useEffect(() => {
    if (!id || hasAttempted) return;

    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quiz-get/${id}`);
        
        if(response.data.active === false){
          console.log(response.data.active);
          toast.error("Quiz is not active");
          router.push("/dashboard");
        }
        setQuizData(response.data.quiz);
        setQuestionStatus(
          Array(response.data.quiz.questions.length).fill({
            answered: false,
            marked: false,
          })
        );
        setTimeLeft(response.data.quiz.duration * 60 * 60);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        toast.error("Failed to load quiz.");
      }
    };

    fetchQuiz();
  }, [id, hasAttempted]);

  useEffect(() => {
    if (!hasStarted || !quizData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, quizData]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestion] = {
      ...updatedStatus[currentQuestion],
      answered: true,
    };
    setQuestionStatus(updatedStatus);
  };

  const handleMarkReview = () => {
    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestion] = {
      ...updatedStatus[currentQuestion],
      marked: true,
    };
    setQuestionStatus(updatedStatus);
  };

  const handleQuestionChange = (index: number) => {
    setCurrentQuestion(index);
  };

  const handleSubmitQuiz = async () => {
    if (submitted || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/quiz-submit/${id}`, {
        answers,
        session,
      });

      if (response.data.success) {
        setSubmitted(true);
        toast.success(response.data.message);
        setTimeout(() => {
          document.exitFullscreen();
          router.push(`/quiz-list`);
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasAttempted) {
    return (
      <div className={`flex flex-col justify-center items-center gap-2 h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <p className="text-xl text-white-600">You have already attempted this quiz.</p>
        <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
          Dashboard 
        </Link>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <Loader2 className="animate-spin"/>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Fullscreen quiz content */}
      <div
        ref={fullscreenContentRef}
        className={`${hasStarted ? 'fixed inset-0 z-50 overflow-auto' : 'hidden'} ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
      >
        {hasStarted && (
          <div className={`p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-semibold">
                Time Remaining: {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
                {Math.round((timeLeft % 60)).toString().padStart(2, "0")}
              </div>
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark" ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-700 hover:bg-gray-800"
                } text-white`}
              >
                {showCalculator ? "Close" : "Calculator"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className={`lg:col-span-3 rounded-lg shadow-lg p-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <h3 className="text-xl font-semibold mb-6">Question {currentQuestion + 1}</h3>
                    <p className="mb-8">
                      <ReactMarkdown>
                        {quizData.questions[currentQuestion].question}
                      </ReactMarkdown>
                    </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizData.questions[currentQuestion].options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(quizData.questions[currentQuestion]._id, option)}
                      className={`p-4 rounded-lg border-2 transition-all select-none ${
                        answers[quizData.questions[currentQuestion]._id] === option
                          ? theme === "dark"
                            ? "border-blue-600 bg-blue-900"
                            : "border-blue-600 bg-blue-50"
                          : theme === "dark"
                          ? "border-gray-700 hover:border-blue-400"
                          : "border-gray-200 hover:border-blue-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="lg:flex lg:justify-between gap-2 p-2 mt-8">
                  <button
                    onClick={() => handleQuestionChange(currentQuestion - 1)}
                    disabled={currentQuestion === 0}
                    className={`px-6 py-2 mb-2 rounded-lg transition-colors ${
                      theme === "dark" ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-200 hover:bg-gray-300"
                    } disabled:opacity-50`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleMarkReview}
                    className={`p-2 mb-2 ml-2 rounded-lg transition-colors ${
                      theme === "dark" ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"
                    } text-white`}
                  >
                    Mark for Review
                  </button>
                  {currentQuestion === quizData.questions.length - 1 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitted || isSubmitting}
                      className={`p-2 mb-2 ml-2 rounded-lg transition-colors ${
                        theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      {submitted ? "Quiz Submitted" : isSubmitting ? "Submitting..." : "Submit Quiz"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuestionChange(currentQuestion + 1)}
                      disabled={currentQuestion === quizData.questions.length - 1}
                      className={`px-6 bg-green-700 text-white py-2 rounded-lg transition-colors ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-200 hover:bg-gray-300"
                      } disabled:opacity-50`}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>

              <div className={`rounded-lg shadow-lg p-2 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <h4 className="text-lg font-semibold mb-4">Questions</h4>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {quizData.questions.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionChange(index)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                        currentQuestion === index
                          ? theme === "dark"
                            ? "border-blue-600 bg-blue-900"
                            : "border-blue-600 bg-blue-50"
                          : questionStatus[index].answered
                          ? theme === "dark"
                            ? "border-green-600 bg-green-900"
                            : "border-green-500 bg-green-50"
                          : questionStatus[index].marked
                          ? theme === "dark"
                            ? "border-orange-600 bg-orange-900"
                            : "border-orange-400 bg-orange-50"
                          : theme === "dark"
                          ? "border-gray-700 bg-gray-700"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {showCalculator && (
                  <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <ScientificCalculator theme={theme} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!hasStarted && (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
          <div className={`rounded-xl shadow-2xl p-8 max-w-4xl w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-xl font-semibold">{quizData.name}</h1>
                <p className="text-sm opacity-80">Please read the instructions carefully before starting</p>
              </div>
              <button
                onClick={handleStartQuiz}
                disabled={!declarationsAgreed || !termsAgreed}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white ${(!declarationsAgreed || !termsAgreed) ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
              >
                Start Quiz 
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {isMobile && (
                  <div className={`p-4 rounded-lg border-l-4 ${theme === "dark" ? "border-red-500 bg-gray-700" : "border-red-500 bg-red-50"}`}>
                    <div className="font-semibold flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Mobile Restrictions
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Screen recording/printscreen disabled</li>
                      <li>Landscape mode locked</li>
                      <li>App switching limited to 3 times</li>
                    </ul>
                  </div>
                )}

                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    Quiz Instructions
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Navigate between questions using the question panel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Mark questions for review to come back later</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Calculator available in the tools menu</span>
                    </li>
                  </ul>
                </div>

                {quizData.instructions && (
                  <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <h2 className="text-lg font-semibold mb-3">Additional Instructions</h2>
                    <div className="prose prose-sm max-w-none" style={{ whiteSpace: "pre-line" }}>
                      {quizData.instructions}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Declaration & Terms
                  </h2>
                  
                  <div className="space-y-4">
                    <label className="block">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={declarationsAgreed}
                          onChange={(e) => setDeclarationsAgreed(e.target.checked)}
                          className={`mt-1 form-checkbox h-5 w-5 rounded ${theme === "dark" ? "text-blue-500 bg-gray-600 border-gray-500" : "text-blue-600 border-gray-300"}`}
                        />
                        <div>
                          <span className="font-medium">Anti-Cheating Declaration</span>
                          <p className="text-sm opacity-80 mt-1">I hereby declare that I am not cheating. If found cheating, I understand I will be debarred.</p>
                        </div>
                      </div>
                    </label>

                    <label className="block">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={termsAgreed}
                          onChange={(e) => setTermsAgreed(e.target.checked)}
                          className={`mt-1 form-checkbox h-5 w-5 rounded ${theme === "dark" ? "text-blue-500 bg-gray-600 border-gray-500" : "text-blue-600 border-gray-300"}`}
                        />
                        <div>
                          <span className="font-medium">Terms Acceptance</span>
                          <p className="text-sm opacity-80 mt-1">I agree to the terms and conditions of the quiz.</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                    </svg>
                    Quiz Summary
                  </h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Total Questions:</div>
                    <div className="font-medium">{quizData.totalQuestions}</div>
                    <div>Duration:</div>
                    <div className="font-medium">{quizData.duration * 60 } mins </div>
                    <div>Max Attempts:</div>
                    <div className="font-medium">{quizData.totalQuestions}</div>
                    <div>Passing Score:</div>
                    <div className="font-medium">75%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Keep your ScientificCalculator component the same
const ScientificCalculator = ({ theme }: any) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleMathFunctions = (expression: string) => {
    // Replace mathematical functions with Math object equivalents
    return expression
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/pow\(/g, 'Math.pow(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(') // Use log10 for base 10 logarithm
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E');
  };

  const calculateResult = (expr: string) => {
    try {
      // Convert degrees to radians for trigonometric functions
      const processedExpr = expr.replace(/(sin|cos|tan)\(([^)]+)\)/g, (_, func, angle) => {
        const radians = (parseFloat(angle) * Math.PI) / 180;
        return `Math.${func}(${radians})`;
      });
      
      const finalExpression = handleMathFunctions(processedExpr);
      return eval(finalExpression).toFixed(4);
    } catch (error) {
      return "Error";
    }
  };

  const handleInput = (value: string) => {
    if (value === "=") {
      try {
        const calculation = calculateResult(input);
        setResult(calculation.toString());
      } catch {
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "pow") {
      setInput(prev => prev + "pow(");
    } else if (value === "sqrt") {
      setInput(prev => prev + "sqrt(");
    } else if (["sin", "cos", "tan", "log"].includes(value)) {
      setInput(prev => prev + `${value}(`);
    } else {
      setInput(prev => prev + value);
    }
  };

  const scientificButtons = [
    "7", "8", "9", "/", "sqrt",
    "4", "5", "6", "*", "pow",
    "1", "2", "3", "-", "log",
    "0", ".", "=", "+", "sin",
    "C", "cos", "tan", "(", ")"
  ];

  return (
    <div className="select-none" onContextMenu={(e) => e.preventDefault()}>
      <div className={`p-3 rounded-lg mb-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className={`text-right ${theme === "dark" ? "text-gray-300" : "text-gray-700"} min-h-[20px]`}>
          {input || "0"}
        </div>
        <div className={`text-right font-semibold text-xl ${theme === "dark" ? "text-white" : "text-black"} min-h-[28px]`}>
          {result || "0"}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {scientificButtons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleInput(btn)}
            className={`p-3 rounded-lg transition-colors ${
              btn === "="
                ? "col-span-2 bg-blue-600 hover:bg-blue-700 text-white"
                : theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}; 