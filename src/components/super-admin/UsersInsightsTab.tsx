'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type UserRow = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  createdAt?: string;
  updatedAt?: string;
  mockAttempts: number;
  quizAttempts: number;
  isActive7d: boolean;
  isActive30d: boolean;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type TrendPoint = { date: string; count: number };
type RankedItem = { id?: string; title?: string; attempts?: number; region?: string; users?: number };
type TopStudent = {
  userId: string;
  name: string;
  email: string;
  attempts: number;
  mockAttempts: number;
  quizAttempts: number;
  avgAccuracy: number;
};

type InsightsPayload = {
  metrics: {
    totalUsers: number;
    filteredUsers: number;
    newUsers7d: number;
    newUsers30d: number;
    activeUsers7d: number;
    activeUsers30d: number;
  };
  users: UserRow[];
  topTrendingMocks: RankedItem[];
  topTrendingQuizzes: RankedItem[];
  topStudents: TopStudent[];
  trends: {
    mockAttemptTrend: TrendPoint[];
    userRegistrationTrend: TrendPoint[];
  };
  geography: {
    byCollege: RankedItem[];
    byEmailDomain: RankedItem[];
  };
  pagination: Pagination;
};

type UsersInsightsTabProps = {
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
  refreshTick?: number;
};

const EMPTY_PAGINATION: Pagination = {
  page: 1,
  limit: 25,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}

