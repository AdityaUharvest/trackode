'use client';

import { useCallback, useRef, useState } from 'react';
import type { Toast, ToastType } from './types';

// ── Hook ───────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const push = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return { toasts, push };
}

// ── Renderer ───────────────────────────────────────────────────
export function ToastStack({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            t.type === 'success'
              ? 'border-emerald-200 bg-white text-emerald-700'
              : t.type === 'error'
              ? 'border-red-200 bg-white text-red-700'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
