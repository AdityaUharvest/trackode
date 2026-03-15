export type ProfileSummary = {
  isOwner?: boolean;
  isPrivateProfile?: boolean;
  stats: {
    totalMocksPlayed: number;
    totalQuizzesPlayed: number;
    certificates: number;
    topFinishes: number;
    highestMock: {
      title: string;
      accuracy: number;
      totalCorrect: number;
      totalQuestions: number;
    };
    highestQuiz: {
      title: string;
      percentage: number;
      score: number;
      totalQuestions: number;
    };
  };
  topWins: Array<{
    title: string;
    kind: 'mock' | 'quiz';
  }>;
  mockHistory: Array<{
    attemptId: string;
    mockId: string;
    title: string;
    startedAt?: string | null;
    completedAt?: string | null;
    status: 'completed' | 'in-progress' | 'left';
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
  }>;
  quizHistory: Array<{
    resultId: string;
    quizId: string;
    title: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    percentage: number;
    attemptedAt?: string | null;
  }>;
  participants: Array<{
    id: string;
    email: string;
    name: string;
    image?: string;
    college?: string;
    branch?: string;
    year?: string;
    sharedMocks: number;
    sharedQuizzes: number;
    lastPlayedAt?: string | null;
    profileUrl: string;
  }>;
};

export type CertificateAchievement = {
  type: 'certificate';
  certificateId?: string;
  quizId?: string;
  rank: number;
  positionLabel?: string;
  badgeLabel?: 'Winner' | 'Participant';
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date?: string;
};

export type ProfileUser = {
  _id?: string;
  name?: string;
  email?: string;
  bio?: string;
  dob?: string;
  image?: string;
  phone?: string;
  leetcode?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  college?: string;
  branch?: string;
  year?: string;
  interests?: string[];
  languages?: string[];
  skills?: string[];
  public?: boolean;
  followers?: string[];
  followerCount?: number;
  achievements?: Array<CertificateAchievement | string | Record<string, unknown>>;
};

export type ProfileFormData = {
  name: string;
  email: string;
  bio: string;
  dob: string;
  college: string;
  branch: string;
  year: string;
  leetcode: string;
  github: string;
  linkedin: string;
  twitter: string;
  interests: string[];
  languages: string[];
  public: boolean;
  image: string;
};

export type OpenSections = {
  editBasic: boolean;
  editAcademic: boolean;
  personal: boolean;
  academic: boolean;
};

export type TopFinishTier = {
  label: string;
  stars: number;
  tone: string;
  chip: string;
};
