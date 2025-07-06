"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';;
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/ThemeContext";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
  return Promise.reject(new Error("Fullscreen API not supported"));
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
  const { theme } = useTheme();
  const [declarationsAgreed, setDeclarationsAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [fullScreenViolations, setFullScreenViolations] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visibilityChanged, setVisibilityChanged] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = params.id;

  const fullscreenContentRef = useRef<HTMLDivElement>(null);

  // Detect mobile device and set viewport meta
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

  // Handle visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && hasStarted && !submitted) {
        setVisibilityChanged((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleSubmitQuiz(answers); // Pass current answers explicitly
            toast.error("Quiz submitted due to leaving app 3 times");
            return 3;
          }
          toast.dismiss(`Warning ${newCount}/3: Return to quiz immediately`);
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasStarted, submitted, answers]);

  // Handle fullscreen changes and key restrictions
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && hasStarted && !submitted) {
        setFullScreenViolations((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleSubmitQuiz(answers); // Pass current answers explicitly
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
          "Escape",
          "F11",
          "F4",
          "Alt",
          "Meta",
          "Control",
          "Tab",
          "PrintScreen",
        ];

        if (
          blockedKeys.includes(e.key) ||
          (e.ctrlKey && ["w", "q", "tab"].includes(e.key.toLowerCase())) ||
          (e.altKey && e.key !== "Alt")
        ) {
          e.preventDefault();
          e.stopPropagation();
          toast.error("Function disabled during quiz");
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [hasStarted, submitted, answers]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Disable context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Disable console logs
  useEffect(() => {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }, []);

  // Start quiz in fullscreen
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

  // Check if quiz has been attempted
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
        toast.error("Failed to check quiz attempt.");
      }
    };

    checkAttempt();
  }, [id, session?.user?.id]);

  // Fetch quiz data
  useEffect(() => {
    if (!id || hasAttempted) return;

    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quiz-get/${id}`);

        if (response.data.active === false) {
          toast.error("Quiz is not active");
          router.push("/dashboard");
          return;
        }
        setQuizData(response.data.quiz);
        setQuestionStatus(
          Array(response.data.quiz.questions.length).fill({
            answered: false,
            marked: false,
          })
        );
        setTimeLeft(response.data.quiz.duration * 60 * 60); // Convert hours to seconds
      } catch (error) {
        toast.error("Failed to load quiz.");
      }
    };

    fetchQuiz();
  }, [id, hasAttempted, router]);

  // Timer logic
  useEffect(() => {
    if (!hasStarted || !quizData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz(answers); // Pass current answers
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, quizData, answers]);

  // Handle answer selection
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestion] = {
      ...updatedStatus[currentQuestion],
      answered: true,
    };
    setQuestionStatus(updatedStatus);
  };

  // Mark question for review
  const handleMarkReview = () => {
    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestion] = {
      ...updatedStatus[currentQuestion],
      marked: true,
    };
    setQuestionStatus(updatedStatus);
  };

  // Change question
  const handleQuestionChange = (index: number) => {
    setCurrentQuestion(index);
  };

  // Submit quiz
  const handleSubmitQuiz = async (currentAnswers: Record<string, string> = answers) => {
    if (submitted || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/quiz-submit/${id}`, {
        answers: currentAnswers,
        session,
        userId: session?.user?.id,
        fullScreenViolations,
        visibilityChanged,
        submittedAutomatically:timeLeft <= 0? true : false,
        timeLeft,

      });

      if (response.data.success) {
        setSubmitted(true);
        toast.success(response.data.message || "Quiz submitted successfully");
        setTimeout(() => {
          document.exitFullscreen().catch(() => {});
          router.push(`/programming-quizzes`);
        }, 1500);
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress for timer ring
  const totalTime = quizData ? quizData.duration * 60 * 60 : 0;
  const progress = timeLeft / totalTime || 0;

  if (hasAttempted) {
    return (
      <div
        className={`flex flex-col justify-center items-center gap-2 h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <p className="text-xl">You have already attempted this quiz.</p>
        <Link
          href="/dashboard"
          className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg"
        >
          Dashboard
        </Link>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Fullscreen quiz content */}
      <div
        ref={fullscreenContentRef}
        className={`${
          hasStarted ? "fixed inset-0 z-50 overflow-auto" : "hidden"
        } ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
      >
        {hasStarted && (
          <div className={`lg:p-6 p-2 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <div className="flex justify-between items-center mb-8">
              {/* Enhanced Timer Display */}
              <div className="flex items-center gap-4">
                
                <div>
                  <div className="text-sm opacity-70">⏰Time Remaining</div>
                  <div className={`text-xl font-semibold ${parseInt(formatTime(timeLeft))<=60?'animate-pulse text-red-700':''}`}>{formatTime(timeLeft)}</div>
                </div>
              </div>
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-800"
                    : "bg-gray-700 hover:bg-gray-800"
                } text-white`}
              >
                {showCalculator ? "Close" : "Calculator"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div
                className={`lg:col-span-3 rounded-lg shadow-lg p-4 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-xl font-semibold mb-6">Question {currentQuestion + 1}</h3>
                <p className="mb-8">
                  <ReactMarkdown>{quizData.questions[currentQuestion].question}</ReactMarkdown>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizData.questions[currentQuestion].options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(quizData.questions[currentQuestion]._id, option)}
                      className={`p-4 rounded-lg border-2 transition-all select-none ${
                        answers[quizData.questions[currentQuestion]._id] === option
                          ? theme === "dark"
                            ? "border-indigo-600 bg-indigo-900"
                            : "border-indigo-600 bg-indigo-50"
                          : theme === "dark"
                          ? "border-gray-700 hover:border-indigo-400"
                          : "border-gray-200 hover:border-indigo-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between gap-1  mt-8">
                  <button
                    onClick={() => handleQuestionChange(currentQuestion - 1)}
                    disabled={currentQuestion === 0}
                    className={`p-2 mb-2 rounded-lg transition-colors ${
                      theme === "dark" ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-200 hover:bg-gray-300"
                    } disabled:opacity-50`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleMarkReview}
                    className={`p-2 mb-2 ml-1 rounded-lg transition-colors ${
                      theme === "dark" ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"
                    } text-white`}
                  >
                    Mark for Review
                  </button>
                  {currentQuestion === quizData.questions.length - 1 ? (
                    <button
                      onClick={() => handleSubmitQuiz()}
                      disabled={submitted || isSubmitting}
                      className={`p-3 mb-2 ml-2 rounded-lg transition-colors ${
                        theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
                      } text-white disabled:opacity-50`}
                    >
                      {submitted ? "Quiz Submitted" : isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuestionChange(currentQuestion + 1)}
                      disabled={currentQuestion === quizData.questions.length - 1}
                      className={`p-3 mb-2 rounded-lg transition-colors ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-200 hover:bg-gray-300"
                      } disabled:opacity-50`}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>

              <div
                className={`rounded-lg shadow-lg p-2 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h4 className="text-lg font-semibold mb-4">Questions</h4>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {quizData.questions.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionChange(index)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                        currentQuestion === index
                          ? theme === "dark"
                            ? "border-indigo-600 bg-indigo-900"
                            : "border-indigo-600 bg-indigo-50"
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
                  <div
                    className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <ScientificCalculator theme={theme} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz start screen */}
      {!hasStarted && (
        <div
          className={`min-h-screen flex items-center justify-center p-2 ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <div
            className={`rounded-xl shadow-2xl p-3 max-w-5xl w-full ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-lg font-semibold">{quizData.name.replace("(","").replace(")", "")}</h1>
                {/* <p className="text-sm opacity-80">Please read the instructions carefully before starting</p> */}
              </div>
              <button
                onClick={handleStartQuiz}
                disabled={!declarationsAgreed || !termsAgreed}
                className={`p-3 rounded-lg font-medium transition-all ${
                  theme === "dark" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
                } text-white ${
                  !declarationsAgreed || !termsAgreed ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                Start Quiz
              </button>
            </div>
{/* quiz instructions  */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
              <div className="lg:col-span-2 space-y-6">
                

                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Quiz Instructions
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Navigate between questions using the question panel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Mark questions for review to come back later</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Quiz will be submitted automatically in case of timeout</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Calculator available in the tools menu</span>
                    </li>
                  </ul>
                </div>

                
              </div>
 <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Quiz Summary
                  </h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Total Questions:</div>
                    <div className="font-medium">{quizData.totalQuestions}</div>
                    <div>Duration:</div>
                    <div className="font-medium">{quizData.duration * 60} mins</div>
                    <div>Max Attempts:</div>
                    <div className="font-medium">{quizData.totalQuestions}</div>
                    <div>Passing Score:</div>
                    <div className="font-medium">75%</div>
                  </div>
                  
                </div>
              
              
            </div>
            {/* Declarations and Terms */}
            <div className="space-y-6 mt-2">
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
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
                          className={`mt-1 form-checkbox h-5 w-5 rounded ${
                            theme === "dark"
                              ? "text-indigo-500 bg-gray-600 border-gray-500"
                              : "text-indigo-600 border-gray-300"
                          }`}
                        />
                        <div>
                          <span className="font-medium">Anti-Cheating Declaration</span>
                          <p className="text-sm opacity-80 mt-1">
                            I hereby declare that I am not cheating. If found cheating, I understand I
                            will be debarred.
                          </p>
                        </div>
                      </div>
                    </label>

                    <label className="block">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={termsAgreed}
                          onChange={(e) => setTermsAgreed(e.target.checked)}
                          className={`mt-1 form-checkbox h-5 w-5 rounded ${
                            theme === "dark"
                              ? "text-indigo-500 bg-gray-600 border-gray-500"
                              : "text-indigo-600 border-gray-300"
                          }`}
                        />
                        <div>
                          <span className="font-medium">Terms Acceptance</span>
                          <p className="text-sm opacity-80 mt-1">
                            I agree to the terms and conditions of the quiz.
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <button
                onClick={handleStartQuiz}
                disabled={!declarationsAgreed || !termsAgreed}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  theme === "dark" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
                } text-white ${
                  !declarationsAgreed || !termsAgreed ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                Start Quiz
              </button>

               
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ScientificCalculator component (unchanged as per your request)
const ScientificCalculator = ({ theme }: any) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleMathFunctions = (expression: string) => {
    return expression
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/pow\(/g, "Math.pow(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/π/g, "Math.PI")
      .replace(/e/g, "Math.E");
  };

  const calculateResult = (expr: string) => {
    try {
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
      setInput((prev) => prev + "pow(");
    } else if (value === "sqrt") {
      setInput((prev) => prev + "sqrt(");
    } else if (["sin", "cos", "tan", "log"].includes(value)) {
      setInput((prev) => prev + `${value}(`);
    } else {
      setInput((prev) => prev + value);
    }
  };

  const scientificButtons = [
    "7",
    "8",
    "9",
    "/",
    "sqrt",
    "4",
    "5",
    "6",
    "*",
    "pow",
    "1",
    "2",
    "3",
    "-",
    "log",
    "0",
    ".",
    "=",
    "+",
    "sin",
    "C",
    "cos",
    "tan",
    "(",
    ")",
  ];

  return (
    <div className="select-none" onContextMenu={(e) => e.preventDefault()}>
      <div
        className={`p-3 rounded-lg mb-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div
          className={`text-right ${theme === "dark" ? "text-gray-300" : "text-gray-700"} min-h-[20px]`}
        >
          {input || "0"}
        </div>
        <div
          className={`text-right font-semibold text-xl ${
            theme === "dark" ? "text-white" : "text-black"
          } min-h-[28px]`}
        >
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
                ? "col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white"
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