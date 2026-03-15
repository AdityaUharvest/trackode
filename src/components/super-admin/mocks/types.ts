export type MockAttemptSection = {
  sectionName: string;
  answered: number;
  correct: number;
  totalQuestions: number;
};

export type MockAttempt = {
  _id: string;
  userId?: string;
  rank?: number;
  userName?: string;
  email?: string;
  status?: 'completed' | 'in-progress' | 'left';
  completedAt?: string;
  lastActivityAt?: string;
  expectedEndAt?: string;
  totalAnswered?: number;
  totalCorrect?: number;
  totalQuestions?: number;
  accuracy?: number;
  sectionStats?: MockAttemptSection[];
};

export type ResultsSummary = {
  participants: number;
  avgAccuracy: number;
  avgAnswered: number;
  totalQuestions: number;
  completions: number;
};

export type ResultsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
