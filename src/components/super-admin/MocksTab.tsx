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
}: MocksTabProps) {
  const [search, setSearch] = useState('');
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

      <div className="flex items-center justify-between gap-3">
        <input
          className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          placeholder="Search by title or section…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-slate-500">{filtered.length} mocks</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
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
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
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
