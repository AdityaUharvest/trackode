'use client';

import { useMemo, useState, type ReactNode } from 'react';
import type { MockResultItem, QuizResultItem } from './types';
import { ResultsCard } from './ui';

type ResultsTabProps = {
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

type DeleteIntent = {
  kind: 'mock' | 'quiz';
  id: string;
  label: string;
};

type BulkDeleteIntent = {
  kind: 'mock' | 'quiz';
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
      <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-xl">
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

export function ResultsTab({ mockResults, quizResults, onDataChanged, onToast }: ResultsTabProps) {
  const [activeKind, setActiveKind] = useState<'mock' | 'quiz'>('mock');
  const [query, setQuery] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteIntent, setDeleteIntent] = useState<DeleteIntent | null>(null);
  const [bulkDeleteIntent, setBulkDeleteIntent] = useState<BulkDeleteIntent | null>(null);
  const [selectedMockIds, setSelectedMockIds] = useState<string[]>([]);
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);

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
  const visibleQuizIds = filteredQuizResults.map((result) => result._id);

  const allVisibleMockSelected =
    visibleMockIds.length > 0 && visibleMockIds.every((id) => selectedMockIds.includes(id));
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
          : `/api/admin/results/quiz/${deleteIntent.id}`;

      const response = await fetch(endpoint, { method: 'DELETE' });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete result');
      }

      setDeleteIntent(null);
      if (deleteIntent.kind === 'mock') {
        setSelectedMockIds((prev) => prev.filter((id) => id !== deleteIntent.id));
      } else {
        setSelectedQuizIds((prev) => prev.filter((id) => id !== deleteIntent.id));
      }
      await onDataChanged();
      onToast('Result deleted', 'success');
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
          : '/api/admin/results/quiz/bulk';

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
      } else {
        setSelectedQuizIds([]);
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
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
              : `${selectedQuizIds.length} quiz result(s) selected`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (activeKind === 'mock') {
                  setSelectedMockIds([]);
                } else {
                  setSelectedQuizIds([]);
                }
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear Selection
            </button>
            <button
              disabled={activeKind === 'mock' ? selectedMockIds.length === 0 : selectedQuizIds.length === 0}
              onClick={() =>
                setBulkDeleteIntent({
                  kind: activeKind,
                  ids: activeKind === 'mock' ? selectedMockIds : selectedQuizIds,
                  label:
                    activeKind === 'mock'
                      ? `${selectedMockIds.length} mock result(s)`
                      : `${selectedQuizIds.length} quiz result(s)`,
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatBlock label="User" value={mockDetail.userId?.name || mockDetail.userId?.email || 'Unknown'} />
            <StatBlock
              label="Score"
              value={`${mockDetail.totalScore || 0}/${mockDetail.totalQuestions || 0} (${Math.round(
                mockDetail.percentage || 0
              )}%)`}
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Section</th>
                  <th className="px-3 py-2 text-left">Correct</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(mockDetail.sections || []).map((section) => (
                  <tr key={section.sectionName}>
                    <td className="px-3 py-2 font-medium text-slate-900">{section.sectionName}</td>
                    <td className="px-3 py-2 text-slate-700">{section.correct}</td>
                    <td className="px-3 py-2 text-slate-700">{section.total}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {section.total > 0 ? Math.round((section.correct / section.total) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatBlock label="User" value={quizDetail.student?.name || quizDetail.student?.email || 'Unknown'} />
            <StatBlock label="Score" value={`${quizDetail.score || 0}/${quizDetail.totalQuestions || 0}`} />
            <StatBlock label="Correct Answers" value={String(quizDetail.correctAnswers || 0)} />
            <StatBlock label="Incorrect Answers" value={String(quizDetail.incorrectAnswers || 0)} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatBlock label="Fullscreen Violations" value={String(quizDetail.fullScreenViolations || 0)} />
            <StatBlock label="Visibility Changes" value={String(quizDetail.visibilityChanged || 0)} />
            <StatBlock label="Submitted Automatically" value={quizDetail.submittedAutomatically ? 'Yes' : 'No'} />
            <StatBlock label="Time Left" value={`${quizDetail.timeLeft || 0}s`} />
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
        <ModalShell title="Delete Result" onClose={() => setDeleteIntent(null)}>
          <p className="text-sm text-slate-600">
            Delete result for <span className="font-medium text-slate-900">{deleteIntent.label}</span>? This action cannot be undone.
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
        <ModalShell title="Bulk Delete Results" onClose={() => setBulkDeleteIntent(null)}>
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
