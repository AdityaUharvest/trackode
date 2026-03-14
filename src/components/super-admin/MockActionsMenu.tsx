'use client';

import Link from 'next/link';
import type { MockItem } from './types';

type MockActionsMenuProps = {
  mock: MockItem;
  busy?: boolean;
  onClose: () => void;
  onEdit: () => void;
  onShare: () => void;
  onManageSections: () => void;
  onViewResults: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
};

export function MockActionsMenu({
  mock,
  busy,
  onClose,
  onEdit,
  onShare,
  onManageSections,
  onViewResults,
  onTogglePublish,
  onDelete,
}: MockActionsMenuProps) {
  return (
    <div className="absolute right-0 top-11 z-30 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
      <button
        onClick={onEdit}
        disabled={busy}
        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Edit mock
      </button>
      <button
        onClick={onManageSections}
        disabled={busy}
        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Manage sections
      </button>
      <button
        onClick={onShare}
        disabled={busy}
        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Copy share link
      </button>
      <button
        onClick={onTogglePublish}
        disabled={busy}
        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mock.isPublished ? 'Unpublish mock' : 'Publish mock'}
      </button>
      <Link
        href={`/mock-tests/${mock._id}/questions`}
        onClick={onClose}
        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        View questions
      </Link>
      <button
        onClick={onViewResults}
        disabled={busy}
        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Individual mock results
      </button>
      <div className="my-1 border-t border-slate-200" />
      <button
        onClick={onDelete}
        disabled={busy}
        className="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete mock
      </button>
    </div>
  );
}