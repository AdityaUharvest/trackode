'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { SubmitConfirmationModal } from '@/components/(tcs)/SubmitConfirmationModal';
import { QuizResultModal } from '@/components/(tcs)/QuizResultModal';
import { SectionProgress } from '@/components/(tcs)/SectionProgress';
import { QuestionTimer } from '@/components/(tcs)/QuestionTimer';
import { Loader2, Calculator, Minimize2, Maximize2, ChevronLeft, ChevronRight, Lock, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';
import { FeedbackForm } from '@/components/(tcs)/FeedbackForm';
import toast, { Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  section: string;
}

interface Section {
  name: string;
  label: string;
  timeLimit?: number;
  questionCount: number;
  submitted: boolean;
  unlocked: boolean;
}

interface IMockTest {
  _id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  shareCode: string;
  durationMinutes: number;
}

export default function QuizPlayer() {
  const { theme } = useTheme();
  const params = useParams();
  const shareCode = Array.isArray(params.shareCode) ? params.shareCode[0] : params.shareCode;

  const router = useRouter();
  const quizContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [quiz, setQuiz] = useState<IMockTest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [sectionAnswers, setSectionAnswers] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isCompletionPersisted, setIsCompletionPersisted] = useState(false);
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [hasAttemptedQuestions, setHasAttemptedQuestions] = useState(false);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);
  const [hasInProgressFromDB, setHasInProgressFromDB] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [showSectionWarning, setShowSectionWarning] = useState(false);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const [sectionData, setSectionsData] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectionTimers, setSectionTimers] = useState<Record<string, number>>({});
  const [hideNavAndFooter, setHideNavAndFooter] = useState(false);
  const [fullscreenPrompt, setFullscreenPrompt] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const fullscreenRequestRef = useRef(false);
  const optionOrderRef = useRef<Record<string, number[]>>({});
  // Refs kept in sync with state so the beforeunload handler always sees fresh values
  // without needing to be re-registered (avoids stale closures on unmount).
  const abandonGuardRef = useRef({
    isCompletionPersisted: false,
    sectionAnswers: {} as Record<string, Record<string, number>>,
    // Only true once every section has been API-saved and we are about to call /complete
    allSectionsSubmitted: false,
  });

  // Keep abandonGuardRef in sync
  useEffect(() => { abandonGuardRef.current.isCompletionPersisted = isCompletionPersisted; }, [isCompletionPersisted]);
  useEffect(() => { abandonGuardRef.current.sectionAnswers = sectionAnswers; }, [sectionAnswers]);

  // Fire /complete via sendBeacon ONLY when every section has already been API-saved
  // but the tab was closed before /complete could respond (e.g. network dropout on
  // the very last request). This is intentionally NOT triggered mid-quiz on partial
  // section saves to avoid prematurely marking an in-progress attempt as complete.
  useEffect(() => {
    const handleUnload = () => {
      const { isCompletionPersisted: persisted, sectionAnswers: ans, allSectionsSubmitted } = abandonGuardRef.current;
      if (persisted || !allSectionsSubmitted) return;
      const code = Array.isArray(shareCode) ? shareCode[0] : shareCode;
      if (!code) return;
      const blob = new Blob([JSON.stringify({ answers: ans })], { type: 'application/json' });
      navigator.sendBeacon(`/api/quiz/${code}/complete`, blob);
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload); // Safari
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [shareCode]);

  const reportProctoringEvent = (eventType: 'fullscreen_exit' | 'tab_hidden' | 'copy_attempt' | 'context_menu', detail = '') => {
    if (!quizStarted || !shareCode) return;

    void fetch(`/api/quiz/${shareCode}/proctoring`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, detail }),
      keepalive: true,
    }).catch(() => {
      // Ignore telemetry failures to avoid blocking quiz flow.
    });
  };

  // Initialize sections and load saved answers
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const savedDataKey = `quiz_${shareCode}_data`;
        const savedDataRaw = localStorage.getItem(savedDataKey);
        const hasInProgressSnapshot = Boolean(savedDataRaw);

        const getOrderedQuestionsForAttempt = (fetchedQuestions: Question[]): Question[] => {
          const orderStorageKey = `quiz_${shareCode}_question_order`;

          try {
            const storedOrderRaw = hasInProgressSnapshot ? localStorage.getItem(orderStorageKey) : null;
            if (storedOrderRaw) {
              const storedOrder = JSON.parse(storedOrderRaw) as string[];
              if (Array.isArray(storedOrder) && storedOrder.length === fetchedQuestions.length) {
                const byId = new Map(fetchedQuestions.map((q) => [q._id, q]));
                const ordered = storedOrder
                  .map((id) => byId.get(id))
                  .filter((q): q is Question => Boolean(q));

                if (ordered.length === fetchedQuestions.length) {
                  return ordered;
                }
              }
            }
          } catch (storageError) {
            console.warn('Failed to parse stored question order:', storageError);
          }

          const shuffled = [...fetchedQuestions];
          for (let i = shuffled.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }

          localStorage.setItem(orderStorageKey, JSON.stringify(shuffled.map((q) => q._id)));
          return shuffled;
        };

        const applyStableOptionShuffle = (orderedQuestions: Question[]): Question[] => {
          const optionOrderStorageKey = `quiz_${shareCode}_option_order`;
          const storedOptionOrderRaw = hasInProgressSnapshot ? localStorage.getItem(optionOrderStorageKey) : null;
          const persistedOptionOrder: Record<string, number[]> = {};

          try {
            if (storedOptionOrderRaw) {
              const parsed = JSON.parse(storedOptionOrderRaw) as Record<string, number[]>;
              if (parsed && typeof parsed === 'object') {
                Object.assign(persistedOptionOrder, parsed);
              }
            }
          } catch (storageError) {
            console.warn('Failed to parse stored option order:', storageError);
          }

          const nextOptionOrder: Record<string, number[]> = {};
          const questionsWithShuffledOptions = orderedQuestions.map((question) => {
            const candidate = persistedOptionOrder[question._id];
            const isValidCandidate =
              Array.isArray(candidate) &&
              candidate.length === question.options.length &&
              candidate.every((idx) => Number.isInteger(idx) && idx >= 0 && idx < question.options.length) &&
              new Set(candidate).size === question.options.length;

            const permutation = isValidCandidate
              ? [...candidate]
              : [...Array(question.options.length).keys()];

            if (!isValidCandidate) {
              for (let i = permutation.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
              }
            }

            nextOptionOrder[question._id] = permutation;

            return {
              ...question,
              options: permutation.map((originalIndex) => question.options[originalIndex]),
            };
          });

          optionOrderRef.current = nextOptionOrder;
          localStorage.setItem(optionOrderStorageKey, JSON.stringify(nextOptionOrder));
          return questionsWithShuffledOptions;
        };

        // Fetch quiz data
        const response = await axios.get(`/api/quiz/${shareCode}`);
        const orderedQuestions = getOrderedQuestionsForAttempt(response.data.questions || []);
        const displayQuestions = applyStableOptionShuffle(orderedQuestions);
        setQuiz(response.data.quiz);
        setQuestions(displayQuestions);
        setIsPublished(response.data.quiz.isPublished);

        // Check if quiz has already been attempted
        const attempted = await axios.get(`/api/quiz/${shareCode}/attempted`);
        if (attempted.data?.isAttempted) {
          setHasAttempted(true);
        }
        if (attempted.data?.hasInProgress) {
          setHasInProgressFromDB(true);
          // Restore fullscreen exit count so the warning tally is accurate on resume
          const savedExits = Number(attempted.data?.fullscreenExitCount) || 0;
          if (savedExits > 0) {
            setFullscreenExits(savedExits);
          }
        }

        // Fetch and normalize sections
        const res = await axios.get('/api/fetchSection');
        // Count questions for each section
        const questionCountMap: Record<string, number> = {};
        displayQuestions.forEach((q: Question) => {
          questionCountMap[q.section] = (questionCountMap[q.section] || 0) + 1;
        });

        const normalizedSections = res.data.sections.map((s: { value: string; label: string }) => {
          const questionCount = questionCountMap[s.value] || 0;
          return {
            name: s.value,
            label: s.label,
            timeLimit: questionCount * 60, // 60 seconds per question
            questionCount,
            submitted: false,
            unlocked: false,
          };
        });

        // Count questions in each section


        // Filter out sections with 0 questions
        const filteredSections = normalizedSections.filter((s: Section) => s.questionCount > 0);

        // Unlock the first section
        if (filteredSections.length > 0) {
          filteredSections[0].unlocked = true;
        }

        // Load saved answers and timers from localStorage
        let savedTimers: Record<string, number> = {};
        if (savedDataRaw) {
          const parsed = JSON.parse(savedDataRaw);
          setAnswers(parsed.answers || {});
          setSectionAnswers(parsed.sectionAnswers || {});
          setHasAttemptedQuestions(Object.keys(parsed.answers || {}).length > 0);
          savedTimers = parsed.sectionTimers || {};

          // Restore section states
          if (parsed.sectionsState) {
            filteredSections.forEach((section: any) => {
              const savedSection = parsed.sectionsState.find((s: any) => s.name === section.name);
              if (savedSection) {
                section.submitted = savedSection.submitted;
                section.unlocked = savedSection.unlocked;
              }
            });
          }

          const firstUnsubmitted = filteredSections.find((s: Section) => !s.submitted);
          if (firstUnsubmitted) {
            setCurrentSection(firstUnsubmitted.name);
          }
        } else if (attempted.data?.hasInProgress && Array.isArray(attempted.data?.submittedSections) && (attempted.data.submittedSections as string[]).length > 0) {
          const dbSubmitted: string[] = attempted.data.submittedSections;
          const normalizedDbSubmitted = dbSubmitted.map((s: string) => s.trim().toLowerCase());
          filteredSections.forEach((section: Section) => {
            if (normalizedDbSubmitted.includes(section.name.trim().toLowerCase())) {
              section.submitted = true;
              section.unlocked = true;
            }
          });
          const firstUnsubmitted = filteredSections.find((s: Section) => !s.submitted);
          if (firstUnsubmitted) {
            firstUnsubmitted.unlocked = true;
            setCurrentSection(firstUnsubmitted.name);
          } else {
            setCurrentSection(filteredSections[filteredSections.length - 1]?.name || '');
          }
          setHasAttemptedQuestions(true);
        } else {
          setCurrentSection(filteredSections[0]?.name || '');
        }

        // Set section timers
        setSectionTimers(savedTimers);

        // Set final section state
        setSectionsData(normalizedSections);
        setSections(filteredSections);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please check the link and try again.');
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [shareCode]);

  // Save answers and timers to localStorage
  useEffect(() => {
    if (quizStarted && sections.length > 0) {
      localStorage.setItem(
        `quiz_${shareCode}_data`,
        JSON.stringify({
          answers,
          sectionAnswers,
          sectionTimers,
          sectionsState: sections.map((s) => ({
            name: s.name,
            submitted: s.submitted,
            unlocked: s.unlocked,
          })),
        })
      );
      setHasAttemptedQuestions(Object.keys(answers).length > 0);
    }
  }, [answers, sectionAnswers, sections, sectionTimers, shareCode, quizStarted]);

  // Section timer logic
  useEffect(() => {
    if (!quizStarted || !currentSection) return;

    const section = sections.find((s) => s.name === currentSection);
    if (!section?.timeLimit || section.submitted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Initialize timer from saved state or default to section's timeLimit
    const savedTime = sectionTimers[currentSection] ?? section.timeLimit;
    setSectionTimeRemaining(savedTime);

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setSectionTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setIsTimeUp(true);
          setShowSubmitModal(true);
          return 0;
        }
        const newTime = prev - 1;
        // Update sectionTimers state
        setSectionTimers((prevTimers) => ({
          ...prevTimers,
          [currentSection]: newTime,
        }));
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentSection, quizStarted, sections, sectionTimers]);

  // Ensure Time's Up modal is shown when isTimeUp is true
  useEffect(() => {
    if (isTimeUp && !showSubmitModal) {
      setShowSubmitModal(true);
    }
  }, [isTimeUp, showSubmitModal]);

  // Auto-submit when time is up and modal is closed
  useEffect(() => {
    if (isTimeUp && !showSubmitModal && !isSubmitting) {
      handleSectionSubmit();
      setIsTimeUp(false);
    }
  }, [isTimeUp, showSubmitModal, isSubmitting]);

  // Request fullscreen with error handling
  const requestFullscreen = async () => {
    if (fullscreenRequestRef.current || document.fullscreenElement) return;
    fullscreenRequestRef.current = true;

    try {
      await quizContainerRef.current?.requestFullscreen();
    } catch (e) {
      console.error('Fullscreen error:', e);
      toast.error('Please enable fullscreen mode to continue the quiz.');
      setFullscreenPrompt(true);
    } finally {
      fullscreenRequestRef.current = false;
    }
  };

  const startQuiz = async () => {
    handleUserInteraction();
    if (document.fullscreenElement) {
      toast.error('You are already in fullscreen mode.');
      return;
    }

    try {

      setQuizStarted(true);
      setHideNavAndFooter(true);

    } catch (error) {
      console.error('Fullscreen setup error:', error);
      toast.error('Failed to start quiz in fullscreen mode.');
      setQuizStarted(false);
      setHideNavAndFooter(false);
    }

  };

  // Handle user interactions to re-enter fullscreen
  const handleUserInteraction = () => {
    if (!quizStarted || document.fullscreenElement) return;
    requestFullscreen();
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (isTimeUp) return; // Prevent answering when time is up

    const currentSectionObj = sections.find((s) => s.name === currentSection);
    if (currentSectionObj?.submitted) return;

    const optionOrder = optionOrderRef.current[questionId];
    const originalOptionIndex = Array.isArray(optionOrder) ? optionOrder[optionIndex] : optionIndex;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: originalOptionIndex,
    }));

    setSectionAnswers((prev) => {
      const newSectionAnswers = { ...prev };
      if (!newSectionAnswers[currentSection]) {
        newSectionAnswers[currentSection] = {};
      }
      newSectionAnswers[currentSection] = {
        ...newSectionAnswers[currentSection],
        [questionId]: originalOptionIndex,
      };
      return newSectionAnswers;
    });

    handleUserInteraction();
  };

  const changeSection = (sectionName: string) => {
    if (isTimeUp) return; // Prevent section change when time is up

    const targetSection = sections.find((s) => s.name === sectionName);
    if (!targetSection?.unlocked || targetSection.submitted) {
      toast.error('Changing sections is not allowed. Service on request, contact your organizer.');
      return;
    }

    setCurrentSection(sectionName);
    setCurrentQuestionIndex(0);
  };

  const goToQuestion = (index: number) => {
    if (isTimeUp) return; // Prevent navigation when time is up

    const currentSectionObj = sections.find((s) => s.name === currentSection);
    if (currentSectionObj?.submitted) return;

    setCurrentQuestionIndex(index);
    handleUserInteraction();
  };

  const goToNextQuestion = () => {
    if (isTimeUp) return; // Prevent navigation when time is up

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      handleUserInteraction();
    }
    handleUserInteraction();
  };

  const goToPrevQuestion = () => {
    if (isTimeUp) return; // Prevent navigation when time is up

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      handleUserInteraction();
    }
    handleUserInteraction();
  };

  const handleSectionSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const currentSectionIndex = sections.findIndex((s) => s.name === currentSection);
      console.log('Current Section:', currentSectionIndex, currentSection);

      const sectionAnswersObj = sectionAnswers[currentSection] || {};
      console.log('Submitting answers for section:', currentSection, sectionAnswersObj);

      const answeredQuestions = Object.keys(sectionAnswersObj).length;
      if (answeredQuestions === 0 && !isTimeUp) {
        setShowSectionWarning(true);
        setIsSubmitting(false);
        return;
      }

      try {
        await axios.post(`/api/quiz/${shareCode}/answers`, {
          section: currentSection,
          answers: sectionAnswersObj,
        });
      } catch (saveErr: any) {
        const status = saveErr?.response?.status;
        if (status === 410) {
          // Quiz time fully expired — force-complete with whatever was answered so far
          toast.error('Quiz time has expired. Submitting your progress...');
          await handleQuizSubmit({ skipSubmittingGuard: true });
          return;
        }
        if (status === 409) {
          // Already completed (e.g. submitted from another tab/device)
          toast.error('Quiz already submitted. Redirecting...');
          router.push('/dashboard');
          return;
        }
        throw saveErr;
      }

      setSections((prev) =>
        prev.map((s) =>
          s.name === currentSection ? { ...s, submitted: true } : s
        )
      );

      // Clear timer for submitted section
      setSectionTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[currentSection];
        return newTimers;
      });

      if (currentSectionIndex < sections.length - 1) {
        setSections((prev) =>
          prev.map((s, idx) =>
            idx === currentSectionIndex + 1 ? { ...s, unlocked: true } : s
          )
        );
        const nextSection = sections[currentSectionIndex + 1].name;
        setCurrentSection(nextSection);
        setCurrentQuestionIndex(0);
      } else {
        // Every section has been API-saved. Arm the sendBeacon guard so that if
        // the tab is closed before /complete responds, the beacon fires it.
        abandonGuardRef.current.allSectionsSubmitted = true;
        await handleQuizSubmit({ skipSubmittingGuard: true });
      }
    } catch (err) {
      console.error('Error submitting section:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
      setShowSectionWarning(false);
      setIsTimeUp(false); // Reset isTimeUp after submission
    }
  };

  const handleQuizSubmit = async (options?: { skipSubmittingGuard?: boolean }) => {
    const skipSubmittingGuard = Boolean(options?.skipSubmittingGuard);
    if (isSubmitting && !skipSubmittingGuard) return;
    if (!skipSubmittingGuard) {
      setIsSubmitting(true);
    }
    try {
      console.log('Submitting all answers:', sectionAnswers);

      const totalAnswers = Object.values(sectionAnswers).reduce(
        (count, sectionObj) => count + Object.keys(sectionObj || {}).length,
        0
      );

      console.log('Total answers count:', totalAnswers);

      await axios.post(`/api/quiz/${shareCode}/complete`, {
        answers: sectionAnswers,
      });
      setIsCompletionPersisted(true);

      localStorage.removeItem(`quiz_${shareCode}_data`);
      localStorage.removeItem(`quiz_${shareCode}_question_order`);
      localStorage.removeItem(`quiz_${shareCode}_option_order`);
      setShowFeedbackModal(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      if (!skipSubmittingGuard) {
        setIsSubmitting(false);
      }
      setShowSubmitModal(false);
      setIsTimeUp(false);
    }
  };

  const handleFeedbackComplete = () => {
    setShowFeedbackModal(false);
    setHideNavAndFooter(false);
    router.push('/dashboard');
  };

  const ensureQuizCompleted = async () => {
    if (isCompletionPersisted) return true;

    try {
      await axios.post(`/api/quiz/${shareCode}/complete`, {
        answers: sectionAnswers,
      });
      setIsCompletionPersisted(true);
      return true;
    } catch (completionError) {
      console.error('Failed to persist completion while closing feedback modal:', completionError);
      toast.error('Could not finalize quiz yet. Please try again.');
      return false;
    }
  };

  const handleFeedbackDismiss = async () => {
    const isCompleted = await ensureQuizCompleted();
    if (!isCompleted) return;
    handleFeedbackComplete();
  };

  // Fullscreen handling
  useEffect(() => {
    if (!quizStarted) return;

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);

      if (!document.fullscreenElement && quizStarted) {
        setFullscreenExits((prev) => {
          const nextCount = prev + 1;
          reportProctoringEvent('fullscreen_exit', `count:${nextCount}`);
          if (nextCount >= 4) {
            toast.error('Maximum fullscreen exits reached. Submitting your progress...');
            handleQuizSubmit();
          } else {
            toast.error(`Warning ${nextCount}/4: Please stay in fullscreen mode`);
            setFullscreenPrompt(true);
          }
          return nextCount;
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [quizStarted, fullscreenExits]);

  // Prevent context menu and text selection
  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      if (quizStarted) {
        reportProctoringEvent('context_menu');
      }
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    const handleSelectStart = (e: Event) => e.preventDefault();
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [quizStarted, shareCode]);

  useEffect(() => {
    if (!quizStarted) return;

    const handleVisibilityChange = () => {
      const active = !document.hidden;
      setIsTabActive(active);
      if (!active) {
        reportProctoringEvent('tab_hidden', 'visibilitychange');
      }
    };

    const handleWindowBlur = () => {
      setIsTabActive(false);
      reportProctoringEvent('tab_hidden', 'window_blur');
    };

    const handleWindowFocus = () => {
      setIsTabActive(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [quizStarted, shareCode]);

  // Prevent copying
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (quizStarted) {
        e.preventDefault();
        reportProctoringEvent('copy_attempt');
        toast.error('Copying is disabled during the quiz');
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [quizStarted]);

  // Add click handler for the entire quiz container
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('button, input, .option')) return;
    handleUserInteraction();
  };

  const currentQuestions = questions.filter((q) => q.section === currentSection);
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentSectionData = sections.find((s) => s.name === currentSection);
  const isLastSection = sections.findIndex((s) => s.name === currentSection) === sections.length - 1;
  const hasQuestions = currentQuestions.length > 0;
  const isSectionSubmitted = currentSectionData?.submitted || false;

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin h-12 w-12 text-indigo-500" />
      </div>
    );
  }
  if (hasAttempted) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-md max-w-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className="text-2xl font-bold mb-6">Quiz Already Attempted</h2>
          <p className="text-sm mb-8 text-gray-500">
            You have already completed this quiz. Explore other quizzes or mocks to continue your learning journey.
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className={`w-full px-6 py-3 rounded-md font-medium ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/programming-quizzes')}
              className={`w-full px-6 py-3 rounded-md font-medium ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              Explore Free Live Quizzes
            </button>
            <button
              onClick={() => router.push('/mocks')}
              className={`w-full px-6 py-3 rounded-md font-medium ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
            >
              Explore Free Live Mocks
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!isPublished) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-6 rounded-md max-w-md text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <h2 className="text-lg font-bold mb-4">The Quiz is ended</h2>
          <p className="mb-6">This quiz is not yet published. Please check back later.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className={`px-4 mr-3 py-2 rounded ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
          >
            Student Dashboard
          </button>
          <button
            onClick={() => router.push('/programming-quizzes')}
            className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
          >
            Explore Free Live Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin h-12 w-12 text-indigo-500" />
        Submitting your answers...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-6 rounded-md max-w-md text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <h2 className="text-lg font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className={`flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-lg shadow-sm-lg w-full max-w-3xl mx-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold mb-2">{quiz?.title}</h1>
            {(hasAttemptedQuestions || hasInProgressFromDB) && (
              <div className={`inline-block px-4 py-2 rounded-full mb-4 ${theme === 'dark' ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800'}`}>
                {hasAttemptedQuestions ? 'You have an in-progress attempt (this device)' : 'You have an unfinished attempt — resuming from where you left off'}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Sections</h2>
              <div className="space-y-3">
                {sections.map((section) => (
                  <div
                    key={section.name}
                    className={`p-4 rounded-md border flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      } ${!section.unlocked ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {!section.unlocked && <Lock size={16} className="flex-shrink-0" />}
                      <span className="font-medium">{section.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {section.questionCount} Qs
                      </span>
                      {section.timeLimit && (
                        <span className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {Math.floor(section.timeLimit / 60)} mins
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Instructions</h2>
              <ul className="space-y-3">
                {[
                  'Sections must be completed in sequence',
                  'First section is unlocked automatically',
                  'Next section unlocks only after submitting current section',
                  'Submitted sections are locked permanently',
                  'You cannot return to submitted sections',
                  'Complete all questions before time runs out',
                  'Contact support for any issues trackode.ai@gmail.com',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-1 w-5 h-5 p-2 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            {/* adding terms and i am ready for full screen check box */}
            <div className="flex items-center justify-center mb-4">
              <input
                type="checkbox"
                id="terms"
                className={`mr-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                checked={hideNavAndFooter}
                onChange={(e) => {
                  setHideNavAndFooter(e.target.checked)
                  setFullscreenPrompt(e.target.checked);
                }}
              />
              <label htmlFor="terms" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                I agree to the terms and conditions
              </label>
            </div>

            <button
              onClick={() => {
                startQuiz()
                requestFullscreen()
              }}
              disabled={!hideNavAndFooter}
              className={`px-8 py-3 rounded-md font-medium text-base ${theme === 'dark'
                ? 'bg-green-700 hover:bg-green-600'
                : 'bg-green-600 hover:bg-green-700'
                } text-white shadow-md transition-all ${!hideNavAndFooter ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {hasAttemptedQuestions || hasInProgressFromDB ? 'Resume Attempt' : 'Start Quiz Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={quizContainerRef}
      onClick={handleContainerClick}
      className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} overflow-y-auto min-h-screen`}
    >
      <style jsx global>{`
        /* Disable text selection */
        body {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Disable long-press on mobile */
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Prevent image dragging */
        img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }

        /* Hide navbar and footer */
        ${hideNavAndFooter ? `
          navbar, footer, nav {
            display: none !important;
          }
        ` : ''}
      `}</style>

      <header
        className={`sticky top-0 z-10 mt-5 shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-sm ml-2 font-bold truncate max-w-xs">{quiz?.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {currentSectionData?.timeLimit && !isSectionSubmitted && (
              <QuestionTimer timeRemaining={sectionTimeRemaining} onTimeUp={handleSectionSubmit} theme={theme} />
            )}

            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } ${showCalculator ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
              title="Calculator"
            >
              <Calculator size={20} />
            </button>

            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  quizContainerRef.current?.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Prompt Modal */}
      {fullscreenPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className={`p-8 rounded-md max-w-md text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-bold mb-4">Fullscreen Required</h2>
            <p className="mb-6">This quiz requires fullscreen mode. Please enable it to continue.</p>
            <button
              onClick={async () => {
                await requestFullscreen();
                setFullscreenPrompt(false);
              }}
              className={`px-6 py-2 rounded ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              Enable Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Main Quiz Content */}
      <div className="mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Section Navigation - Left Sidebar */}
        <div className="lg:col-span-3">
          <SectionProgress
            sections={sections}
            currentSection={currentSection}
            answers={sectionAnswers}
            onChangeSection={changeSection}
            theme={theme}
          />
        </div>

        {/* Question Area - Middle Content */}
        <div className="lg:col-span-6">
          {hasQuestions ? (
            <div className={`p-6 rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Question Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0 || isSectionSubmitted || isTimeUp}
                  className={`flex items-center gap-1 px-3 py-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 disabled:opacity-40' : 'hover:bg-gray-100 disabled:opacity-40'
                    }`}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  {currentQuestionIndex + 1}/{currentQuestions.length}
                </span>

                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === currentQuestions.length - 1 || isSectionSubmitted || isTimeUp}
                  className={`flex items-center gap-1 px-3 py-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 disabled:opacity-40' : 'hover:bg-gray-100 disabled:opacity-40'
                    }`}
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <ReactMarkdown>{currentQuestion.text}</ReactMarkdown>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const optionOrder = optionOrderRef.current[currentQuestion._id] || [];
                  const originalOptionIndex = optionOrder[index] ?? index;
                  const isSelected = answers[currentQuestion._id] === originalOptionIndex;

                  return (
                    <div
                      key={index}
                      onClick={() => !isSectionSubmitted && !isTimeUp && handleAnswerSelect(currentQuestion._id, index)}
                      className={`p-4 rounded-md transition-all border option ${isSelected
                        ? theme === 'dark'
                          ? 'border-indigo-500 bg-indigo-900/30'
                          : 'border-indigo-500 bg-indigo-50'
                        : theme === 'dark'
                          ? 'border-gray-700 hover:bg-gray-700'
                          : 'border-gray-200 hover:bg-gray-50'
                        } ${isSectionSubmitted || isTimeUp ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${isSelected
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : theme === 'dark'
                              ? 'border-gray-500'
                              : 'border-gray-300'
                            }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="break-words">{option}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4">
                {!isSectionSubmitted ? (
                  <>
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      disabled={isTimeUp}
                      className={`flex-1 py-2.5 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        } ${isTimeUp ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLastSection ? 'Submit Quiz' : 'Submit Section'}
                    </button>

                    <button
                      onClick={goToNextQuestion}
                      disabled={currentQuestionIndex === currentQuestions.length - 1 || isTimeUp}
                      className={`flex-1 py-2.5 rounded-md font-medium ${theme === 'dark'
                        ? 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50'
                        : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50'
                        } text-white`}
                    >
                      {currentQuestionIndex === currentQuestions.length - 1 ? 'Review' : 'Next Question'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      const nextSection = sections.find((s) => s.unlocked && !s.submitted);
                      if (nextSection) {
                        changeSection(nextSection.name);
                      } else {
                        handleQuizSubmit();
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-md font-medium ${theme === 'dark' ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                  >
                    {isLastSection ? 'View Results' : 'Continue to Next Section'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-lg shadow-sm text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-base font-medium mb-4">No questions available in this section</h3>
              <button
                onClick={() => {
                  const nextSection = sections.find((s) => s.unlocked && !s.submitted);
                  if (nextSection) {
                    changeSection(nextSection.name);
                  }
                }}
                className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-600'
                  } text-white`}
              >
                Continue to Next Section
              </button>
            </div>
          )}
        </div>

        {/* Question Navigator - Right Sidebar */}
        <div className="lg:col-span-3">
          <div className={`p-4 rounded-lg shadow-sm mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="font-medium mb-3">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {currentQuestions.map((q, index) => (
                <button
                  key={q._id}
                  onClick={() => !isSectionSubmitted && !isTimeUp && goToQuestion(index)}
                  className={`aspect-square rounded flex items-center justify-center transition-all ${currentQuestionIndex === index
                    ? theme === 'dark'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-500 text-white'
                    : answers[q._id] !== undefined
                      ? theme === 'dark'
                        ? 'bg-green-900/50 text-green-200'
                        : 'bg-green-100 text-green-800'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${isSectionSubmitted || isTimeUp ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isSectionSubmitted || isTimeUp}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {showCalculator && (
            <div className={`p-4 rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div
                className={`mb-3 p-3 rounded text-right font-mono text-base ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                  }`}
              >
                {calcInput || '0'}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C', '⌫'].map(
                  (btn) => (
                    <button
                      key={btn}
                      onClick={() => {
                        if (btn === 'C') setCalcInput('');
                        else if (btn === '⌫') setCalcInput((prev) => prev.slice(0, -1));
                        else if (btn === '=') {
                          try {
                            // eslint-disable-next-line no-eval
                            setCalcInput(eval(calcInput).toString());
                          } catch {
                            setCalcInput('Error');
                          }
                        } else {
                          setCalcInput((prev) => prev + btn);
                        }
                      }}
                      className={`p-3 rounded text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        } ${['/', '*', '-', '+', '='].includes(btn)
                          ? theme === 'dark'
                            ? 'bg-indigo-900 hover:bg-indigo-800'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                          : ''
                        } ${btn === 'C'
                          ? theme === 'dark'
                            ? 'bg-red-900 hover:bg-red-800'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                          : ''
                        }`}
                    >
                      {btn}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          if (isTimeUp && !isSubmitting) {
            handleSectionSubmit();
          }
        }}
        onSubmit={isLastSection ? handleQuizSubmit : handleSectionSubmit}
        title={isTimeUp ? "Time's Up!" : isLastSection ? 'Submit Quiz' : `Submit ${currentSectionData?.label}`}
        message={
          isTimeUp
            ? `Time has expired for the ${currentSectionData?.label} section. Your answers will be submitted now.`
            : isLastSection
              ? 'Are you ready to submit your entire quiz? You cannot return to any sections after submission.'
              : `Are you ready to submit the ${currentSectionData?.label} section? You cannot return to this section.`
        }
        isSubmitting={isSubmitting}
        isTimeUp={isTimeUp}
      />

      {/* Tab Switch Warning */}
      {!isTabActive && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="bg-red-600 text-white p-8 rounded-md max-w-md text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-4">Warning!</h2>
            <p className="mb-6">
              You have switched away from the quiz. Please return immediately or your progress may be submitted.
            </p>
            <button
              onClick={() => setIsTabActive(true)}
              className="px-6 py-2 bg-white text-red-600 font-bold rounded hover:bg-gray-100"
            >
              I'm Back
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackForm
        isOpen={showFeedbackModal}
        onClose={handleFeedbackDismiss}
        quizId={quiz?._id || ''}
        quizTitle={quiz?.title || ''}
        theme={theme}
      />

      {/* Results Modal */}
      <QuizResultModal isOpen={showResultModal} onClose={() => router.push('/programming-quizzes')} quizId={quiz?._id || ''} />

    </div>
  );
}