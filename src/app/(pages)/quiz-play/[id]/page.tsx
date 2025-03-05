"use client";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/ThemeContext";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const requestFullscreen = (elem: HTMLElement) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as any).mozRequestFullScreen) {
    (elem as any).mozRequestFullScreen();
  } else if ((elem as any).webkitRequestFullscreen) {
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).msRequestFullscreen) {
    (elem as any).msRequestFullscreen();
  }
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
        try {
          requestFullscreen(document.documentElement);
        } catch (error) {
          setFullScreenViolations((prev) => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              handleSubmitQuiz();
              return 3;
            }
            toast.error(`Fullscreen required (${newCount}/3 violations)`);
            return newCount;
          });
        }
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

    const handleMouseLeave = (e: MouseEvent) => {
      if (hasStarted && !submitted && e.clientY < 0) {
        e.preventDefault();
        requestFullscreen(document.documentElement);
      }
    };

    const handleOrientationChange = () => {
      if (hasStarted && !submitted) {
        setFullScreenViolations((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleSubmitQuiz();
            toast.error("Quiz submitted due to orientation changes");
            return 3;
          }
          toast.error(`Orientation change detected (${newCount}/3)`);
          return newCount;
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [hasStarted, submitted]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasStarted && !submitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
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
      if (isMobile && !window.matchMedia("(display-mode: standalone)").matches) {
        toast.info("Please install as PWA for secure attempt");
      }

      await requestFullscreen(document.documentElement);
      setHasStarted(true);
    } catch (error) {
      toast.error("Failed to enter secure mode. Please try again.");
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
  }, [id, session]);

  useEffect(() => {
    if (!id || hasAttempted) return;

    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quiz-get/${id}`);
        if (response.data.success.active === false) {
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

  const ReturnToFullscreenButton = () => {
    if (!document.fullscreenElement && hasStarted && !submitted) {
      return (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => requestFullscreen(document.documentElement)}
            className={`px-4 py-2 rounded-lg ${
              theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            Return to Fullscreen
          </button>
        </div>
      );
    }
    return null;
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
          if (screen.orientation?.unlock) screen.orientation.unlock();
          router.push(`/dashboard`);
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
      <div
        className={`flex flex-col justify-center items-center gap-2 h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <p className="text-xl text-white-600">You have already attempted this quiz.</p>
        <Link href="/dashboard" className="bg-blue-600 p-2 rounded-lg">
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

  if (!hasStarted) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <div
          className={`rounded-lg shadow-lg p-8 max-w-2xl w-full ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold mb-4">{quizData.name} Instructions</h1>
            <button
              onClick={handleStartQuiz}
              disabled={!declarationsAgreed || !termsAgreed}
              className={`p-2 rounded-lg mb-4 transition-colors ${
                theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
              } text-white ${!declarationsAgreed || !termsAgreed ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Start Quiz in Fullscreen
            </button>
          </div>
          <div className="space-y-4">
            {isMobile && (
              <div
                className={`p-3 mb-4 rounded-lg ${
                  theme === "dark" ? "bg-red-900" : "bg-red-100"
                }`}
              >
                ⚠️ Mobile Restrictions:
                <ul className="list-disc pl-5 mt-2">
                  <li>Screen recording/printscreen disabled</li>
                  <li>Install as PWA required</li>
                  <li>Landscape mode locked</li>
                  <li>App switching limited to 3 times</li>
                </ul>
              </div>
            )}
            <ul className="list-disc list-inside space-y-2">
              <li>Navigate between questions using the question panel</li>
              <li>Mark questions for review to come back later</li>
              <li>Calculator available in the tools menu</li>
            </ul>
            <div className="instructions" style={{ whiteSpace: "pre-line" }}>
              {quizData.instructions}
            </div>

            <div
              className={`p-4 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={declarationsAgreed}
                  onChange={(e) => setDeclarationsAgreed(e.target.checked)}
                  className={`form-checkbox h-4 w-4 ${
                    theme === "dark" ? "text-blue-600" : "text-blue-600"
                  }`}
                />
                <span>I hereby declare that I am not cheating. If found cheating, I understand I will be debarred.</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className={`form-checkbox h-4 w-4 ${
                    theme === "dark" ? "text-blue-600" : "text-blue-600"
                  }`}
                />
                <span>I agree to the terms and conditions of the quiz.</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        WebkitTouchCallout: "none",
        
      }}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => {
        e.preventDefault();
        toast.error("Copying disabled during quiz");
      }}
      onCut={(e) => {
        e.preventDefault();
        toast.error("Cutting disabled during quiz");
      }}
      onPaste={(e) => {
        e.preventDefault();
        toast.error("Pasting disabled during quiz");
      }}
    >
      <ReturnToFullscreenButton />
      <div className="flex justify-between items-center mb-8">
        <div className="text-xl font-bold">
          Time Remaining: {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            theme === "dark" ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-700 hover:bg-gray-800"
          } text-white`}
        >
          {showCalculator ? "Close Calculator" : "Open Calculator"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div
          className={`lg:col-span-3 rounded-lg shadow-lg p-8 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-bold mb-6">Question {currentQuestion + 1}</h3>
          <p className="mb-8">{quizData.questions[currentQuestion].question}</p>
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

          <div className="flex justify-between mt-8">
            <button
              onClick={() => handleQuestionChange(currentQuestion - 1)}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                theme === "dark" ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-200 hover:bg-gray-300"
              } disabled:opacity-50`}
            >
              Previous
            </button>
            <button
              onClick={handleMarkReview}
              className={`px-6 py-2 rounded-lg transition-colors ${
                theme === "dark" ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"
              } text-white`}
            >
              Mark for Review
            </button>
            <button
              onClick={() => handleQuestionChange(currentQuestion + 1)}
              disabled={currentQuestion === quizData.questions.length - 1}
              className={`px-6 py-2 rounded-lg transition-colors ${
                theme === "dark" ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-200 hover:bg-gray-300"
              } disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div
          className={`rounded-lg shadow-lg p-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h4 className="text-lg font-bold mb-4">Questions</h4>
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
                  