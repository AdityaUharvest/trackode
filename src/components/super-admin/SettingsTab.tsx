'use client';

import type { AppSettings } from './types';

const TOGGLE_CONFIG: Array<{
  key: keyof AppSettings;
  label: string;
  desc: string;
  danger: boolean;
}> = [
  {
    key: 'maintenanceMode',
    label: 'Maintenance Mode',
    desc: 'Blocks all user access and shows a maintenance banner.',
    danger: true,
  },
  {
    key: 'quizzesEnabled',
    label: 'Enable Quizzes',
    desc: 'Allow users to access and take quizzes.',
    danger: false,
  },
  {
    key: 'mocksEnabled',
    label: 'Enable Mocks',
    desc: 'Allow users to access and attempt mock tests.',
    danger: false,
  },
  {
    key: 'resultsVisible',
    label: 'Enable Result Views',
    desc: 'Let users view their results and history.',
    danger: false,
  },
  {
    key: 'allowPublicQuizJoin',
    label: 'Public Quiz Join',
    desc: 'Allow anyone with a link to join a quiz without logging in.',
    danger: false,
  },
  {
    key: 'allowMockAttempts',
    label: 'Allow Mock Attempts',
    desc: 'Allow new mock test attempts from players.',
    danger: false,
  },
];

type SettingsTabProps = {
  settings: AppSettings;
  isSaving: boolean;
  onSettingChange: (key: keyof AppSettings, value: boolean) => void;
  onSave: () => void;
  onReload: () => void;
};

export function SettingsTab({
  settings,
  isSaving,
  onSettingChange,
  onSave,
  onReload,
}: SettingsTabProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Global Settings</h2>
      <p className="mt-1 text-sm text-slate-500">
        Toggle platform features. Changes apply platform-wide after saving.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {TOGGLE_CONFIG.map(({ key, label, desc, danger }) => {
          const checked = Boolean(settings[key]);
          return (
            <label
              key={key}
              className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition hover:bg-slate-50 ${
                danger && checked ? 'border-red-200 bg-red-50' : 'border-slate-200'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
              </div>
              <div className="relative mt-1 flex-shrink-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={(e) => onSettingChange(key, e.target.checked)}
                />
                <div
                  onClick={() => onSettingChange(key, !checked)}
                  className={`h-6 w-11 rounded-full transition-colors ${
                    checked ? (danger ? 'bg-red-500' : 'bg-slate-900') : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`m-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : 'Save Settings'}
        </button>
        <button
          onClick={onReload}
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Reload from DB
        </button>
      </div>
    </div>
  );
}
