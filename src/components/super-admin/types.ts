export type SuperStats = {
  totalMocks: number;
  totalQuizzes: number;
  totalMockAttempts: number;
  totalQuizAttempts: number;
  totalMockResults: number;
  publishedMocks: number;
  activeQuizzes: number;
};

export type MockSection = { name: string; count: number };

export type MockItem = {
  _id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  public?: boolean;
  isPublished?: boolean;
  attempts?: number;
  shareCode?: string;
  createdAt?: string;
  sections?: MockSection[];
  questionCount?: number;
};

export type MockDraft = { title: string; difficulty: string; isPublic: boolean };

export type QuizItem = {
  _id: string;
  name: string;
  active?: boolean;
  public?: boolean;
  shareCode?: string;
  totalQuestions?: number;
  createdAt?: string;
  createdBy?: { name?: string; email?: string };
};

export type MockResultItem = {
  _id: string;
  quizTitle?: string;
  totalScore?: number;
  totalQuestions?: number;
  percentage?: number;
  rank?: number;
  completedAt?: string;
  userId?: { name?: string; email?: string };
  sections?: Array<{
    sectionName: string;
    correct: number;
    total: number;
  }>;
};

export type QuizResultItem = {
  _id: string;
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  attemptedAt?: string;
  title?: string;
  answers?: Array<{
    question?: string;
    userAnswer?: string;
    correctAnswer?: string;
    isCorrect?: boolean;
  }>;
  student?: { name?: string; email?: string };
  quiz?: { name?: string };
};

export type MockAttemptItem = {
  _id: string;
  quizId?: string;
  quizTitle?: string;
  userId?: string;
  user?: { name?: string; email?: string };
  startedAt?: string;
  completedAt?: string;
  answeredCount?: number;
  isCompleted?: boolean;
};

export type AppSettings = {
  maintenanceMode: boolean;
  quizzesEnabled: boolean;
  mocksEnabled: boolean;
  resultsVisible: boolean;
  allowPublicQuizJoin: boolean;
  allowMockAttempts: boolean;
};

export type TabId = 'overview' | 'mocks' | 'quizzes' | 'results' | 'settings';

export type ToastType = 'success' | 'error' | 'info';
export type Toast = { id: number; message: string; type: ToastType };

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export const DEFAULT_SETTINGS: AppSettings = {
  maintenanceMode: false,
  quizzesEnabled: true,
  mocksEnabled: true,
  resultsVisible: true,
  allowPublicQuizJoin: true,
  allowMockAttempts: true,
};
