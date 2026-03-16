import type { MockAttempt, ResultsPagination, ResultsSummary } from './types';

const getSafePercentage = (numerator: number, denominator: number) => {
  if (!denominator || denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
};

type MockResultsModalProps = {
  open: boolean;
  title: string;
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  data: MockAttempt[];
  summary: ResultsSummary;
  pagination: ResultsPagination;
  selectedAttempt: MockAttempt | null;
  mailSendingByAttempt: Record<string, boolean>;
  onClose: () => void;
  onSelectAttempt: (attempt: MockAttempt | null) => void;
  onLoadPage: (page: number, searchTerm: string) => void;
  onSendCertificateMail: (attempt: MockAttempt) => Promise<void>;
};

export function MockResultsModal({
  open,
  title,
  loading,
  search,
  setSearch,
  data,
  summary,
  pagination,
  selectedAttempt,
  mailSendingByAttempt,
  onClose,
  onSelectAttempt,
  onLoadPage,
  onSendCertificateMail,
}: MockResultsModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Individual Mock Results</h3>
            <p className="mt-0.5 text-sm text-slate-500">{title}</p>
          </div>
          <button
            onClick={() => {
              onClose();
              onSelectAttempt(null);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {!loading && data.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Participants', value: String(summary.participants || pagination.total || data.length) },
                { label: 'Avg Accuracy', value: `${summary.avgAccuracy}%` },
                { label: 'Avg Answered', value: `${summary.avgAnswered} / ${summary.totalQuestions}` },
                { label: 'Completions', value: String(summary.completions) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          )}

          {selectedAttempt && (() => {
            const sections = (selectedAttempt.sectionStats || []).map((s) => ({
              ...s,
              unanswered: Math.max(0, s.totalQuestions - s.answered),
              accuracy: s.totalQuestions > 0 ? Math.round((s.correct / s.totalQuestions) * 100) : 0,
            }));
            const scorePct = getSafePercentage(selectedAttempt.totalCorrect ?? 0, selectedAttempt.totalQuestions ?? 0);
            const accuracyPct = getSafePercentage(selectedAttempt.totalCorrect ?? 0, selectedAttempt.totalAnswered ?? 0);
            const perfLabel = scorePct >= 85 ? 'Excellent' : scorePct >= 70 ? 'Strong' : scorePct >= 50 ? 'Average' : 'Needs Improvement';
            const perfSummary = scorePct >= 85 ? 'Very strong outcome with consistently high accuracy.' : scorePct >= 70 ? 'Good performance with a solid grasp of most areas.' : scorePct >= 50 ? 'Mixed performance. There are clear strengths, but also gaps to improve.' : 'Low accuracy overall. Review weak sections and wrong answers first.';
            const strongest = [...sections].sort((a, b) => b.accuracy - a.accuracy)[0] || null;
            const weakest = [...sections].sort((a, b) => a.accuracy - b.accuracy)[0] || null;
            const lowSections = sections.filter((s) => s.accuracy < 50);
            const tone = (t: number) => t >= 70 ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : t < 50 ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-900';

            return (
              <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedAttempt.userName || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{selectedAttempt.email || '-'}</p>
                  </div>
                  <button
                    onClick={() => onSelectAttempt(null)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    ← Back to list
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                  {[
                    {
                      label: 'Score',
                      value: `${selectedAttempt.totalCorrect ?? 0}/${selectedAttempt.totalQuestions ?? 0} (${scorePct}%)`,
                    },
                    { label: 'Accuracy', value: `${accuracyPct}%` },
                    {
                      label: 'Status',
                      value:
                        selectedAttempt.status === 'left'
                          ? 'Left Quiz'
                          : selectedAttempt.status === 'in-progress'
                          ? 'In Progress'
                          : 'Completed',
                    },
                    { label: 'Level', value: perfLabel },
                    { label: 'Answered', value: String(selectedAttempt.totalAnswered ?? 0) },
                    { label: 'Unanswered', value: String(Math.max(0, (selectedAttempt.totalQuestions || 0) - (selectedAttempt.totalAnswered || 0))) },
                    { label: 'Incorrect', value: String(Math.max(0, (selectedAttempt.totalAnswered || 0) - (selectedAttempt.totalCorrect || 0))) },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className={`rounded-lg border p-3 ${tone(scorePct)}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Overall Interpretation</p>
                    <p className="mt-1 text-sm leading-6">{perfSummary}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Strongest Section</p>
                    <p className="mt-1 text-sm leading-6">
                      {strongest ? `${strongest.sectionName} at ${strongest.accuracy}% accuracy.` : 'No data available.'}
                    </p>
                  </div>
                  <div className={`rounded-lg border p-3 ${lowSections.length ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Needs Attention</p>
                    <p className="mt-1 text-sm leading-6">
                      {lowSections.length
                        ? `${lowSections.length} section(s) below 50% accuracy: ${lowSections.slice(0, 2).map((s) => s.sectionName).join(', ')}.`
                        : 'No section is below 50% accuracy.'}
                    </p>
                  </div>
                </div>

                {sections.length > 0 && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                          <th className="px-3 py-2 text-left">Section</th>
                          <th className="px-3 py-2 text-left">Correct</th>
                          <th className="px-3 py-2 text-left">Answered</th>
                          <th className="px-3 py-2 text-left">Unanswered</th>
                          <th className="px-3 py-2 text-left">Total</th>
                          <th className="px-3 py-2 text-left">Accuracy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {sections.map((s) => (
                          <tr key={s.sectionName} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-medium text-slate-900">{s.sectionName}</td>
                            <td className="px-3 py-2 text-slate-700">{s.correct}</td>
                            <td className="px-3 py-2 text-slate-700">{s.answered}</td>
                            <td className="px-3 py-2 text-slate-700">{s.unanswered}</td>
                            <td className="px-3 py-2 text-slate-700">{s.totalQuestions}</td>
                            <td className="px-3 py-2">
                              <span className={`font-medium ${s.accuracy >= 70 ? 'text-emerald-700' : s.accuracy < 50 ? 'text-amber-700' : 'text-slate-700'}`}>
                                {s.accuracy}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Completion Insight</p>
                    <p className="mt-1 text-sm leading-6">
                      {selectedAttempt.totalAnswered ?? 0} of {selectedAttempt.totalQuestions ?? 0} questions answered, leaving {Math.max(0, (selectedAttempt.totalQuestions || 0) - (selectedAttempt.totalAnswered || 0))} unanswered.
                    </p>
                  </div>
                  <div className={`rounded-lg border p-3 ${weakest && weakest.accuracy < 50 ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Weakest Section</p>
                    <p className="mt-1 text-sm leading-6">
                      {weakest ? `${weakest.sectionName} is lowest at ${weakest.accuracy}% accuracy.` : 'No section data available.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {!selectedAttempt && (
            <div>
              <form
                className="mb-3 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  onLoadPage(1, search);
                }}
              >
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by user name or email"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      onLoadPage(1, '');
                    }}
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-3 py-2">User</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Answered</th>
                      <th className="px-3 py-2">Score</th>
                      <th className="px-3 py-2">Accuracy</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Completed At</th>
                      <th className="px-3 py-2">Certificate Mail</th>
                      <th className="px-3 py-2 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {loading && (
                      <tr>
                        <td colSpan={9} className="px-3 py-8">
                          <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                            <span className="text-sm">Loading individual results...</span>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!loading && data.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-3 py-6 text-center text-sm text-slate-400">
                          {search.trim() ? 'No attempts found for this search.' : 'No attempts found for this mock.'}
                        </td>
                      </tr>
                    )}
                    {!loading &&
                      data.map((attempt) => (
                        <tr key={attempt._id} className="hover:bg-slate-50">
                          {(() => {
                            const scorePct = getSafePercentage(attempt.totalCorrect ?? 0, attempt.totalQuestions ?? 0);
                            const accuracyPct = getSafePercentage(attempt.totalCorrect ?? 0, attempt.totalAnswered ?? 0);
                            return (
                              <>
                          <td className="px-3 py-2 font-medium text-slate-900">{attempt.userName || 'Unknown'}</td>
                          <td className="px-3 py-2 text-xs text-slate-500">{attempt.email || '-'}</td>
                          <td className="px-3 py-2 text-slate-700">
                            {attempt.totalAnswered ?? 0}/{attempt.totalQuestions ?? 0}
                          </td>
                          <td className="px-3 py-2 text-slate-700">
                            {attempt.totalCorrect ?? 0}/{attempt.totalQuestions ?? 0} ({scorePct}%)
                          </td>
                          <td className="px-3 py-2">
                            <span className={`font-medium ${accuracyPct >= 70 ? 'text-emerald-700' : accuracyPct < 50 ? 'text-amber-700' : 'text-slate-700'}`}>
                              {accuracyPct}%
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                                attempt.status === 'left'
                                  ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                                  : attempt.status === 'in-progress'
                                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                              }`}
                            >
                              {attempt.status === 'left'
                                ? 'Left Quiz'
                                : attempt.status === 'in-progress'
                                ? 'In Progress'
                                : 'Completed'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-500">
                            {attempt.completedAt
                              ? new Date(attempt.completedAt).toLocaleString()
                              : attempt.status === 'left' && attempt.expectedEndAt
                              ? `Left after ${new Date(attempt.expectedEndAt).toLocaleString()}`
                              : attempt.lastActivityAt
                              ? `Last active ${new Date(attempt.lastActivityAt).toLocaleString()}`
                              : '-'}
                          </td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => void onSendCertificateMail(attempt)}
                              disabled={Boolean(mailSendingByAttempt[attempt._id]) || !attempt.email || attempt.status === 'in-progress'}
                              className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {mailSendingByAttempt[attempt._id] ? 'Sending...' : 'Send Mail'}
                            </button>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => onSelectAttempt(attempt)}
                              className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              View Details
                            </button>
                          </td>
                              </>
                            );
                          })()}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {!loading && pagination.total > 0 && (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    Showing {data.length} of {pagination.total} attempts (Page {pagination.page} of {pagination.totalPages})
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLoadPage(pagination.page - 1, search)}
                      disabled={!pagination.hasPrevPage || loading}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => onLoadPage(pagination.page + 1, search)}
                      disabled={!pagination.hasNextPage || loading}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
