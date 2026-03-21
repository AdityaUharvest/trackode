import { FileText, Award, Users, Trophy } from 'lucide-react';

type ProfileStatsGridProps = {
  totalMocksPlayed: number;
  totalQuizzesPlayed: number;
  followerCount: number;
  achievementCount: number;
};

export function ProfileStatsGrid({ totalMocksPlayed, totalQuizzesPlayed, followerCount, achievementCount }: ProfileStatsGridProps) {
  const stats = [
    { label: 'Mocks Played', value: totalMocksPlayed, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Quizzes Played', value: totalQuizzesPlayed, icon: Award, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Followers', value: followerCount, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Achievements', value: achievementCount, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
              <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className={`absolute -right-2 -top-2 h-12 w-12 opacity-5 ${stat.color} blur-xl`} />
        </div>
      ))}
    </div>
  );
}
