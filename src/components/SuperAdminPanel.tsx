'use client';

import { useCallback, useEffect, useState } from 'react';
import { ConfirmModal } from './super-admin/ConfirmModal';
import { MocksTab } from './super-admin/MocksTab';
import { OverviewTab } from './super-admin/OverviewTab';
import { QuizzesTab } from './super-admin/QuizzesTab';
import { ResultsTab } from './super-admin/ResultsTab';
import { SettingsTab } from './super-admin/SettingsTab';
import { ToastStack, useToast } from './super-admin/ToastStack';
import { PanelMessage } from './super-admin/ui';
import { DEFAULT_SETTINGS } from './super-admin/types';
import type {
  AppSettings,
  ConfirmOptions,
  MockDraft,
  MockAttemptItem,
  MockItem,
  MockResultItem,
  QuizItem,
  QuizResultItem,
  SuperStats,
  TabId,
} from './super-admin/types';

const TABS: Array<[TabId, string]> = [
  ['overview', 'Overview'],
  ['mocks', 'Mocks'],
  ['quizzes', 'Quizzes'],
  ['results', 'Results'],
  ['settings', 'Settings'],
];

export default function SuperAdminPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const { toasts, push: toast } = useToast();
  const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);

  const [stats, setStats] = useState<SuperStats | null>(null);
  const [mocks, setMocks] = useState<MockItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [mockAttempts, setMockAttempts] = useState<MockAttemptItem[]>([]);
  const [mockResults, setMockResults] = useState<MockResultItem[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const [busyMocks, setBusyMocks] = useState<Record<string, boolean>>({});
  const [busyQuizzes, setBusyQuizzes] = useState<Record<string, boolean>>({});
  const [editingMockId, setEditingMockId] = useState('');
  const [mockDrafts, setMockDrafts] = useState<Record<string, MockDraft>>({});
  const [managingSectionsMockId, setManagingSectionsMockId] = useState('');
  const [sectionsBusy, setSectionsBusy] = useState(false);

  const loadDashboard = useCallback(async () => {
    setError('');
    setIsLoading(true);

    try {
      const [dashboardRes, settingsRes] = await Promise.all([
        fetch('/api/admin/super-dashboard', { cache: 'no-store' }),
        fetch('/api/admin/settings', { cache: 'no-store' }),
      ]);

      const dashboardPayload = await dashboardRes.json();
      const settingsPayload = await settingsRes.json();

      if (!dashboardRes.ok || !dashboardPayload?.success) {
        throw new Error(dashboardPayload?.message || 'Failed to load super admin dashboard');
      }

      const dashboardData = dashboardPayload.data;
      setStats(dashboardData.stats || null);
      setMocks(Array.isArray(dashboardData.mocks) ? dashboardData.mocks : []);
      setQuizzes(Array.isArray(dashboardData.quizzes) ? dashboardData.quizzes : []);
      setMockAttempts(Array.isArray(dashboardData.quizAttempts) ? dashboardData.quizAttempts : []);
      setMockResults(Array.isArray(dashboardData.mockResults) ? dashboardData.mockResults : []);
      setQuizResults(Array.isArray(dashboardData.quizResults) ? dashboardData.quizResults : []);

      if (settingsRes.ok && settingsPayload?.success) {
        setSettings({ ...DEFAULT_SETTINGS, ...(settingsPayload.settings || {}) });
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Failed to load data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleMockPublishToggle = async (mockId: string, current: boolean) => {
    setBusyMocks((prev) => ({ ...prev, [mockId]: true }));

    try {
      const response = await fetch(`/api/mock-tests/${mockId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !current }),
      });

      if (!response.ok) {
        throw new Error('Failed to update publish status');
      }

      setMocks((prev) =>
        prev.map((mock) => (mock._id === mockId ? { ...mock, isPublished: !current } : mock))
      );
      toast(`Mock ${!current ? 'published' : 'unpublished'}`, 'success');
    } catch {
      toast('Could not update publish status', 'error');
    } finally {
      setBusyMocks((prev) => ({ ...prev, [mockId]: false }));
    }
  };

  const doDeleteMock = async (mockId: string) => {
    setBusyMocks((prev) => ({ ...prev, [mockId]: true }));

    try {
      const response = await fetch(`/api/admin/mocks/${mockId}`, { method: 'DELETE' });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete mock');
      }

      setMocks((prev) => prev.filter((mock) => mock._id !== mockId));
      toast('Mock deleted', 'success');
    } catch {
      toast('Could not delete mock', 'error');
    } finally {
      setBusyMocks((prev) => ({ ...prev, [mockId]: false }));
    }
  };

  const handleConfirmDeleteMock = (mock: MockItem) => {
    setConfirm({
      title: 'Delete Mock',
      message: `Delete "${mock.title}" permanently? All ${mock.attempts ?? 0} linked attempt records will remain disconnected.`,
      confirmLabel: 'Yes, Delete',
      destructive: true,
      onConfirm: () => doDeleteMock(mock._id),
    });
  };

  const handleBeginMockEdit = (mock: MockItem) => {
    setEditingMockId(mock._id);
    setMockDrafts((prev) => ({
      ...prev,
      [mock._id]: {
        title: mock.title,
        difficulty: mock.difficulty ?? 'Medium',
        isPublic: Boolean(mock.public),
      },
    }));
  };

  const handleDraftChange = (mockId: string, patch: Partial<MockDraft>) => {
    setMockDrafts((prev) => ({
      ...prev,
      [mockId]: {
        ...(prev[mockId] ?? { title: '', difficulty: 'Medium', isPublic: false }),
        ...patch,
      },
    }));
  };

  const handleSaveMockEdit = async (mockId: string) => {
    const draft = mockDrafts[mockId];
    if (!draft) {
      return;
    }

    setBusyMocks((prev) => ({ ...prev, [mockId]: true }));

    try {
      const response = await fetch(`/api/admin/mocks/${mockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title,
          difficulty: draft.difficulty,
          public: draft.isPublic,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update mock');
      }

      setMocks((prev) =>
        prev.map((mock) =>
          mock._id === mockId
            ? {
                ...mock,
                title: payload.mock?.title ?? draft.title,
                difficulty: payload.mock?.difficulty ?? draft.difficulty,
                public: typeof payload.mock?.public === 'boolean' ? payload.mock.public : draft.isPublic,
              }
            : mock
        )
      );
      setEditingMockId('');
      toast('Mock updated', 'success');
    } catch {
      toast('Could not update mock', 'error');
    } finally {
      setBusyMocks((prev) => ({ ...prev, [mockId]: false }));
    }
  };

  const handleManageSections = (mock: MockItem) => {
    setManagingSectionsMockId(mock._id);
  };

  const handleRemoveSection = async (sectionName: string) => {
    if (!managingSectionsMockId || !sectionName) {
      return;
    }

    setSectionsBusy(true);
    try {
      const response = await fetch(
        `/api/admin/mocks/${managingSectionsMockId}/sections?section=${encodeURIComponent(sectionName)}`,
        { method: 'DELETE' }
      );
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to remove section');
      }
      toast(`Section "${sectionName}" removed`, 'success');
      await loadDashboard();
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : 'Could not remove section', 'error');
    } finally {
      setSectionsBusy(false);
    }
  };

  const handleImportSection = async (sourceMockId: string, sourceSection: string, replaceExisting: boolean) => {
    if (!managingSectionsMockId) {
      return;
    }

    setSectionsBusy(true);
    try {
      const response = await fetch(`/api/admin/mocks/${managingSectionsMockId}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceMockId, sourceSection, replaceExisting }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to import section');
      }

      toast(payload?.message || 'Section imported', 'success');
      await loadDashboard();
    } catch (cause) {
      toast(cause instanceof Error ? cause.message : 'Could not import section', 'error');
    } finally {
      setSectionsBusy(false);
    }
  };

  const doQuizToggle = async (quizId: string) => {
    setBusyQuizzes((prev) => ({ ...prev, [quizId]: true }));

    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}/toggle`, { method: 'POST' });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to toggle quiz');
      }

      setQuizzes((prev) =>
        prev.map((quiz) => (quiz._id === quizId ? { ...quiz, active: !quiz.active } : quiz))
      );
      toast('Quiz status updated', 'success');
    } catch {
      toast('Could not update quiz status', 'error');
    } finally {
      setBusyQuizzes((prev) => ({ ...prev, [quizId]: false }));
    }
  };

  const handleQuizToggle = (quiz: QuizItem) => {
    const action = quiz.active ? 'Unpublish' : 'Publish';
    setConfirm({
      title: `${action} Quiz`,
      message: `Are you sure you want to ${action.toLowerCase()} "${quiz.name}"?`,
      confirmLabel: action,
      onConfirm: () => doQuizToggle(quiz._id),
    });
  };

  const doDeleteQuiz = async (quizId: string) => {
    setBusyQuizzes((prev) => ({ ...prev, [quizId]: true }));

    try {
      const response = await fetch(`/api/quiz-update/${quizId}`, { method: 'DELETE' });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete quiz');
      }

      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
      toast('Quiz deleted', 'success');
    } catch {
      toast('Could not delete quiz', 'error');
    } finally {
      setBusyQuizzes((prev) => ({ ...prev, [quizId]: false }));
    }
  };

  const handleConfirmDeleteQuiz = (quiz: QuizItem) => {
    setConfirm({
      title: 'Delete Quiz',
      message: `Delete "${quiz.name}" permanently? All participant records will be removed.`,
      confirmLabel: 'Yes, Delete',
      destructive: true,
      onConfirm: () => doDeleteQuiz(quiz._id),
    });
  };

  const handleSettingChange = (key: keyof AppSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const doSaveSettings = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to save settings');
      }

      setSettings({ ...DEFAULT_SETTINGS, ...(payload.settings || {}) });
      toast('Settings saved', 'success');
    } catch {
      toast('Could not save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = () => {
    setConfirm({
      title: 'Save Global Settings',
      message: 'Apply these switches to the live platform?',
      confirmLabel: 'Save',
      onConfirm: doSaveSettings,
    });
  };

  return (
    <>
      {confirm && <ConfirmModal opts={confirm} onCancel={() => setConfirm(null)} />}
      <ToastStack toasts={toasts} />

      <div className="min-h-screen bg-slate-100 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Super Admin Panel</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage mocks, quizzes, results, and platform settings from one place.
                </p>
              </div>
              <button
                onClick={loadDashboard}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                ) : (
                  <span>Refresh</span>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map(([tabId, label]) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition ${
                    activeTab === tabId
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isLoading && <PanelMessage text="Loading data..." />}
          {error && !isLoading && <PanelMessage text={error} variant="error" onRetry={loadDashboard} />}

          {!isLoading && !error && (
            <>
              {activeTab === 'overview' && <OverviewTab stats={stats} settings={settings} />}
              {activeTab === 'mocks' && (
                <MocksTab
                  mocks={mocks}
                  busyMocks={busyMocks}
                  editingMockId={editingMockId}
                  mockDrafts={mockDrafts}
                  onPublishToggle={handleMockPublishToggle}
                  onConfirmDelete={handleConfirmDeleteMock}
                  onBeginEdit={handleBeginMockEdit}
                  onManageSections={handleManageSections}
                  onSaveEdit={handleSaveMockEdit}
                  onCancelEdit={() => setEditingMockId('')}
                  onDraftChange={handleDraftChange}
                  managingSectionsMock={mocks.find((mock) => mock._id === managingSectionsMockId) ?? null}
                  sectionsBusy={sectionsBusy}
                  onCloseSections={() => setManagingSectionsMockId('')}
                  onRemoveSection={handleRemoveSection}
                  onImportSection={handleImportSection}
                  onToast={toast}
                  onDataChanged={loadDashboard}
                />
              )}
              {activeTab === 'quizzes' && (
                <QuizzesTab
                  quizzes={quizzes}
                  busyQuizzes={busyQuizzes}
                  onToggle={handleQuizToggle}
                  onConfirmDelete={handleConfirmDeleteQuiz}
                  onToast={toast}
                  onDataChanged={loadDashboard}
                />
              )}
              {activeTab === 'results' && (
                <ResultsTab
                  mockAttempts={mockAttempts}
                  mockResults={mockResults}
                  quizResults={quizResults}
                  onDataChanged={loadDashboard}
                  onToast={toast}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab
                  settings={settings}
                  isSaving={isSaving}
                  onSettingChange={handleSettingChange}
                  onSave={handleSaveSettings}
                  onReload={loadDashboard}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
