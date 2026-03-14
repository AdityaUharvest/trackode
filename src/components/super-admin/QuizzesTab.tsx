'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { QuizItem } from './types';
import { ActionBtn } from './ui';

type QuizzesTabProps = {
  quizzes: QuizItem[];
  busyQuizzes: Record<string, boolean>;
  onToggle: (quiz: QuizItem) => void;
  onConfirmDelete: (quiz: QuizItem) => void;
};

export function QuizzesTab({ quizzes, busyQuizzes, onToggle, onConfirmDelete }: QuizzesTabProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? quizzes.filter(
        (q) =>
          q.name.toLowerCase().includes(search.toLowerCase()) ||
          (q.createdBy?.name ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : quizzes;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <input
          className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          placeholder="Search by name or owner…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-sm text-slate-500">{filtered.length} quizzes</span>
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
