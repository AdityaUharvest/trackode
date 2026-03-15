import Link from 'next/link';
import { BadgeCheck, Download, Mail, Star, Trophy, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileCertificatesCard } from './ProfileCertificatesCard';
import { ProfileParticipantsCard } from './ProfileParticipantsCard';
import { ProfileStatsGrid } from './ProfileStatsGrid';
import type { CertificateAchievement, ProfileFormData, ProfileSummary, TopFinishTier } from './types';

type ProfileDashboardProps = {
  isOwner: boolean;
  isPrivateProfile: boolean;
  summary: ProfileSummary | null;
  summaryLoading: boolean;
  followerCount: number;
  userAchievementsCount: number;
  formData: ProfileFormData;
  topTags: string[];
  latestAchievements: Array<any>;
  certificateAchievements: CertificateAchievement[];
  topFinishTier: TopFinishTier;
  onDownloadCertificate: (achievement: CertificateAchievement) => Promise<void>;
  formatDate: (value?: string | Date) => string;
  getInitials: (value?: string) => string;
  getOrdinal: (rank: number) => string;
};

export function ProfileDashboard({
  isOwner,
  isPrivateProfile,
  summary,
  summaryLoading,
  followerCount,
  userAchievementsCount,
  formData,
  topTags,
  latestAchievements,
  certificateAchievements,
  topFinishTier,
  onDownloadCertificate,
  formatDate,
  getInitials,
  getOrdinal,
}: ProfileDashboardProps) {
  const hasMockScore = Boolean((summary?.stats.highestMock.totalQuestions ?? 0) > 0);
  const hasQuizScore = Boolean((summary?.stats.highestQuiz.totalQuestions ?? 0) > 0);
  const topWins = summary?.topWins ?? [];
  const topFinishCount = summary?.stats.topFinishes ?? 0;
  const featuredTopWin = topWins[0] || null;

  return (
    <Card className="bg-white shadow-md dark:bg-gray-800">
      <CardHeader>
        <CardTitle>{isOwner ? 'Profile Dashboard' : 'Profile Snapshot'}</CardTitle>
        <CardDescription>
          {isPrivateProfile
            ? 'This profile is private. Only public highlights are visible.'
            : isOwner
            ? 'Your profile summary, performance and network overview'
            : 'Compact public highlights only'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfileStatsGrid
          totalMocksPlayed={summary?.stats.totalMocksPlayed ?? 0}
          totalQuizzesPlayed={summary?.stats.totalQuizzesPlayed ?? 0}
          followerCount={followerCount}
          achievementCount={summary?.stats.certificates ?? userAchievementsCount}
        />

        {isOwner ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold">Best Scores</h3>
              </div>
              <div className="space-y-2 text-sm">
                {hasMockScore ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Mock</p>
                      <p className="truncate font-medium text-slate-900 dark:text-slate-100">{summary?.stats.highestMock.title}</p>
                    </div>
                    <p className="whitespace-nowrap text-xs text-slate-500">{summary?.stats.highestMock.totalCorrect ?? 0}/{summary?.stats.highestMock.totalQuestions ?? 0} • {summary?.stats.highestMock.accuracy ?? 0}%</p>
                  </div>
                ) : null}
                {hasQuizScore ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Quiz</p>
                      <p className="truncate font-medium text-slate-900 dark:text-slate-100">{summary?.stats.highestQuiz.title}</p>
                    </div>
                    <p className="whitespace-nowrap text-xs text-slate-500">{summary?.stats.highestQuiz.score ?? 0}/{summary?.stats.highestQuiz.totalQuestions ?? 0} • {summary?.stats.highestQuiz.percentage ?? 0}%</p>
                  </div>
                ) : null}
                {!hasMockScore && !hasQuizScore ? <p className="text-sm text-slate-500">No scores recorded yet.</p> : null}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold">Stack & Wins</h3>
              </div>
              {topTags.length ? (
                <div className="flex flex-wrap gap-2">
                  {topTags.map((item, index) => (
                    <Badge key={`${item}-${index}`} variant="outline">{item}</Badge>
                  ))}
                </div>
              ) : null}
              <div className={`relative overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 ${topTags.length ? 'mt-4' : ''}`}>
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-200/30 blur-2xl dark:bg-amber-500/10" />
                <div className="absolute -bottom-8 left-10 h-20 w-20 rounded-full bg-rose-200/30 blur-2xl dark:bg-rose-500/10" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Top Finishes</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${topFinishTier.chip}`}>
                          {topFinishTier.label}
                        </span>
                        <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm dark:bg-slate-950/80">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-3.5 w-3.5 ${index < topFinishTier.stars ? `${topFinishTier.tone} fill-current` : 'text-slate-300 dark:text-slate-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950/90">
                      <p className="text-3xl font-bold leading-none text-slate-900 dark:text-slate-100">{topFinishCount}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">wins</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/80 bg-white/85 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-950/80">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Featured Finish</p>
                      {featuredTopWin ? <Badge variant="secondary" className="capitalize">#1 {featuredTopWin.kind}</Badge> : null}
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {featuredTopWin ? featuredTopWin.title : 'No first-place finish yet'}
                    </p>
                  </div>

                  {topWins.length > 1 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topWins.slice(1, 4).map((win, index) => (
                        <Badge key={`${win.kind}-${win.title}-${index}`} variant="outline" className="border-white/80 bg-white/70 capitalize dark:border-slate-700 dark:bg-slate-950/70">
                          #{1} {win.kind}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              {latestAchievements.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {latestAchievements.map((achievement, idx) => (
                    <Badge key={idx} variant="outline">
                      {achievement?.quizTitle || (typeof achievement === 'string' ? achievement : 'Achievement')}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold">Overview</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>{[formData.college, formData.branch, formData.year].filter(Boolean).join(' • ') || 'No academic details shared.'}</p>
                <p>{formData.bio || 'No bio added yet.'}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold">Highlights</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {topTags.slice(0, 8).length ? topTags.slice(0, 8).map((item, index) => (
                  <Badge key={`${item}-${index}`} variant="outline">{item}</Badge>
                )) : <p className="text-sm text-slate-500">No highlights shared.</p>}
              </div>
            </div>
          </div>
        )}

        {!isPrivateProfile && isOwner ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <ProfileParticipantsCard
              totalParticipants={summary?.participants?.length ?? 0}
              joinedOn={userAchievementsCount > 0 ? certificateAchievements[certificateAchievements.length - 1]?.date : undefined}
              publicProfile={formData.public}
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold">Old Participants You Played With</h3>
              </div>
              <div className="max-h-80 space-y-2 overflow-auto pr-1">
                {summaryLoading ? (
                  <p className="text-sm text-slate-500">Loading participants...</p>
                ) : summary?.participants?.length ? (
                  summary.participants.map((participant) => (
                    <Link
                      key={participant.id}
                      href={participant.profileUrl}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {participant.image ? (
                        <img src={participant.image} alt={participant.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
                          {getInitials(participant.name)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900 dark:text-slate-100">{participant.name || participant.email}</p>
                        <p className="text-xs text-slate-500">
                          {participant.sharedMocks} mocks • {participant.sharedQuizzes} quizzes • {formatDate(participant.lastPlayedAt || undefined)}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
                    No co-participants found yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {isOwner ? <ProfileCertificatesCard certificates={certificateAchievements} onDownload={(achievement) => void onDownloadCertificate(achievement)} /> : null}

        {isPrivateProfile ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700">
            This user has kept detailed activity private.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