function TrendChart({ title, points }: { title: string; points: TrendPoint[] }) {
  const width = 520;
  const height = 210;
  const left = 42;
  const right = 16;
  const top = 14;
  const bottom = 36;
  const chartW = width - left - right;
  const chartH = height - top - bottom;
  const maxY = Math.max(1, ...points.map((p) => p.count || 0));
  const minY = 0;

  const safePoints = points.length > 0 ? points : [{ date: new Date().toISOString().slice(0, 10), count: 0 }];

  const coords = safePoints.map((point, index) => {
    const x = left + (safePoints.length === 1 ? chartW / 2 : (index / (safePoints.length - 1)) * chartW);
    const y = top + ((maxY - point.count) / Math.max(1, maxY - minY)) * chartH;
    return { x, y, date: point.date, count: point.count };
  });

  const linePath = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(2)} ${(top + chartH).toFixed(2)} L ${coords[0].x.toFixed(2)} ${(top + chartH).toFixed(2)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    value: Math.round(maxY * (1 - t)),
    y: top + chartH * t,
  }));

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <span className="text-xs text-slate-500">Peak: {maxY}</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full rounded-md border border-slate-100 bg-slate-50">
        <defs>
          <linearGradient id={`trend-fill-${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {yTicks.map((tick, index) => (
          <g key={`tick-${index}`}>
            <line x1={left} x2={left + chartW} y1={tick.y} y2={tick.y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={left - 8} y={tick.y + 4} textAnchor="end" fontSize="10" fill="#64748b">
              {tick.value}
            </text>
          </g>
        ))}

        <path
          d={areaPath}
          fill={`url(#trend-fill-${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()})`}
        />
        <path d={linePath} fill="none" stroke="#0f172a" strokeWidth="2" />

        {coords.map((point, index) => (
          <g key={`point-${index}`}>
            <circle cx={point.x} cy={point.y} r="3" fill="#0f172a" />
            {index % 2 === 0 || index === coords.length - 1 ? (
              <text x={point.x} y={height - 12} textAnchor="middle" fontSize="10" fill="#64748b">
                {point.date.slice(5)}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}

function RankedList({ title, items, valueLabel }: { title: string; items: Array<{ label: string; value: number }>; valueLabel: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="mb-2 text-sm font-semibold text-slate-900">{title}</p>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-xs text-slate-400">No data</p>}
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center justify-between rounded-md border border-slate-100 px-2 py-1.5">
            <p className="truncate pr-2 text-xs text-slate-700">{index + 1}. {item.label}</p>
            <span className="text-xs font-semibold text-slate-900">{item.value} {valueLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UsersInsightsTab({ onToast, refreshTick }: UsersInsightsTabProps) {
  const [loading, setLoading] = useState(true);
  const hasFetchedOnce = useRef(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [metrics, setMetrics] = useState<InsightsPayload['metrics']>({
    totalUsers: 0,
    filteredUsers: 0,
    newUsers7d: 0,
    newUsers30d: 0,
    activeUsers7d: 0,
    activeUsers30d: 0,
  });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);
  const [topMocks, setTopMocks] = useState<RankedItem[]>([]);
  const [topQuizzes, setTopQuizzes] = useState<RankedItem[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [mockTrend, setMockTrend] = useState<TrendPoint[]>([]);
  const [registrationTrend, setRegistrationTrend] = useState<TrendPoint[]>([]);
  const [geoCollege, setGeoCollege] = useState<RankedItem[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!hasFetchedOnce.current) setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '25' });
        if (debouncedQuery) params.set('q', debouncedQuery);

        const response = await fetch(`/api/admin/users-insights?${params.toString()}`, { cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load user insights');
        }

        if (!active) return;

        hasFetchedOnce.current = true;
        setMetrics(payload.metrics || metrics);
        setUsers(Array.isArray(payload.users) ? payload.users : []);
        setPagination(payload.pagination || EMPTY_PAGINATION);
        setTopMocks(Array.isArray(payload.topTrendingMocks) ? payload.topTrendingMocks : []);
        setTopQuizzes(Array.isArray(payload.topTrendingQuizzes) ? payload.topTrendingQuizzes : []);
        setTopStudents(Array.isArray(payload.topStudents) ? payload.topStudents : []);
        setMockTrend(Array.isArray(payload.trends?.mockAttemptTrend) ? payload.trends.mockAttemptTrend : []);
        setRegistrationTrend(Array.isArray(payload.trends?.userRegistrationTrend) ? payload.trends.userRegistrationTrend : []);
        setGeoCollege(Array.isArray(payload.geography?.byCollege) ? payload.geography.byCollege : []);
      } catch (cause) {
        if (active) {
          onToast(cause instanceof Error ? cause.message : 'Could not load user insights', 'error');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [debouncedQuery, onToast, page, refreshTick]);

  useEffect(() => {
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  const topMockItems = useMemo(
    () => topMocks.map((row) => ({ label: row.title || 'Untitled Mock', value: Number(row.attempts || 0) })),
    [topMocks]
  );
  const topQuizItems = useMemo(
    () => topQuizzes.map((row) => ({ label: row.title || 'Untitled Quiz', value: Number(row.attempts || 0) })),
    [topQuizzes]
  );
  const geoCollegeItems = useMemo(
    () => geoCollege.map((row) => ({ label: row.region || 'Unknown', value: Number(row.users || 0) })),
    [geoCollege]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Total Users" value={String(metrics.totalUsers)} sub="All registered accounts" />
        <MetricCard label="Filtered Users" value={String(metrics.filteredUsers)} sub="Current search scope" />
        <MetricCard label="Active (7d)" value={String(metrics.activeUsers7d)} sub="Mock or quiz attempts" />
        <MetricCard label="Active (30d)" value={String(metrics.activeUsers30d)} sub="Mock or quiz attempts" />
        <MetricCard label="New Users (7d)" value={String(metrics.newUsers7d)} />
        <MetricCard label="New Users (30d)" value={String(metrics.newUsers30d)} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TrendChart title="Mock Attempt Trend (Last 14 days)" points={mockTrend} />
        <TrendChart title="User Registration Trend (Last 14 days)" points={registrationTrend} />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
        <RankedList title="Top Trending Mocks" items={topMockItems} valueLabel="attempts" />
        <RankedList title="Top Trending Quizzes" items={topQuizItems} valueLabel="attempts" />
        <RankedList title="Geography Proxy: College" items={geoCollegeItems} valueLabel="users" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-sm font-semibold text-slate-900">Top Students</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Student</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Attempts</th>
                <th className="px-3 py-2 text-left">Mock</th>
                <th className="px-3 py-2 text-left">Quiz</th>
                <th className="px-3 py-2 text-left">Avg Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {topStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-400">No student data</td>
                </tr>
              )}
              {topStudents.map((student) => (
                <tr key={student.userId}>
                  <td className="px-3 py-2 text-slate-900">{student.name}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{student.email || '-'}</td>
                  <td className="px-3 py-2 text-slate-700">{student.attempts}</td>
                  <td className="px-3 py-2 text-slate-700">{student.mockAttempts}</td>
                  <td className="px-3 py-2 text-slate-700">{student.quizAttempts}</td>
                  <td className="px-3 py-2 text-slate-700">{student.avgAccuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-900">Users</p>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, college, branch, phone"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-900 sm:max-w-md"
          />
        </div>

        {loading && (
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">Loading users...</div>
        )}

        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">College / Branch</th>
                <th className="px-3 py-2 text-left">Mock Attempts</th>
                <th className="px-3 py-2 text-left">Quiz Attempts</th>
                <th className="px-3 py-2 text-left">Active</th>
                <th className="px-3 py-2 text-left">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-xs text-slate-400">No users found</td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-3 py-2 text-slate-900">{user.name || 'Unknown'}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{user.email}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {(user.college || 'Unknown College') + (user.branch ? ` / ${user.branch}` : '')}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{user.mockAttempts}</td>
                  <td className="px-3 py-2 text-slate-700">{user.quizAttempts}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                        user.isActive7d
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          : user.isActive30d
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                          : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                      }`}
                    >
                      {user.isActive7d ? 'Active 7d' : user.isActive30d ? 'Active 30d' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} user(s)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrevPage || loading}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
