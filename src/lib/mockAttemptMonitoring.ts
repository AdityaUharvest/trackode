export type AttemptLifecycleStatus = 'completed' | 'in-progress' | 'left';

export type AttemptAnswers = Record<string, Record<string, number>>;

type AttemptLifecycleInput = {
  startedAt?: Date | string | null;
  lastActivityAt?: Date | string | null;
  completedAt?: Date | string | null;
  quizDurationMinutes?: number | null;
  now?: Date;
};

function toDate(value?: Date | string | null) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getSafePercentage(numerator: number, denominator: number) {
  if (!denominator || denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function countAnsweredQuestions(answers: AttemptAnswers = {}) {
  return Object.values(answers).reduce((sum, sectionAnswers) => {
    if (!sectionAnswers || typeof sectionAnswers !== 'object') {
      return sum;
    }
    return sum + Object.keys(sectionAnswers).length;
  }, 0);
}

export function countCorrectAnswers(
  answers: AttemptAnswers = {},
  correctAnswerByQuestionId: Map<string, number>
) {
  return Object.values(answers).reduce((sum, sectionAnswers) => {
    if (!sectionAnswers || typeof sectionAnswers !== 'object') {
      return sum;
    }

    return (
      sum +
      Object.entries(sectionAnswers).reduce((sectionSum, [questionId, answerIndex]) => {
        const correctAnswer = correctAnswerByQuestionId.get(questionId);
        if (typeof correctAnswer !== 'number') {
          return sectionSum;
        }
        return sectionSum + (answerIndex === correctAnswer ? 1 : 0);
      }, 0)
    );
  }, 0);
}

export function resolveAttemptLifecycle({
  startedAt,
  lastActivityAt,
  completedAt,
  quizDurationMinutes,
  now = new Date(),
}: AttemptLifecycleInput) {
  const started = toDate(startedAt);
  const completed = toDate(completedAt);
  const activity = toDate(lastActivityAt) || started;
  const durationMinutes = Math.max(0, Number(quizDurationMinutes || 0));
  const expectedEndAt =
    activity && durationMinutes > 0
      ? new Date(activity.getTime() + durationMinutes * 60 * 1000)
      : null;

  let status: AttemptLifecycleStatus = 'in-progress';
  if (completed) {
    status = 'completed';
  } else if (expectedEndAt && now.getTime() > expectedEndAt.getTime()) {
    status = 'left';
  }

  return {
    status,
    startedAt: started,
    completedAt: completed,
    lastActivityAt: activity,
    expectedEndAt,
  };
}

export function sumProctoringFlags(proctoring?: {
  fullscreenExitCount?: number;
  tabSwitchCount?: number;
  copyAttemptCount?: number;
  contextMenuCount?: number;
}) {
  const fullscreenExitCount = Number(proctoring?.fullscreenExitCount || 0);
  const tabSwitchCount = Number(proctoring?.tabSwitchCount || 0);
  const copyAttemptCount = Number(proctoring?.copyAttemptCount || 0);
  const contextMenuCount = Number(proctoring?.contextMenuCount || 0);

  return {
    fullscreenExitCount,
    tabSwitchCount,
    copyAttemptCount,
    contextMenuCount,
    total: fullscreenExitCount + tabSwitchCount + copyAttemptCount + contextMenuCount,
  };
}