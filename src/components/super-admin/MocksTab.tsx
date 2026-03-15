'use client';

import { useEffect, useRef, useState } from 'react';
import { MockActionsMenu } from './MockActionsMenu';
import { MockEditModal } from './MockEditModal';
import { MockSectionsModal } from './MockSectionsModal';
import { CreateMockModal } from './mocks/CreateMockModal';
import { MockResultsModal } from './mocks/MockResultsModal';
import type { MockAttempt, ResultsPagination, ResultsSummary } from './mocks/types';
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
  const PAGE_SIZE = 25;
  type MockResultsPayload = {
    quizTitle?: string;
    attempts?: MockAttempt[];
    summary?: Partial<ResultsSummary>;
    pagination?: ResultsPagination;
  };

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsMockTitle, setResultsMockTitle] = useState('');
  const [resultsMockId, setResultsMockId] = useState('');
  const [resultsSearch, setResultsSearch] = useState('');
  const [debouncedResultsSearch, setDebouncedResultsSearch] = useState('');
  const [mockPage, setMockPage] = useState(1);
  const [resultsData, setResultsData] = useState<MockAttempt[]>([]);
  const [resultsSummary, setResultsSummary] = useState<ResultsSummary>({
    participants: 0,
    avgAccuracy: 0,
    avgAnswered: 0,
    totalQuestions: 0,
    completions: 0,
  });
  const [resultsPagination, setResultsPagination] = useState<ResultsPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedAttempt, setSelectedAttempt] = useState<MockAttempt | null>(null);
  const [mailSendingByAttempt, setMailSendingByAttempt] = useState<Record<string, boolean>>({});
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedResultsSearch(resultsSearch.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [resultsSearch]);

  const filtered = (search
    ? mocks.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          (m.sections ?? []).some((s) =>
            s.name.toLowerCase().includes(search.toLowerCase())
          )
      )
    : mocks
  ).slice().sort((a, b) => {
    const attemptDiff = (b.attempts ?? 0) - (a.attempts ?? 0);
    if (attemptDiff !== 0) {
      return attemptDiff;
    }
    return (a.title || '').localeCompare(b.title || '');
  });

  const totalMockPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedMocks = filtered.slice((mockPage - 1) * PAGE_SIZE, mockPage * PAGE_SIZE);

  useEffect(() => {
    setMockPage(1);
  }, [search]);

  useEffect(() => {
    if (mockPage > totalMockPages) {
      setMockPage(totalMockPages);
    }
  }, [mockPage, totalMockPages]);

  useEffect(() => {
    if (!showResultsModal || !resultsMockId) {
      return;
    }

    const selectedMock = mocks.find((m) => m._id === resultsMockId);
    if (!selectedMock) {
      return;
    }

    void handleOpenMockResults(selectedMock, 1, debouncedResultsSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedResultsSearch, showResultsModal, resultsMockId]);

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

  const handleOpenMockResults = async (mock: MockItem, page = 1, searchTerm = resultsSearch) => {
    setResultsMockTitle(mock.title || 'Mock');
    setResultsMockId(mock._id);
    setShowResultsModal(true);
    setResultsLoading(true);
    setResultsData([]);
    setResultsSummary({ participants: 0, avgAccuracy: 0, avgAnswered: 0, totalQuestions: 0, completions: 0 });
    setSelectedAttempt(null);

    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: '20',
      });
      if (searchTerm.trim()) {
        query.set('q', searchTerm.trim());
      }

      const response = await fetch(`/api/mock-tests/${mock._id}/results?${query.toString()}`, { cache: 'no-store' });
      const payload = (await response.json()) as MockResultsPayload;

      if (!response.ok) {
        throw new Error('Failed to load individual mock results');
      }

      setResultsMockTitle(payload.quizTitle || mock.title || 'Mock');
      setResultsData(Array.isArray(payload.attempts) ? payload.attempts : []);
      setResultsSummary({
        participants: payload.summary?.participants ?? payload.pagination?.total ?? 0,
        avgAccuracy: payload.summary?.avgAccuracy ?? 0,
        avgAnswered: payload.summary?.avgAnswered ?? 0,
        totalQuestions: payload.summary?.totalQuestions ?? 0,
        completions: payload.summary?.completions ?? 0,
      });
      setResultsPagination({
        page: payload.pagination?.page ?? page,
        limit: payload.pagination?.limit ?? 20,
        total: payload.pagination?.total ?? 0,
        totalPages: payload.pagination?.totalPages ?? 1,
        hasNextPage: Boolean(payload.pagination?.hasNextPage),
        hasPrevPage: Boolean(payload.pagination?.hasPrevPage),
      });
    } catch (cause) {
      setResultsData([]);
      setResultsSummary({ participants: 0, avgAccuracy: 0, avgAnswered: 0, totalQuestions: 0, completions: 0 });
      setResultsPagination({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
      onToast(cause instanceof Error ? cause.message : 'Could not load mock results', 'error');
    } finally {
      setResultsLoading(false);
    }
  };

  const handleSendCertificateMail = async (attempt: MockAttempt) => {
    if (!resultsMockId) {
      onToast('Mock context is missing', 'error');
      return;
    }
    if (!attempt._id) {
      onToast('Attempt id is missing', 'error');
      return;
    }
    if (!attempt.email) {
      onToast('Participant email is not available', 'error');
      return;
    }

    setMailSendingByAttempt((prev) => ({ ...prev, [attempt._id]: true }));
    try {
      const response = await fetch(`/api/admin/mocks/${resultsMockId}/certificate-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attempt._id }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to send certificate email');
      }
      onToast(payload?.message || 'Certificate email sent successfully', 'success');
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not send certificate email', 'error');
    } finally {
      setMailSendingByAttempt((prev) => ({ ...prev, [attempt._id]: false }));
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

      <CreateMockModal
        open={showCreateModal}
        title={newMockTitle}
        duration={newMockDuration}
        isPublic={newMockPublic}
        creating={creating}
        onTitleChange={setNewMockTitle}
        onDurationChange={setNewMockDuration}
        onPublicChange={setNewMockPublic}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateMock}
      />

      <MockResultsModal
        open={showResultsModal}
        title={resultsMockTitle}
        loading={resultsLoading}
        search={resultsSearch}
        setSearch={setResultsSearch}
        data={resultsData}
        summary={resultsSummary}
        pagination={resultsPagination}
        selectedAttempt={selectedAttempt}
        mailSendingByAttempt={mailSendingByAttempt}
        onClose={() => setShowResultsModal(false)}
        onSelectAttempt={setSelectedAttempt}
        onLoadPage={(page, searchTerm) => {
          const selectedMock = mocks.find((m) => m._id === resultsMockId);
          if (!selectedMock) return;
          handleOpenMockResults(selectedMock, page, searchTerm);
        }}
        onSendCertificateMail={handleSendCertificateMail}
      />
      <div className="flex items-center justify-between gap-3">
        <input
          className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          placeholder="Search by title or section..."
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
            {paginatedMocks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  No mocks found
                </td>
              </tr>
            )}
            {paginatedMocks.map((mock) => {
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
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          setResultsSearch('');
                          handleOpenMockResults(mock, 1, '');
                        }}
                        disabled={busy}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Results
                      </button>

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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <p className="text-xs text-slate-500">
          Page {mockPage} of {totalMockPages} - Showing {paginatedMocks.length} of {filtered.length} mock(s)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMockPage((prev) => Math.max(1, prev - 1))}
            disabled={mockPage <= 1}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setMockPage((prev) => Math.min(totalMockPages, prev + 1))}
            disabled={mockPage >= totalMockPages}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

