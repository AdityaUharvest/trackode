'use client';

import { useEffect, useRef, useState } from 'react';
import { MockActionsMenu } from './MockActionsMenu';
import { MockEditModal } from './MockEditModal';
import { MockSectionsModal } from './MockSectionsModal';
import type { MockDraft, MockItem } from './types';
import { DiffBadge, SectionPills } from './ui';

type MocksTabProps = {
  mocks: MockItem[];
  busyMocks: Record<string, boolean>;
  editingMockId: string;
  mockDrafts: Record<string, MockDraft>;
  onPublishToggle: (mockId: string, current: boolean) => void;
  onConfirmDelete: (mock: MockItem) => void;
  onBeginEdit: (mock: MockItem) => void;
  onManageSections: (mock: MockItem) => void;
  onSaveEdit: (mockId: string) => void;
  onCancelEdit: () => void;
  onDraftChange: (mockId: string, patch: Partial<MockDraft>) => void;
  managingSectionsMock: MockItem | null;
  sectionsBusy: boolean;
  onCloseSections: () => void;
  onRemoveSection: (sectionName: string) => Promise<void>;
  onImportSection: (sourceMockId: string, sourceSection: string, replaceExisting: boolean) => Promise<void>;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onDataChanged: () => Promise<void>;
};

export function MocksTab({
  mocks,
  busyMocks,
  editingMockId,
  mockDrafts,
  onPublishToggle,
  onConfirmDelete,
  onBeginEdit,
  onManageSections,
  onSaveEdit,
  onCancelEdit,
  onDraftChange,
  managingSectionsMock,
  sectionsBusy,
  onCloseSections,
  onRemoveSection,
  onImportSection,
  onToast,
  onDataChanged,
}: MocksTabProps) {
  type MockAttemptSection = {
    sectionName: string;
    answered: number;
    correct: number;
    totalQuestions: number;
  };

  type MockAttempt = {
    _id: string;
    userName?: string;
    email?: string;
    completedAt?: string;
    totalAnswered?: number;
    totalCorrect?: number;
    totalQuestions?: number;
    accuracy?: number;
    sectionStats?: MockAttemptSection[];
  };

  type MockResultsPayload = {
    quizTitle?: string;
    attempts?: MockAttempt[];
  };

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsMockTitle, setResultsMockTitle] = useState('');
  const [resultsData, setResultsData] = useState<MockAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<MockAttempt | null>(null);
  const [creating, setCreating] = useState(false);
  const [newMockTitle, setNewMockTitle] = useState('');
  const [newMockDuration, setNewMockDuration] = useState(60);
  const [newMockPublic, setNewMockPublic] = useState(false);
  const [actionMockId, setActionMockId] = useState('');
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const editingMock = mocks.find((mock) => mock._id === editingMockId) ?? null;
  const activeDraft = editingMockId ? mockDrafts[editingMockId] : undefined;
  const actionMock = mocks.find((mock) => mock._id === actionMockId) ?? null;

  useEffect(() => {
    if (!actionMockId) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!actionMenuRef.current?.contains(event.target as Node)) {
        setActionMockId('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActionMockId('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [actionMockId]);

  const filtered = search
    ? mocks.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          (m.sections ?? []).some((s) =>
            s.name.toLowerCase().includes(search.toLowerCase())
          )
      )
    : mocks;

  const handleShareMock = async (mock: MockItem) => {
    if (!mock.shareCode) {
      onToast('Share code is not available for this mock', 'error');
      return;
    }

    const shareLink = `${window.location.origin}/playy/${mock.shareCode}`;

    try {
      await navigator.clipboard.writeText(shareLink);
      onToast('Mock share link copied', 'success');
    } catch {
      onToast('Could not copy share link. Please copy manually from row code.', 'error');
    }
  };

  const handleCreateMock = async () => {
    if (!newMockTitle.trim()) {
      onToast('Enter a mock title', 'error');
      return;
    }

    setCreating(true);
    try {
      const now = new Date();
      const end = new Date(now.getTime() + newMockDuration * 60 * 1000);

      const response = await fetch('/api/mock-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newMockTitle.trim(),
          description: '',
          startTime: now.toISOString(),
          endTime: end.toISOString(),
          durationMinutes: newMockDuration,
          public: newMockPublic,
          tag: 'TCS',
          creator: 'Super Admin',
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to create mock');
      }

      setNewMockTitle('');
      setNewMockDuration(60);
      setNewMockPublic(false);
      setShowCreateModal(false);
      await onDataChanged();
      onToast('Mock created successfully', 'success');
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not create mock', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenMockResults = async (mock: MockItem) => {
    setResultsMockTitle(mock.title || 'Mock');
    setShowResultsModal(true);
    setResultsLoading(true);
    setResultsData([]);
    setSelectedAttempt(null);

    try {
      const response = await fetch(`/api/mock-tests/${mock._id}/results`, { cache: 'no-store' });
      const payload = (await response.json()) as MockResultsPayload;

      if (!response.ok) {
        throw new Error('Failed to load individual mock results');
      }

      setResultsMockTitle(payload.quizTitle || mock.title || 'Mock');
      setResultsData(Array.isArray(payload.attempts) ? payload.attempts : []);
    } catch (cause) {
      setResultsData([]);
      onToast(cause instanceof Error ? cause.message : 'Could not load mock results', 'error');
    } finally {
      setResultsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {managingSectionsMock && (
        <MockSectionsModal
          mock={managingSectionsMock}
          allMocks={mocks}
          busy={sectionsBusy}
          onClose={onCloseSections}
          onRemoveSection={onRemoveSection}
          onImportSection={onImportSection}
        />
      )}

      {editingMock && activeDraft && (
        <MockEditModal
          mock={editingMock}
          draft={activeDraft}
          busy={Boolean(busyMocks[editingMock._id])}
          onDraftChange={(patch) => onDraftChange(editingMock._id, patch)}
          onSave={() => onSaveEdit(editingMock._id)}
          onCancel={onCancelEdit}
        />
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-slate-900">Create Mock</h3>
            <p className="mt-1 text-sm text-slate-500">Fill basic details and create a new mock.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  Title
                </label>
                <input
                  value={newMockTitle}
                  onChange={(event) => setNewMockTitle(event.target.value)}
                  placeholder="Mock title"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={newMockDuration}
                  onChange={(event) => setNewMockDuration(Math.max(10, Math.min(300, Number(event.target.value || 60))))}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={newMockPublic}
                  onChange={(event) => setNewMockPublic(event.target.checked)}
                />
                Make this mock public
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMock}
                disabled={creating}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Creating...' : 'Create Mock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Individual Mock Results</h3>
                <p className="mt-0.5 text-sm text-slate-500">{resultsMockTitle}</p>
              </div>
              <button
                onClick={() => { setShowResultsModal(false); setSelectedAttempt(null); }}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {/* Summary stats */}
              {!resultsLoading && resultsData.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Participants', value: String(resultsData.length) },
                    {
                      label: 'Avg Accuracy',
                      value: `${Math.round(resultsData.reduce((s, a) => s + (a.accuracy || 0), 0) / resultsData.length)}%`,
                    },
                    {
                      label: 'Avg Answered',
                      value: `${Math.round(resultsData.reduce((s, a) => s + (a.totalAnswered || 0), 0) / resultsData.length)} / ${resultsData[0]?.totalQuestions ?? 0}`,
                    },
                    {
                      label: 'Completions',
                      value: String(resultsData.filter((a) => a.completedAt).length),
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Attempt detail drill-down */}
              {selectedAttempt && (() => {
                const sections = (selectedAttempt.sectionStats || []).map((s) => ({
                  ...s,
                  unanswered: Math.max(0, s.totalQuestions - s.answered),
                  accuracy: s.totalQuestions > 0 ? Math.round((s.correct / s.totalQuestions) * 100) : 0,
                }));
                const pct = selectedAttempt.accuracy || 0;
                const perfLabel = pct >= 85 ? 'Excellent' : pct >= 70 ? 'Strong' : pct >= 50 ? 'Average' : 'Needs Improvement';
                const perfSummary = pct >= 85 ? 'Very strong outcome with consistently high accuracy.' : pct >= 70 ? 'Good performance with a solid grasp of most areas.' : pct >= 50 ? 'Mixed performance. There are clear strengths, but also gaps to improve.' : 'Low accuracy overall. Review weak sections and wrong answers first.';
                const strongest = [...sections].sort((a, b) => b.accuracy - a.accuracy)[0] || null;
                const weakest = [...sections].sort((a, b) => a.accuracy - b.accuracy)[0] || null;
                const lowSections = sections.filter((s) => s.accuracy < 50);
                const tone = (t: number) => t >= 70 ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : t < 50 ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-900';

                return (
                  <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{selectedAttempt.userName || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{selectedAttempt.email || '-'}</p>
                      </div>
                      <button
                        onClick={() => setSelectedAttempt(null)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        ← Back to list
                      </button>
                    </div>

                    {/* 6-stat grid */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                      {[
                        { label: 'Score', value: `${selectedAttempt.totalCorrect ?? 0}/${selectedAttempt.totalQuestions ?? 0} (${pct}%)` },
                        { label: 'Level', value: perfLabel },
                        { label: 'Answered', value: String(selectedAttempt.totalAnswered ?? 0) },
                        { label: 'Unanswered', value: String(Math.max(0, (selectedAttempt.totalQuestions || 0) - (selectedAttempt.totalAnswered || 0))) },
                        { label: 'Incorrect', value: String(Math.max(0, (selectedAttempt.totalAnswered || 0) - (selectedAttempt.totalCorrect || 0))) },
                        { label: 'Sections', value: String(sections.length) },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-lg border border-slate-200 bg-white p-3">
                          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
                          <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Insight cards */}
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className={`rounded-lg border p-3 ${tone(pct)}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Overall Interpretation</p>
                        <p className="mt-1 text-sm leading-6">{perfSummary}</p>
                      </div>
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Strongest Section</p>
                        <p className="mt-1 text-sm leading-6">
                          {strongest ? `${strongest.sectionName} at ${strongest.accuracy}% accuracy.` : 'No data available.'}
                        </p>
                      </div>
                      <div className={`rounded-lg border p-3 ${lowSections.length ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Needs Attention</p>
                        <p className="mt-1 text-sm leading-6">
                          {lowSections.length
                            ? `${lowSections.length} section(s) below 50% accuracy: ${lowSections.slice(0, 2).map((s) => s.sectionName).join(', ')}.`
                            : 'No section is below 50% accuracy.'}
                        </p>
                      </div>
                    </div>

                    {/* Section breakdown table */}
                    {sections.length > 0 && (
                      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
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
                            {sections.map((s) => (
                              <tr key={s.sectionName} className="hover:bg-slate-50">
                                <td className="px-3 py-2 font-medium text-slate-900">{s.sectionName}</td>
                                <td className="px-3 py-2 text-slate-700">{s.correct}</td>
                                <td className="px-3 py-2 text-slate-700">{s.answered}</td>
                                <td className="px-3 py-2 text-slate-700">{s.unanswered}</td>
                                <td className="px-3 py-2 text-slate-700">{s.totalQuestions}</td>
                                <td className="px-3 py-2">
                                  <span className={`font-medium ${s.accuracy >= 70 ? 'text-emerald-700' : s.accuracy < 50 ? 'text-amber-700' : 'text-slate-700'}`}>
                                    {s.accuracy}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Bottom insight row */}
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-900">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Completion Insight</p>
                        <p className="mt-1 text-sm leading-6">
                          {selectedAttempt.totalAnswered ?? 0} of {selectedAttempt.totalQuestions ?? 0} questions answered, leaving {Math.max(0, (selectedAttempt.totalQuestions || 0) - (selectedAttempt.totalAnswered || 0))} unanswered.
                        </p>
                      </div>
                      <div className={`rounded-lg border p-3 ${weakest && weakest.accuracy < 50 ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Weakest Section</p>
                        <p className="mt-1 text-sm leading-6">
                          {weakest ? `${weakest.sectionName} is lowest at ${weakest.accuracy}% accuracy.` : 'No section data available.'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Attempts table */}
              {!selectedAttempt && (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      <tr>
                        <th className="px-3 py-2">User</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Answered</th>
                        <th className="px-3 py-2">Score</th>
                        <th className="px-3 py-2">Accuracy</th>
                        <th className="px-3 py-2">Completed At</th>
                        <th className="px-3 py-2 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {resultsLoading && (
                        <tr>
                          <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">
                            Loading individual results...
                          </td>
                        </tr>
                      )}
                      {!resultsLoading && resultsData.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-400">
                            No attempts found for this mock.
                          </td>
                        </tr>
                      )}
                      {!resultsLoading &&
                        resultsData.map((attempt) => (
                          <tr key={attempt._id} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-medium text-slate-900">{attempt.userName || 'Unknown'}</td>
                            <td className="px-3 py-2 text-xs text-slate-500">{attempt.email || '-'}</td>
                            <td className="px-3 py-2 text-slate-700">
                              {attempt.totalAnswered ?? 0}/{attempt.totalQuestions ?? 0}
                            </td>
                            <td className="px-3 py-2 text-slate-700">
                              {attempt.totalCorrect ?? 0}/{attempt.totalQuestions ?? 0}
                            </td>
                            <td className="px-3 py-2">
                              <span className={`font-medium ${(attempt.accuracy || 0) >= 70 ? 'text-emerald-700' : (attempt.accuracy || 0) < 50 ? 'text-amber-700' : 'text-slate-700'}`}>
                                {attempt.accuracy ?? 0}%
                              </span>
                            </td>
                            <td className="px-3 py-2 text-xs text-slate-500">
                              {attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : '-'}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => setSelectedAttempt(attempt)}
                                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <input
          className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          placeholder="Search by title or section…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{filtered.length} mocks</span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            Create Mock
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Time Details</th>
              <th className="px-4 py-3">Sections & Questions</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Attempts</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  No mocks found
                </td>
              </tr>
            )}
            {filtered.map((mock) => {
              const busy = Boolean(busyMocks[mock._id]);

              return (
                <tr
                  key={mock._id}
                  className={`transition hover:bg-slate-50 ${busy ? 'pointer-events-none opacity-60' : ''}`}
                >
                  {/* Title */}
                  <td className="px-4 py-3 align-top">
                    <div className="max-w-[220px]">
                      <p className="line-clamp-2 font-medium text-slate-900">{mock.title}</p>
                      {mock.shareCode && (
                        <p className="mt-1 font-mono text-xs text-slate-400">{mock.shareCode}</p>
                      )}
                    </div>
                  </td>

                  {/* Time Details */}
                  <td className="px-4 py-3 align-top">
                    <span className="text-sm font-medium text-slate-700">
                      {mock.durationMinutes ? `${mock.durationMinutes} min` : '-'}
                    </span>
                  </td>

                  {/* Sections */}
                  <td className="px-4 py-3">
                    <SectionPills sections={mock.sections} />
                    {(mock.questionCount ?? 0) > 0 && (
                      <p className="mt-1 text-xs text-slate-400">
                        {mock.questionCount} total question{mock.questionCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </td>

                  {/* Difficulty */}
                  <td className="px-4 py-3 align-top">
                    <DiffBadge d={mock.difficulty} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-block w-fit rounded-md px-2 py-1 text-xs font-medium ${
                          mock.isPublished
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                        }`}
                      >
                        {mock.isPublished ? 'Published' : 'Draft'}
                      </span>
                      
                    </div>
                  </td>

                  {/* Attempts */}
                  <td className="px-4 py-3 align-top text-slate-700">{mock.attempts ?? 0}</td>

                  {/* Actions */}
                  <td className="px-4 py-3 align-top text-right">
                    <div
                      ref={actionMockId === mock._id ? actionMenuRef : null}
                      className="relative inline-block text-left"
                    >
                      <button
                        onClick={() => setActionMockId((current) => (current === mock._id ? '' : mock._id))}
                        disabled={busy}
                        aria-label={`Open actions for ${mock.title}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-base font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        ...
                      </button>

                      {actionMockId === mock._id && (
                        <MockActionsMenu
                          mock={mock}
                          busy={busy}
                          onClose={() => setActionMockId('')}
                          onEdit={() => {
                            setActionMockId('');
                            onBeginEdit(mock);
                          }}
                          onShare={() => {
                            setActionMockId('');
                            handleShareMock(mock);
                          }}
                          onManageSections={() => {
                            setActionMockId('');
                            onManageSections(mock);
                          }}
                          onViewResults={() => {
                            setActionMockId('');
                            handleOpenMockResults(mock);
                          }}
                          onTogglePublish={() => {
                            setActionMockId('');
                            onPublishToggle(mock._id, Boolean(mock.isPublished));
                          }}
                          onDelete={() => {
                            setActionMockId('');
                            onConfirmDelete(mock);
                          }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
