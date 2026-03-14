'use client';

import type { ReactNode } from 'react';
import type { MockSection } from './types';

// ── Reusable action button ──────────────────────────────────────
type BtnVariant = 'green' | 'amber' | 'red' | 'dark' | 'gray';
const COLORS: Record<BtnVariant, string> = {
  green: 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  amber: 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
  red: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  dark: 'border border-slate-300 bg-slate-900 text-white hover:bg-slate-800',
  gray: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
};

export function ActionBtn({
  onClick,
  variant,
  busy,
  children,
}: {
  onClick: () => void;
  variant: BtnVariant;
  busy?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${COLORS[variant]}`}
    >
      {children}
    </button>
  );
}

// ── Status / error banner with optional retry ──────────────────
export function PanelMessage({
  text,
  variant = 'info',
  onRetry,
}: {
  text: string;
  variant?: 'info' | 'error';
  onRetry?: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
        variant === 'error'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      <span>{text}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border border-current px-3 py-1 text-xs font-medium hover:bg-slate-50"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ── Difficulty badge ────────────────────────────────────────────
export function DiffBadge({ d }: { d?: string }) {
  const color =
    d === 'Easy'
      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
      : d === 'Hard'
      ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
  return (
    <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${color}`}>
      {d || 'Medium'}
    </span>
  );
}

// ── Section pills per mock row ──────────────────────────────────
export function SectionPills({ sections }: { sections?: MockSection[] }) {
  if (!sections || sections.length === 0) {
    return <span className="text-xs italic text-gray-400">No sections yet</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {sections.map((s) => (
        <span
          key={s.name}
          title={`${s.count} question${s.count !== 1 ? 's' : ''}`}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700"
        >
          {s.name}
          <span className="rounded bg-white px-1.5 text-slate-600 ring-1 ring-slate-200">{s.count}</span>
        </span>
      ))}
    </div>
  );
}

// ── Card wrapper for results tables ────────────────────────────
export function ResultsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="max-h-96 overflow-auto">{children}</div>
    </div>
  );
}
