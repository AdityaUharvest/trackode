type ProfileStatsGridProps = {
  totalMocksPlayed: number;
  totalQuizzesPlayed: number;
  followerCount: number;
  achievementCount: number;
};

export function ProfileStatsGrid({ totalMocksPlayed, totalQuizzesPlayed, followerCount, achievementCount }: ProfileStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Mocks Played</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{totalMocksPlayed}</p>
      </div>
      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Quizzes Played</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{totalQuizzesPlayed}</p>
      </div>
      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Followers</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{followerCount}</p>
      </div>
      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Achievements</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{achievementCount}</p>
      </div>
    </div>
  );
}
