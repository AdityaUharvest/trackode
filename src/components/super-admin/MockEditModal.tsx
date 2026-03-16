'use client';

import type { MockDraft, MockItem } from './types';

type MockEditModalProps = {
  mock: MockItem;
  draft: MockDraft;
  busy?: boolean;
  onDraftChange: (patch: Partial<MockDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function MockEditModal({
  mock,
  draft,
  busy,
  onDraftChange,
  onSave,
  onCancel,
}: MockEditModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Edit Mock</h3>
            <p className="mt-1 text-sm text-slate-500">Update title, difficulty and visibility for {mock.title}.</p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              value={draft.title}
              onChange={(event) => onDraftChange({ title: event.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
              placeholder="Enter mock title"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Difficulty</label>
              <select
                value={draft.difficulty}
                onChange={(event) => onDraftChange({ difficulty: event.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Visibility</label>
              <label className="flex h-[42px] items-center gap-2 rounded-md border border-slate-300 px-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={draft.isPublic}
                  onChange={(event) => onDraftChange({ isPublic: event.target.checked })}
                />
                Show this mock publicly
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email Settings</label>
            <label className="flex h-[42px] items-center gap-2 rounded-md border border-slate-300 px-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={draft.autoSendResults}
                onChange={(event) => onDraftChange({ autoSendResults: event.target.checked })}
              />
              Automatically email results to players
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={busy}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}