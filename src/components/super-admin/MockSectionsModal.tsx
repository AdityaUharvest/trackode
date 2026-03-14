'use client';

import { useMemo, useState } from 'react';
import type { MockItem } from './types';

type MockSectionsModalProps = {
  mock: MockItem;
  allMocks: MockItem[];
  busy?: boolean;
  onClose: () => void;
  onRemoveSection: (sectionName: string) => Promise<void>;
  onImportSection: (sourceMockId: string, sourceSection: string, replaceExisting: boolean) => Promise<void>;
};

export function MockSectionsModal({
  mock,
  allMocks,
  busy,
  onClose,
  onRemoveSection,
  onImportSection,
}: MockSectionsModalProps) {
  const [sourceMockId, setSourceMockId] = useState('');
  const [sourceSection, setSourceSection] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);

  const sourceOptions = useMemo(
    () => allMocks.filter((item) => item._id !== mock._id && (item.sections?.length ?? 0) > 0),
    [allMocks, mock._id]
  );

  const selectedSource = useMemo(
    () => sourceOptions.find((item) => item._id === sourceMockId) ?? null,
    [sourceOptions, sourceMockId]
  );

  const sourceSections = selectedSource?.sections ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Manage Sections</h3>
            <p className="mt-1 text-sm text-slate-500">Remove existing sections or import sections from another mock.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Current sections in {mock.title}</h4>
            <div className="mt-3 max-h-64 space-y-2 overflow-auto rounded-lg border border-slate-200 p-3">
              {(mock.sections ?? []).length === 0 && (
                <p className="text-sm text-slate-500">No sections available in this mock.</p>
              )}

              {(mock.sections ?? []).map((section) => (
                <div key={section.name} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{section.name}</p>
                    <p className="text-xs text-slate-500">{section.count} questions</p>
                  </div>
                  <button
                    onClick={() => onRemoveSection(section.name)}
                    disabled={busy}
                    className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Import section from another mock</h4>
            <div className="mt-3 space-y-3 rounded-lg border border-slate-200 p-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.08em] text-slate-500">Source mock</label>
                <select
                  value={sourceMockId}
                  onChange={(event) => {
                    setSourceMockId(event.target.value);
                    setSourceSection('');
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="">Select source mock</option>
                  {sourceOptions.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.08em] text-slate-500">Source section</label>
                <select
                  value={sourceSection}
                  onChange={(event) => setSourceSection(event.target.value)}
                  disabled={!selectedSource}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 disabled:bg-slate-50"
                >
                  <option value="">Select section</option>
                  {sourceSections.map((section) => (
                    <option key={section.name} value={section.name}>
                      {section.name} ({section.count})
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(event) => setReplaceExisting(event.target.checked)}
                />
                Replace section if it already exists
              </label>

              <button
                onClick={() => onImportSection(sourceMockId, sourceSection, replaceExisting)}
                disabled={busy || !sourceMockId || !sourceSection}
                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Import section
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
