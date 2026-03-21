import Link from 'next/link';
import { BadgeCheck, Download, Mail, Star, Trophy, UserCircle, Activity, Award, Users } from 'lucide-react';
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
    <Card className="overflow-hidden border-none bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      {/* <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-6 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isOwner ? 'Your Dashboard' : 'Profile Overview'}
            </CardTitle>
            <CardDescription className="mt-1 text-slate-500">
              {isPrivateProfile
                ? 'Private profile highlights'
                : isOwner
                ? 'Monitor your progress, performance and network'
                : 'Public activity highlights'}
            </CardDescription>
          </div>
          {isOwner && (
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300">
              Active Member
            </Badge>
          )}
        </div>
      </CardHeader> */}

      <CardContent className="space-y-8 p-6">
        {/* Stats Section */}
        <ProfileStatsGrid
          totalMocksPlayed={summary?.stats.totalMocksPlayed ?? 0}
          totalQuizzesPlayed={summary?.stats.totalQuizzesPlayed ?? 0}
          followerCount={followerCount}
          achievementCount={summary?.stats.certificates ?? userAchievementsCount}
        />

        {/* Middle Content Grid */}
        {isOwner ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            {/* Best Scores Column */}
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Best Scores</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {hasMockScore ? (
                    <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-tight text-blue-500">Highest Mock</p>
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{summary?.stats.highestMock.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{summary?.stats.highestMock.accuracy}%</p>
                        <p className="text-[10px] text-slate-500">{summary?.stats.highestMock.totalCorrect}/{summary?.stats.highestMock.totalQuestions}</p>
                      </div>
                    </div>
                  ) : null}

                  {hasQuizScore ? (
                    <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-tight text-indigo-500">Highest Quiz</p>
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{summary?.stats.highestQuiz.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{summary?.stats.highestQuiz.percentage}%</p>
                        <p className="text-[10px] text-slate-500">{summary?.stats.highestQuiz.score}/{summary?.stats.highestQuiz.totalQuestions}</p>
                      </div>
                    </div>
                  ) : null}

                  {!hasMockScore && !hasQuizScore && (
                    <p className="py-4 text-center text-sm text-slate-500">Take a test to see your best scores here!</p>
                  )}
                </div>
              </div>

              {/* Tags Section */}
              {topTags.length > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 dark:border-slate-800 dark:bg-slate-900/30">
                  <div className="mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Expertise</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topTags.map((item, index) => (
                      <Badge key={`${item}-${index}`} variant="outline" className="bg-white px-3 py-1 font-medium dark:bg-slate-900">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wins & Achievements Column */}
            <div className="relative flex flex-col items-stretch justify-center overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 p-6 shadow-sm dark:border-slate-800 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Winning Streak</p>
                  </div>
                  <h3 className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">
                    {topFinishCount} <span className="text-lg font-medium text-slate-500">Victories</span>
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm ${topFinishTier.chip}`}>
                      <Star className={`h-3 w-3 fill-current`} />
                      {topFinishTier.label}
                    </span>
                    <div className="flex items-center gap-0.5 rounded-full bg-white/60 px-2 py-1.5 backdrop-blur-sm dark:bg-slate-950/40">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-3.5 w-3.5 ${index < topFinishTier.stars ? `${topFinishTier.tone} fill-current` : 'text-slate-300 dark:text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:w-64">
                  <div className="rounded-2xl border border-white/40 bg-white/40 p-4 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-slate-950/40">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recent Win</p>
                    {featuredTopWin ? (
                      <div>
                        <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-900 dark:text-slate-100">{featuredTopWin.title}</p>
                        <Badge variant="secondary" className="mt-2 h-5 text-[10px] uppercase dark:bg-slate-800">
                          #{1} {featuredTopWin.kind}
                        </Badge>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-slate-400">Keep participating!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Secondary wins indicator */}
              {topWins.length > 1 && (
                <div className="relative z-10 mt-6 flex flex-wrap gap-2 pt-6 border-t border-indigo-100/50 dark:border-slate-800">
                  <p className="w-full text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">More Victories</p>
                  {topWins.slice(1, 4).map((win, index) => (
                    <Badge key={index} variant="outline" className="h-7 bg-white/40 border-slate-200/50 text-[10px] font-semibold dark:bg-slate-950/40">
                      #{1} {win.title}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Decorative Background Elements */}
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>
          </div>
        ) : (
          /* Public Profile Layout */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-4 flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-indigo-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Background</h3>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-white dark:bg-slate-900">
                    {[formData.college, formData.branch, formData.year].filter(Boolean).join(' • ') || 'Not Provided'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{formData.bio || 'This user hasn\'t shared a bio yet.'}"
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-4 flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Skill Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {topTags.length > 0 ? (
                  topTags.slice(0, 10).map((item, index) => (
                    <Badge key={index} variant="outline" className="bg-white font-medium hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No skills highlighted yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Co-participants Section */}
        {!isPrivateProfile && isOwner && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <ProfileParticipantsCard
              totalParticipants={summary?.participants?.length ?? 0}
              joinedOn={userAchievementsCount > 0 ? certificateAchievements[certificateAchievements.length - 1]?.date : undefined}
              publicProfile={formData.public}
            />

            <div className="flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-50 p-5 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Network Activity</h3>
                </div>
                {summary?.participants && summary.participants.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {summary.participants.length} Active Contacts
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {summaryLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Activity className="h-5 w-5 animate-spin text-slate-300" />
                  </div>
                ) : summary?.participants?.length ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {summary.participants.map((participant) => (
                      <Link
                        key={participant.id}
                        href={participant.profileUrl}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-indigo-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        {participant.image ? (
                          <div className="relative">
                            <img src={participant.image} alt={participant.name} className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm ring-2 ring-transparent transition-all group-hover:ring-indigo-100 dark:border-slate-700 dark:group-hover:ring-indigo-900/30" />
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-50 to-indigo-100 text-xs font-bold text-indigo-600 shadow-sm dark:from-indigo-950 dark:to-slate-900 dark:text-indigo-300">
                            {getInitials(participant.name)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {participant.name || participant.email}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 overflow-hidden text-[10px] font-medium text-slate-500">
                            <span className="shrink-0">{participant.sharedMocks + participant.sharedQuizzes} Shared</span>
                            <span className="shrink-0 text-slate-300">•</span>
                            <span className="truncate">{formatDate(participant.lastPlayedAt || undefined)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-slate-50 p-4 dark:bg-slate-800/50">
                      <Users className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-500">No recent collaborators found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Certificates Section */}
        {isOwner && (
          <div className="pt-2">
            <ProfileCertificatesCard
              certificates={certificateAchievements}
              onDownload={(achievement) => void onDownloadCertificate(achievement)}
            />
          </div>
        )}

        {/* Small Private Profile Notice */}
        {isPrivateProfile && (
          <div className="flex items-center gap-3 rounded-2xl bg-amber-50/50 p-4 text-amber-800 dark:bg-amber-900/10 dark:text-amber-300">
            <Activity className="h-5 w-5 shrink-0" />
            <p className="text-xs font-medium">Activity detailed view is restricted by user privacy settings.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
