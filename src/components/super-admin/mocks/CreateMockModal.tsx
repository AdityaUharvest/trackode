type CreateMockModalProps = {
  open: boolean;
  title: string;
  duration: number;
  isPublic: boolean;
  creating: boolean;
  onTitleChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onPublicChange: (value: boolean) => void;
  onClose: () => void;
  onCreate: () => void;
};

export function CreateMockModal({
  open,
  title,
  duration,
  isPublic,
  creating,
  onTitleChange,
  onDurationChange,
  onPublicChange,
  onClose,
  onCreate,
}: CreateMockModalProps) {
  if (!open) {
    return null;
  }

  return (
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
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
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
              value={duration}
              onChange={(event) => onDurationChange(Math.max(10, Math.min(300, Number(event.target.value || 60))))}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => onPublicChange(event.target.checked)}
            />
            Make this mock public
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={creating}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Create Mock'}
          </button>
        </div>
      </div>
    </div>
  );
}
