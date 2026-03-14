'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { QuizItem } from './types';
import { ActionBtn } from './ui';

type QuizzesTabProps = {
  quizzes: QuizItem[];
  busyQuizzes: Record<string, boolean>;
  onToggle: (quiz: QuizItem) => void;
  onConfirmDelete: (quiz: QuizItem) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onDataChanged: () => Promise<void>;
};

export function QuizzesTab({ quizzes, busyQuizzes, onToggle, onConfirmDelete, onToast, onDataChanged }: QuizzesTabProps) {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newQuizName, setNewQuizName] = useState('');
  const [newQuizQuestions, setNewQuizQuestions] = useState(20);
  const [newQuizMarks, setNewQuizMarks] = useState(20);
  const [newQuizDuration, setNewQuizDuration] = useState(30);
  const [newQuizPublic, setNewQuizPublic] = useState(false);

  const handleShareQuizLink = async (quizId: string) => {
    const shareLink = `${window.location.origin}/quiz-play/${quizId}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      onToast('Quiz share link copied', 'success');
    } catch {
      onToast('Could not copy quiz share link', 'error');
    }
  };

  const handleShareQuizCode = async (shareCode?: string) => {
    if (!shareCode) {
      onToast('Share code is not available for this quiz', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareCode);
      onToast('Quiz share code copied', 'success');
    } catch {
      onToast('Could not copy quiz share code', 'error');
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuizName.trim()) {
      onToast('Enter a quiz name', 'error');
      return;
    }

    const email = session?.user?.email;
    if (!email) {
      onToast('Could not identify logged-in super admin email', 'error');
      return;
    }

    setCreating(true);
    try {
      const now = new Date();
      const end = new Date(now.getTime() + newQuizDuration * 60 * 1000);

      const response = await fetch('/api/quiz-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newQuizName.trim(),
          startDate: now.toISOString(),
          endDate: end.toISOString(),
          totalMarks: newQuizMarks,
          totalQuestions: newQuizQuestions,
          instructions: 'Read all questions carefully before answering.',
          publicc: newQuizPublic,
          duration: newQuizDuration * 60,
          email,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to create quiz');
      }

      setNewQuizName('');
      setNewQuizQuestions(20);
      setNewQuizMarks(20);
      setNewQuizDuration(30);
      setNewQuizPublic(false);
      setShowCreateModal(false);
      await onDataChanged();
      onToast('Quiz created successfully', 'success');
    } catch (cause) {
      onToast(cause instanceof Error ? cause.message : 'Could not create quiz', 'error');
    } finally {
      setCreating(false);
    }
  };

  const filtered = search
    ? quizzes.filter(
        (q) =>
          q.name.toLowerCase().includes(search.toLowerCase()) ||
          (q.createdBy?.name ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : quizzes;

  return (
    <div className="space-y-3">
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-slate-900">Create Quiz</h3>
            <p className="mt-1 text-sm text-slate-500">Create a quiz with basic defaults in one step.</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Quiz Name</label>
                <input
                  value={newQuizName}
                  onChange={(event) => setNewQuizName(event.target.value)}
                  placeholder="Quiz name"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Questions</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={newQuizQuestions}
                  onChange={(event) => setNewQuizQuestions(Math.max(1, Math.min(200, Number(event.target.value || 20))))}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Marks</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={newQuizMarks}
                  onChange={(event) => setNewQuizMarks(Math.max(1, Math.min(500, Number(event.target.value || 20))))}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Duration (min)</label>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={newQuizDuration}
                  onChange={(event) => setNewQuizDuration(Math.max(5, Math.min(300, Number(event.target.value || 30))))}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                />
              </div>

              <label className="mt-6 inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={newQuizPublic}
                  onChange={(event) => setNewQuizPublic(event.target.checked)}
                />
                Public quiz
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuiz}
                disabled={creating}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <input
          className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          placeholder="Search by name or owner…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{filtered.length} quizzes</span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            Create Quiz
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Questions</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  No quizzes found
                </td>
              </tr>
            )}
            {filtered.map((quiz) => {
              const busy = Boolean(busyQuizzes[quiz._id]);
              return (
                <tr
                  key={quiz._id}
                  className={`transition hover:bg-slate-50 ${busy ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{quiz.name}</td>
                  <td className="px-4 py-3 text-slate-600">{quiz.totalQuestions ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        quiz.public
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                      }`}
                    >
                      {quiz.public ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        quiz.active ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {quiz.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {quiz.createdBy?.name ?? quiz.createdBy?.email ?? 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <ActionBtn
                        onClick={() => onToggle(quiz)}
                        variant={quiz.active ? 'amber' : 'green'}
                        busy={busy}
                      >
                        {quiz.active ? 'Unpublish' : 'Publish'}
                      </ActionBtn>
                      <Link
                        href={`/admin-dashboard/quiz-settings/${quiz._id}`}
                        className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Settings
                      </Link>
                      <Link
                        href={`/quiz-result/${quiz._id}`}
                        className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Results
                      </Link>
                      <ActionBtn onClick={() => handleShareQuizLink(quiz._id)} variant="gray" busy={busy}>
                        Share Link
                      </ActionBtn>
                      <ActionBtn onClick={() => handleShareQuizCode(quiz.shareCode)} variant="gray" busy={busy}>
                        Share Code
                      </ActionBtn>
                      <ActionBtn onClick={() => onConfirmDelete(quiz)} variant="red" busy={busy}>
                        Delete
                      </ActionBtn>
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
