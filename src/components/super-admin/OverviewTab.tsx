'use client';

import type { AppSettings, SuperStats } from './types';

type OverviewTabProps = {
  stats: SuperStats | null;
  settings: AppSettings;
};

export function OverviewTab({ stats, settings }: OverviewTabProps) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Mocks',
      value: stats.totalMocks,
      sub: `${stats.publishedMocks} published`,
      tone: 'text-slate-900',
    },
    {
      label: 'Total Quizzes',
      value: stats.totalQuizzes,
      sub: `${stats.activeQuizzes} active`,
      tone: 'text-slate-900',
    },
    {
      label: 'Mock Attempts',
      value: stats.totalMockAttempts,
      sub: 'total plays',
      tone: 'text-slate-900',
    },
    {
      label: 'Quiz Attempts',
      value: stats.totalQuizAttempts,
      sub: 'total plays',
      tone: 'text-slate-900',
    },
    {
      label: 'Mock Results',
      value: stats.totalMockResults,
      sub: 'stored results',
      tone: 'text-slate-900',
    },
    {
      label: 'Platform Status',
      value: settings.maintenanceMode ? 'Maintenance' : 'Live',
      sub:
        settings.mocksEnabled && settings.quizzesEnabled
          ? 'All features on'
          : 'Some features off',
      tone: settings.maintenanceMode ? 'text-red-700' : 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((item) => (
        <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
          <p className={`mt-3 text-3xl font-semibold ${item.tone}`}>{item.value}</p>
          <p className="mt-1 text-sm text-slate-500">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
