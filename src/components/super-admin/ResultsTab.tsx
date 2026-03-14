'use client';

import { useMemo, useState, type ReactNode } from 'react';
import type { MockAttemptItem, MockResultItem, QuizResultItem } from './types';
import { ResultsCard } from './ui';

type ResultsTabProps = {
  mockAttempts: MockAttemptItem[];
  mockResults: MockResultItem[];
  quizResults: QuizResultItem[];
  onDataChanged: () => Promise<void>;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
};

type MockDetail = MockResultItem & {
  quizId?: { title?: string };
  userId?: { name?: string; email?: string };
  sections?: Array<{
    sectionName: string;
    correct: number;
    total: number;
    questions?: Array<{ isCorrect?: boolean }>;
  }>;
};

type QuizDetail = QuizResultItem & {
  student?: { name?: string; email?: string };
  quiz?: { name?: string };
  fullScreenViolations?: number;
  visibilityChanged?: number;
  submittedAutomatically?: boolean;
  timeLeft?: number;
};

type MockDetailSection = {
  sectionName: string;
  correct: number;
  total: number;
  questions?: Array<{ isCorrect?: boolean }>;
};

type DeleteIntent = {
  kind: 'mock' | 'quiz' | 'attempt';
  id: string;
  label: string;
};

type BulkDeleteIntent = {
  kind: 'mock' | 'quiz' | 'attempt';
  ids: string[];
  label: string;
};

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InsightCard({
  title,
  text,
  tone = 'neutral',
}: {
  title: string;
  text: string;
  tone?: 'neutral' | 'good' | 'warn';
}) {
  const toneClass =
    tone === 'good'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : tone === 'warn'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : 'border-slate-200 bg-slate-50 text-slate-900';

  return (
    <div className={`rounded-lg border p-3 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">{title}</p>
      <p className="mt-1 text-sm leading-6">{text}</p>
    </div>
  );
}

function getPerformanceLabel(percentage: number) {
  if (percentage >= 85) return 'Excellent';
  if (percentage >= 70) return 'Strong';
  if (percentage >= 50) return 'Average';
  return 'Needs Improvement';
}

function getPerformanceSummary(percentage: number) {
  if (percentage >= 85) return 'Very strong outcome with consistently high accuracy.';
  if (percentage >= 70) return 'Good performance with a solid grasp of most areas.';
  if (percentage >= 50) return 'Mixed performance. There are clear strengths, but also gaps to improve.';
  return 'Low accuracy overall. Review weak sections and wrong answers first.';
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function ResultsTab({ mockAttempts, mockResults, quizResults, onDataChanged, onToast }: ResultsTabProps) {
  const [activeKind, setActiveKind] = useState<'mock' | 'quiz' | 'attempt'>('mock');
  const [query, setQuery] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteIntent, setDeleteIntent] = useState<DeleteIntent | null>(null);
  const [bulkDeleteIntent, setBulkDeleteIntent] = useState<BulkDeleteIntent | null>(null);
  const [selectedMockIds, setSelectedMockIds] = useState<string[]>([]);
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);
  const [selectedAttemptIds, setSelectedAttemptIds] = useState<string[]>([]);

  const [mockDetail, setMockDetail] = useState<MockDetail | null>(null);
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);

  const [editingMock, setEditingMock] = useState<MockDetail | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<QuizDetail | null>(null);

  const totalMockScore = mockResults.reduce((sum, r) => sum + (r.totalScore || 0), 0);
  const totalMockQuestions = mockResults.reduce((sum, r) => sum + (r.totalQuestions || 0), 0);
  const avgMockPercent =
    totalMockQuestions > 0 ? Math.round((totalMockScore / totalMockQuestions) * 100) : 0;

  const totalQuizScore = quizResults.reduce((sum, r) => sum + (r.score || 0), 0);
  const totalQuizQuestions = quizResults.reduce((sum, r) => sum + (r.totalQuestions || 0), 0);
  const avgQuizPercent =
    totalQuizQuestions > 0 ? Math.round((totalQuizScore / totalQuizQuestions) * 100) : 0;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredMockResults = useMemo(() => {
    if (!normalizedQuery) {
      return mockResults;
    }

    return mockResults.filter((result) => {
      const user = `${result.userId?.name || ''} ${result.userId?.email || ''}`.toLowerCase();
      const quiz = `${result.quizTitle || ''}`.toLowerCase();
      return user.includes(normalizedQuery) || quiz.includes(normalizedQuery);
    });
  }, [mockResults, normalizedQuery]);

  const filteredMockAttempts = useMemo(() => {
    if (!normalizedQuery) {
      return mockAttempts;
    }

    return mockAttempts.filter((attempt) => {
      const user = `${attempt.user?.name || ''} ${attempt.user?.email || ''}`.toLowerCase();
      const quiz = `${attempt.quizTitle || ''}`.toLowerCase();
      return user.includes(normalizedQuery) || quiz.includes(normalizedQuery);
    });
  }, [mockAttempts, normalizedQuery]);

  const filteredQuizResults = useMemo(() => {
    if (!normalizedQuery) {
      return quizResults;
    }

    return quizResults.filter((result) => {
      const user = `${result.student?.name || ''} ${result.student?.email || ''}`.toLowerCase();
      const quiz = `${result.quiz?.name || ''} ${result.title || ''}`.toLowerCase();
      return user.includes(normalizedQuery) || quiz.includes(normalizedQuery);
    });
  }, [quizResults, normalizedQuery]);

  const visibleMockIds = filteredMockResults.map((result) => result._id);
  const visibleAttemptIds = filteredMockAttempts.map((attempt) => attempt._id);
  const visibleQuizIds = filteredQuizResults.map((result) => result._id);

  const allVisibleMockSelected =
    visibleMockIds.length > 0 && visibleMockIds.every((id) => selectedMockIds.includes(id));
  const allVisibleAttemptSelected =
    visibleAttemptIds.length > 0 && visibleAttemptIds.every((id) => selectedAttemptIds.includes(id));
  const allVisibleQuizSelected =
    visibleQuizIds.length > 0 && visibleQuizIds.every((id) => selectedQuizIds.includes(id));

  const toggleMockSelection = (id: string, checked: boolean) => {
    setSelectedMockIds((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      }
      return prev.filter((item) => item !== id);
    });
  };

  const toggleQuizSelection = (id: string, checked: boolean) => {
    setSelectedQuizIds((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      }
      return prev.filter((item) => item !== id);
    });
  };

  const toggleAttemptSelection = (id: string, checked: boolean) => {
    setSelectedAttemptIds((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      }
      return prev.filter((item) => item !== id);
    });
  };

  const toggleAllVisibleMocks = (checked: boolean) => {
    setSelectedMockIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...visibleMockIds]));
      }
      return prev.filter((id) => !visibleMockIds.includes(id));
    });
  };

  const toggleAllVisibleQuizzes = (checked: boolean) => {
    setSelectedQuizIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...visibleQuizIds]));
      }
      return prev.filter((id) => !visibleQuizIds.includes(id));
    });
  };

  const toggleAllVisibleAttempts = (checked: boolean) => {
    setSelectedAttemptIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...visibleAttemptIds]));
      }
      return prev.filter((id) => !visibleAttemptIds.includes(id));
    });
  };

  const fetchMockDetail = async (id: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/admin/results/mock/${id}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load mock result details');
      }
      return payload.result as MockDetail;
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchQuizDetail = async (id: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/admin/results/quiz/${id}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load quiz result details');
      }
      return payload.result as QuizDetail;
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewMock = async (id: string) => {
    try {
      const detail = await fetchMockDetail(id);
      setMockDetail(detail);
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not load mock result', 'error');
    }
  };

  const handleEditMock = async (id: string) => {
    try {
      const detail = await fetchMockDetail(id);
      setEditingMock(detail);
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not load mock result', 'error');
    }
  };

  const handleViewQuiz = async (id: string) => {
    try {
      const detail = await fetchQuizDetail(id);
      setQuizDetail(detail);
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not load quiz result', 'error');
    }
  };

  const handleEditQuiz = async (id: string) => {
    try {
      const detail = await fetchQuizDetail(id);
      setEditingQuiz(detail);
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not load quiz result', 'error');
    }
  };

  const handleSaveMock = async () => {
    if (!editingMock) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/results/mock/${editingMock._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: (editingMock.sections || []).map((section) => ({
            sectionName: section.sectionName,
            correct: section.correct,
          })),
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to save mock result');
      }

      setEditingMock(null);
      await onDataChanged();
      onToast('Mock result updated', 'success');
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not save mock result', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!editingQuiz) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/results/quiz/${editingQuiz._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: editingQuiz.score || 0,
          totalQuestions: editingQuiz.totalQuestions || 0,
          correctAnswers: editingQuiz.correctAnswers,
          incorrectAnswers: editingQuiz.incorrectAnswers,
          title: editingQuiz.title,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to save quiz result');
      }

      setEditingQuiz(null);
      await onDataChanged();
      onToast('Quiz result updated', 'success');
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not save quiz result', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteIntent) {
      return;
    }

    setSaving(true);
    try {
      const endpoint =
        deleteIntent.kind === 'mock'
          ? `/api/admin/results/mock/${deleteIntent.id}`
          : deleteIntent.kind === 'quiz'
          ? `/api/admin/results/quiz/${deleteIntent.id}`
          : `/api/admin/results/attempt/${deleteIntent.id}`;

      const response = await fetch(endpoint, { method: 'DELETE' });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete result');
      }

      setDeleteIntent(null);
      if (deleteIntent.kind === 'mock') {
        setSelectedMockIds((prev) => prev.filter((id) => id !== deleteIntent.id));
      } else if (deleteIntent.kind === 'quiz') {
        setSelectedQuizIds((prev) => prev.filter((id) => id !== deleteIntent.id));
      } else {
        setSelectedAttemptIds((prev) => prev.filter((id) => id !== deleteIntent.id));
      }
      await onDataChanged();
      onToast(deleteIntent.kind === 'attempt' ? 'Attempt deleted' : 'Result deleted', 'success');
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not delete result', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!bulkDeleteIntent || bulkDeleteIntent.ids.length === 0) {
      return;
    }

    setSaving(true);
    try {
      const endpoint =
        bulkDeleteIntent.kind === 'mock'
          ? '/api/admin/results/mock/bulk'
          : bulkDeleteIntent.kind === 'quiz'
          ? '/api/admin/results/quiz/bulk'
          : '/api/admin/results/attempt/bulk';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: bulkDeleteIntent.ids }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to bulk delete results');
      }

      if (bulkDeleteIntent.kind === 'mock') {
        setSelectedMockIds([]);
      } else if (bulkDeleteIntent.kind === 'quiz') {
        setSelectedQuizIds([]);
      } else {
        setSelectedAttemptIds([]);
      }

      setBulkDeleteIntent(null);
      await onDataChanged();
      onToast(payload?.message || 'Selected results deleted', 'success');
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not bulk delete results', 'error');
    } finally {
      setSaving(false);
    }
  };

  const mockInsights = useMemo(() => {
    if (!mockDetail) {
      return null;
    }

    const detailSections = (mockDetail.sections || []) as MockDetailSection[];

    const answeredQuestions = detailSections.reduce(
      (sum, section) => sum + (section.questions?.length || 0),
      0
    );
    const incorrectQuestions = Math.max(0, answeredQuestions - (mockDetail.totalScore || 0));
    const unansweredQuestions = Math.max(0, (mockDetail.totalQuestions || 0) - answeredQuestions);
    const sections = detailSections.map((section) => ({
      ...section,
      answered: section.questions?.length || 0,
      unanswered: Math.max(0, section.total - (section.questions?.length || 0)),
      accuracy: section.total > 0 ? Math.round((section.correct / section.total) * 100) : 0,
    }));

    const strongestSection = [...sections].sort((a, b) => b.accuracy - a.accuracy)[0] || null;
    const weakestSection = [...sections].sort((a, b) => a.accuracy - b.accuracy)[0] || null;
    const lowSections = sections.filter((section) => section.accuracy < 50);
    const percentage = Math.round(mockDetail.percentage || 0);

    return {
      answeredQuestions,
      incorrectQuestions,
      unansweredQuestions,
      strongestSection,
      weakestSection,
      lowSections,
      percentage,
      performanceLabel: getPerformanceLabel(percentage),
      performanceSummary: getPerformanceSummary(percentage),
      sections,
    };
  }, [mockDetail]);

  const quizInsights = useMemo(() => {
    if (!quizDetail) {
      return null;
    }

    const answers = quizDetail.answers || [];
    const answeredQuestions = answers.length;
    const correctAnswers =
      typeof quizDetail.correctAnswers === 'number'
        ? quizDetail.correctAnswers
        : answers.filter((answer) => answer.isCorrect).length;
    const incorrectAnswers =
      typeof quizDetail.incorrectAnswers === 'number'
        ? quizDetail.incorrectAnswers
        : Math.max(0, answeredQuestions - correctAnswers);
    const unansweredQuestions = Math.max(0, (quizDetail.totalQuestions || 0) - answeredQuestions);
    const percentage =
      (quizDetail.totalQuestions || 0) > 0
        ? Math.round(((quizDetail.score || 0) / (quizDetail.totalQuestions || 1)) * 100)
        : 0;
    const wrongAnswers = answers.filter((answer) => !answer.isCorrect);
    const flaggedByProctoring = (quizDetail.fullScreenViolations || 0) + (quizDetail.visibilityChanged || 0);

    return {
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      percentage,
      wrongAnswers,
      flaggedByProctoring,
      performanceLabel: getPerformanceLabel(percentage),
      performanceSummary: getPerformanceSummary(percentage),
    };
  }, [quizDetail]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatBlock label="Mock Attempts" value={String(mockAttempts.length)} />
        <StatBlock label="Mock Results" value={String(mockResults.length)} />
        <StatBlock label="Avg Mock Score" value={`${avgMockPercent}%`} />
        <StatBlock label="Quiz Results" value={String(quizResults.length)} />
        <StatBlock label="Avg Quiz Score" value={`${avgQuizPercent}%`} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex rounded-md border border-slate-300 bg-slate-50 p-1">
            <button
              onClick={() => setActiveKind('mock')}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                activeKind === 'mock' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mock Results
            </button>
            <button
              onClick={() => setActiveKind('attempt')}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                activeKind === 'attempt' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mock Attempts
            </button>
            <button
              onClick={() => setActiveKind('quiz')}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                activeKind === 'quiz' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Quiz Results
            </button>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by user name, email, or test title"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900 md:max-w-sm"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
          <p className="text-xs text-slate-500">
            {activeKind === 'mock'
              ? `${selectedMockIds.length} mock result(s) selected`
              : activeKind === 'quiz'
              ? `${selectedQuizIds.length} quiz result(s) selected`
              : `${selectedAttemptIds.length} attempt(s) selected`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (activeKind === 'mock') {
                  setSelectedMockIds([]);
                } else if (activeKind === 'quiz') {
                  setSelectedQuizIds([]);
                } else {
                  setSelectedAttemptIds([]);
                }
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear Selection
            </button>
            <button
              disabled={
                activeKind === 'mock'
                  ? selectedMockIds.length === 0
                  : activeKind === 'quiz'
                  ? selectedQuizIds.length === 0
                  : selectedAttemptIds.length === 0
              }
              onClick={() =>
                setBulkDeleteIntent({
                  kind: activeKind,
                  ids:
                    activeKind === 'mock'
                      ? selectedMockIds
                      : activeKind === 'quiz'
                      ? selectedQuizIds
                      : selectedAttemptIds,
                  label:
                    activeKind === 'mock'
                      ? `${selectedMockIds.length} mock result(s)`
                      : activeKind === 'quiz'
                      ? `${selectedQuizIds.length} quiz result(s)`
                      : `${selectedAttemptIds.length} attempt(s)`,
                })
              }
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Bulk Delete Selected
            </button>
          </div>
        </div>
      </div>

      {activeKind === 'mock' && (
        <ResultsCard title="Individual Mock Results">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allVisibleMockSelected}
                  onChange={(event) => toggleAllVisibleMocks(event.target.checked)}
                  aria-label="Select all visible mock results"
                />
              </th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Mock</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Sections</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-right">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredMockResults.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-xs text-slate-400">
                  No results
                </td>
              </tr>
            )}
            {filteredMockResults.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedMockIds.includes(r._id)}
                    onChange={(event) => toggleMockSelection(r._id, event.target.checked)}
                    aria-label={`Select mock result ${r._id}`}
                  />
                </td>
                <td className="px-3 py-2 text-xs text-slate-700">
                  {r.userId?.name ?? r.userId?.email ?? 'Unknown'}
                </td>
                <td className="px-3 py-2 text-xs font-medium text-slate-900">
                  {r.quizTitle ?? '—'}
                </td>
                <td className="px-3 py-2">
                  <span className="font-medium text-slate-900">
                    {r.totalScore ?? 0}/{r.totalQuestions ?? 0}
                  </span>
                  <span className="ml-1 text-xs text-slate-400">
                    ({Math.round(r.percentage ?? 0)}%)
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-slate-500">{(r.sections || []).length}</td>
                <td className="px-3 py-2 text-xs text-slate-400">
                  {r.completedAt ? new Date(r.completedAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleViewMock(r._id)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditMock(r._id)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit Marks
                    </button>
                    <button
                      onClick={() =>
                        setDeleteIntent({
                          kind: 'mock',
                          id: r._id,
                          label: r.quizTitle || 'this mock result',
                        })
                      }
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResultsCard>
      )}

      {activeKind === 'attempt' && (
        <ResultsCard title="Mock Attempts (In-Progress + Completed)">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={allVisibleAttemptSelected}
                    onChange={(event) => toggleAllVisibleAttempts(event.target.checked)}
                    aria-label="Select all visible mock attempts"
                  />
                </th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Mock</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Answered</th>
                <th className="px-3 py-2 text-left">Started</th>
                <th className="px-3 py-2 text-left">Completed</th>
                <th className="px-3 py-2 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMockAttempts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-xs text-slate-400">
                    No attempts
                  </td>
                </tr>
              )}
              {filteredMockAttempts.map((attempt) => (
                <tr key={attempt._id} className="hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedAttemptIds.includes(attempt._id)}
                      onChange={(event) => toggleAttemptSelection(attempt._id, event.target.checked)}
                      aria-label={`Select attempt ${attempt._id}`}
                    />
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-700">
                    {attempt.user?.name ?? attempt.user?.email ?? 'Unknown'}
                  </td>
                  <td className="px-3 py-2 text-xs font-medium text-slate-900">{attempt.quizTitle || '—'}</td>
                  <td className="px-3 py-2 text-xs">
                    <span
                      className={`rounded px-2 py-0.5 font-medium ${
                        attempt.isCompleted
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                      }`}
                    >
                      {attempt.isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-700">{attempt.answeredCount ?? 0}</td>
                  <td className="px-3 py-2 text-xs text-slate-400">
                    {attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400">
                    {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setDeleteIntent({
                            kind: 'attempt',
                            id: attempt._id,
                            label: attempt.quizTitle || 'this mock attempt',
                          })
                        }
                        className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResultsCard>
      )}

      {activeKind === 'quiz' && (
        <ResultsCard title="Individual Quiz Results">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allVisibleQuizSelected}
                  onChange={(event) => toggleAllVisibleQuizzes(event.target.checked)}
                  aria-label="Select all visible quiz results"
                />
              </th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Quiz</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-right">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredQuizResults.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-400">
                  No results
                </td>
              </tr>
            )}
            {filteredQuizResults.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedQuizIds.includes(r._id)}
                    onChange={(event) => toggleQuizSelection(r._id, event.target.checked)}
                    aria-label={`Select quiz result ${r._id}`}
                  />
                </td>
                <td className="px-3 py-2 text-xs text-slate-700">
                  {r.student?.name ?? r.student?.email ?? 'Unknown'}
                </td>
                <td className="px-3 py-2 text-xs font-medium text-slate-900">
                  {r.quiz?.name ?? '—'}
                </td>
                <td className="px-3 py-2 font-medium text-slate-900">
                  {r.score ?? 0}/{r.totalQuestions ?? 0}
                </td>
                <td className="px-3 py-2 text-xs text-slate-400">
                  {r.attemptedAt ? new Date(r.attemptedAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleViewQuiz(r._id)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditQuiz(r._id)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteIntent({
                          kind: 'quiz',
                          id: r._id,
                          label: r.quiz?.name || r.title || 'this quiz result',
                        })
                      }
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResultsCard>
      )}

      {loadingDetails && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Loading result details...
        </div>
      )}

      {mockDetail && (
        <ModalShell
          title={`Mock Result: ${mockDetail.quizTitle || mockDetail.quizId?.title || 'Untitled'}`}
          onClose={() => setMockDetail(null)}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <StatBlock label="User" value={mockDetail.userId?.name || mockDetail.userId?.email || 'Unknown'} />
            <StatBlock
              label="Score"
              value={`${mockDetail.totalScore || 0}/${mockDetail.totalQuestions || 0} (${Math.round(
                mockDetail.percentage || 0
              )}%)`}
            />
            <StatBlock label="Level" value={mockInsights?.performanceLabel || '-'} />
            <StatBlock label="Answered" value={String(mockInsights?.answeredQuestions || 0)} />
            <StatBlock label="Unanswered" value={String(mockInsights?.unansweredQuestions || 0)} />
            <StatBlock label="Incorrect" value={String(mockInsights?.incorrectQuestions || 0)} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
            <InsightCard
              title="Overall Interpretation"
              text={mockInsights?.performanceSummary || 'No interpretation available.'}
              tone={mockInsights && mockInsights.percentage >= 70 ? 'good' : mockInsights && mockInsights.percentage < 50 ? 'warn' : 'neutral'}
            />
            <InsightCard
              title="Strongest Section"
              text={
                mockInsights?.strongestSection
                  ? `${mockInsights.strongestSection.sectionName} at ${mockInsights.strongestSection.accuracy}% accuracy.`
                  : 'No strongest section available.'
              }
              tone="good"
            />
            <InsightCard
              title="Needs Attention"
              text={
                mockInsights?.lowSections?.length
                  ? `${mockInsights.lowSections.length} section(s) are below 50% accuracy. Start with ${mockInsights.lowSections
                      .slice(0, 2)
                      .map((section) => section.sectionName)
                      .join(', ')}.`
                  : 'No section is below 50% accuracy.'
              }
              tone={mockInsights?.lowSections?.length ? 'warn' : 'neutral'}
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Section</th>
                  <th className="px-3 py-2 text-left">Correct</th>
                  <th className="px-3 py-2 text-left">Answered</th>
                  <th className="px-3 py-2 text-left">Unanswered</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(mockInsights?.sections || []).map((section) => (
                  <tr key={section.sectionName}>
                    <td className="px-3 py-2 font-medium text-slate-900">{section.sectionName}</td>
                    <td className="px-3 py-2 text-slate-700">{section.correct}</td>
                    <td className="px-3 py-2 text-slate-700">{section.answered}</td>
                    <td className="px-3 py-2 text-slate-700">{section.unanswered}</td>
                    <td className="px-3 py-2 text-slate-700">{section.total}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {section.accuracy}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <InsightCard
              title="Completion Insight"
              text={
                mockInsights
                  ? `${mockInsights.answeredQuestions} out of ${mockDetail.totalQuestions || 0} questions were answered, leaving ${mockInsights.unansweredQuestions} unanswered.`
                  : 'No completion insight available.'
              }
            />
            <InsightCard
              title="Weakest Section"
              text={
                mockInsights?.weakestSection
                  ? `${mockInsights.weakestSection.sectionName} is lowest at ${mockInsights.weakestSection.accuracy}% accuracy.`
                  : 'No weakest section available.'
              }
              tone={mockInsights?.weakestSection && mockInsights.weakestSection.accuracy < 50 ? 'warn' : 'neutral'}
            />
          </div>
        </ModalShell>
      )}

      {editingMock && (
        <ModalShell
          title={`Edit Section Marks: ${editingMock.quizTitle || editingMock.quizId?.title || 'Untitled'}`}
          onClose={() => setEditingMock(null)}
        >
          <p className="text-sm text-slate-600">
            Update correct marks per section. Total score and percentage will be recalculated automatically.
          </p>
          <div className="mt-4 space-y-3">
            {(editingMock.sections || []).map((section, index) => (
              <div key={section.sectionName} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 text-sm font-medium text-slate-900">{section.sectionName}</div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-500">Correct Marks</label>
                  <input
                    type="number"
                    min={0}
                    max={section.total}
                    value={section.correct}
                    onChange={(event) => {
                      const next = Number(event.target.value || 0);
                      const bounded = Math.max(0, Math.min(section.total || 0, Math.floor(next)));
                      setEditingMock((prev) => {
                        if (!prev) {
                          return prev;
                        }
                        const nextSections = [...(prev.sections || [])];
                        nextSections[index] = {
                          ...nextSections[index],
                          correct: bounded,
                        };
                        return { ...prev, sections: nextSections };
                      });
                    }}
                    className="w-28 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
                  />
                  <span className="text-xs text-slate-500">out of {section.total}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setEditingMock(null)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMock}
              disabled={saving}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </ModalShell>
      )}

      {quizDetail && (
        <ModalShell title={`Quiz Result: ${quizDetail.quiz?.name || quizDetail.title || 'Untitled'}`} onClose={() => setQuizDetail(null)}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <StatBlock label="User" value={quizDetail.student?.name || quizDetail.student?.email || 'Unknown'} />
            <StatBlock label="Score" value={`${quizDetail.score || 0}/${quizDetail.totalQuestions || 0}`} />
            <StatBlock label="Level" value={quizInsights?.performanceLabel || '-'} />
            <StatBlock label="Answered" value={String(quizInsights?.answeredQuestions || 0)} />
            <StatBlock label="Correct" value={String(quizInsights?.correctAnswers || 0)} />
            <StatBlock label="Incorrect" value={String(quizInsights?.incorrectAnswers || 0)} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
            <InsightCard
              title="Overall Interpretation"
              text={quizInsights?.performanceSummary || 'No interpretation available.'}
              tone={quizInsights && quizInsights.percentage >= 70 ? 'good' : quizInsights && quizInsights.percentage < 50 ? 'warn' : 'neutral'}
            />
            <InsightCard
              title="Completion Insight"
              text={
                quizInsights
                  ? `${quizInsights.answeredQuestions} answered and ${quizInsights.unansweredQuestions} unanswered out of ${quizDetail.totalQuestions || 0}.`
                  : 'No completion insight available.'
              }
            />
            <InsightCard
              title="Question Insight"
              text={
                quizInsights
                  ? `${quizInsights.wrongAnswers.length} question(s) were answered incorrectly. Review those first to improve this attempt.`
                  : 'No question insight available.'
              }
              tone={quizInsights?.wrongAnswers.length ? 'warn' : 'neutral'}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatBlock label="Fullscreen Violations" value={String(quizDetail.fullScreenViolations || 0)} />
            <StatBlock label="Visibility Changes" value={String(quizDetail.visibilityChanged || 0)} />
            <StatBlock label="Submitted Automatically" value={quizDetail.submittedAutomatically ? 'Yes' : 'No'} />
            <StatBlock label="Time Left" value={`${quizDetail.timeLeft || 0}s`} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <InsightCard
              title="Proctoring Signal"
              text={
                quizInsights
                  ? quizInsights.flaggedByProctoring > 0
                    ? `${quizInsights.flaggedByProctoring} proctoring event(s) detected from fullscreen and visibility changes.`
                    : 'No proctoring issues were detected in this attempt.'
                  : 'No proctoring insight available.'
              }
              tone={quizInsights && quizInsights.flaggedByProctoring > 0 ? 'warn' : 'good'}
            />
            <InsightCard
              title="Accuracy"
              text={
                quizInsights
                  ? `${quizInsights.correctAnswers} correct out of ${quizDetail.totalQuestions || 0} total questions gives ${quizInsights.percentage}% overall accuracy.`
                  : 'No accuracy insight available.'
              }
            />
          </div>

          {!!quizDetail.answers?.length && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-slate-900">Answer Snapshot</h4>
              <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Question</th>
                      <th className="px-3 py-2 text-left">Your Answer</th>
                      <th className="px-3 py-2 text-left">Correct Answer</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {quizDetail.answers.slice(0, 10).map((answer, index) => (
                      <tr key={`${answer.question || 'q'}-${index}`}>
                        <td className="px-3 py-2 text-slate-700">{answer.question || '-'}</td>
                        <td className="px-3 py-2 text-slate-700">{answer.userAnswer || '-'}</td>
                        <td className="px-3 py-2 text-slate-700">{answer.correctAnswer || '-'}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              answer.isCorrect
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                            }`}
                          >
                            {answer.isCorrect ? 'Correct' : 'Wrong'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!!quizInsights?.wrongAnswers.length && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-slate-900">Priority Review Questions</h4>
              <div className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                {quizInsights.wrongAnswers.slice(0, 5).map((answer, index) => (
                  <div key={`${answer.question || 'wrong'}-${index}`} className="rounded-md bg-white p-3 ring-1 ring-slate-200">
                    <p className="text-sm font-medium text-slate-900">{answer.question || 'Question text unavailable'}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Marked: {answer.userAnswer || '-'} | Correct: {answer.correctAnswer || '-'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ModalShell>
      )}

      {editingQuiz && (
        <ModalShell title={`Edit Quiz Result: ${editingQuiz.quiz?.name || editingQuiz.title || 'Untitled'}`} onClose={() => setEditingQuiz(null)}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Score
              <input
                type="number"
                min={0}
                value={editingQuiz.score || 0}
                onChange={(event) =>
                  setEditingQuiz((prev) =>
                    prev
                      ? {
                          ...prev,
                          score: Math.max(0, Math.floor(Number(event.target.value || 0))),
                        }
                      : prev
                  )
                }
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Total Questions
              <input
                type="number"
                min={0}
                value={editingQuiz.totalQuestions || 0}
                onChange={(event) =>
                  setEditingQuiz((prev) =>
                    prev
                      ? {
                          ...prev,
                          totalQuestions: Math.max(0, Math.floor(Number(event.target.value || 0))),
                        }
                      : prev
                  )
                }
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Correct Answers
              <input
                type="number"
                min={0}
                value={editingQuiz.correctAnswers || 0}
                onChange={(event) =>
                  setEditingQuiz((prev) =>
                    prev
                      ? {
                          ...prev,
                          correctAnswers: Math.max(0, Math.floor(Number(event.target.value || 0))),
                        }
                      : prev
                  )
                }
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Incorrect Answers
              <input
                type="number"
                min={0}
                value={editingQuiz.incorrectAnswers || 0}
                onChange={(event) =>
                  setEditingQuiz((prev) =>
                    prev
                      ? {
                          ...prev,
                          incorrectAnswers: Math.max(0, Math.floor(Number(event.target.value || 0))),
                        }
                      : prev
                  )
                }
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setEditingQuiz(null)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveQuiz}
              disabled={saving}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </ModalShell>
      )}

      {deleteIntent && (
        <ModalShell title={deleteIntent.kind === 'attempt' ? 'Delete Attempt' : 'Delete Result'} onClose={() => setDeleteIntent(null)}>
          <p className="text-sm text-slate-600">
            Delete {deleteIntent.kind === 'attempt' ? 'attempt' : 'result'} for{' '}
            <span className="font-medium text-slate-900">{deleteIntent.label}</span>? This action cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setDeleteIntent(null)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Delete Result'}
            </button>
          </div>
        </ModalShell>
      )}

      {bulkDeleteIntent && (
        <ModalShell title={bulkDeleteIntent.kind === 'attempt' ? 'Bulk Delete Attempts' : 'Bulk Delete Results'} onClose={() => setBulkDeleteIntent(null)}>
          <p className="text-sm text-slate-600">
            Delete <span className="font-medium text-slate-900">{bulkDeleteIntent.label}</span>? This action cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setBulkDeleteIntent(null)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={saving}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
