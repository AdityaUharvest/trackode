"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Linkedin, 
  Edit3, 
  Globe,
  Calendar,
  Users,
  ShieldCheck,
  UserCircle,
  BadgeCheck,
  Trophy,
  Mail,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

type ProfileSummary = {
  isOwner?: boolean;
  isPrivateProfile?: boolean;
  stats: {
    totalMocksPlayed: number;
    totalQuizzesPlayed: number;
    certificates: number;
    topFinishes: number;
    highestMock: {
      title: string;
      accuracy: number;
      totalCorrect: number;
      totalQuestions: number;
    };
    highestQuiz: {
      title: string;
      percentage: number;
      score: number;
      totalQuestions: number;
    };
  };
  topWins: Array<{
    title: string;
    kind: 'mock' | 'quiz';
  }>;
  mockHistory: Array<{
    attemptId: string;
    mockId: string;
    title: string;
    startedAt?: string | null;
    completedAt?: string | null;
    status: 'completed' | 'in-progress' | 'left';
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
  }>;
  quizHistory: Array<{
    resultId: string;
    quizId: string;
    title: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    percentage: number;
    attemptedAt?: string | null;
  }>;
  participants: Array<{
    id: string;
    email: string;
    name: string;
    image?: string;
    college?: string;
    branch?: string;
    year?: string;
    sharedMocks: number;
    sharedQuizzes: number;
    lastPlayedAt?: string | null;
    profileUrl: string;
  }>;
};

const Profile = ({ user, isOwner = false, isPrivateProfile = false }: any) => {

  const buildInitialFormData = () => ({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    college: user.college || '',
    branch: user.branch || '',
    year: user.year || '',
    leetcode: user.leetcode || '',
    github: user.github || '',
    linkedin: user.linkedin || '',
    twitter: user.twitter || '',
    interests: Array.isArray(user.interests) ? user.interests : [],
    languages: Array.isArray(user.languages) ? user.languages : [],
    public: user.public ?? true,
    image: user.image || ''
  });
  
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(buildInitialFormData());
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    editBasic: true,
    editAcademic: true,
    personal: true,
    academic: true,
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'public') {
      setFormData({ ...formData, public: value === 'true' });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { value } = e.target;
    const values = value.split(',').map(v => v.trim());
    setFormData({ ...formData, [field]: values });
  };

  const handleSave = async () => {
    const userId = user._id; // Assuming user._id is the ID of the user
    const updatedData = { ...formData, userId };
    setIsSaving(true);
    try {
      const response = await axios.put('/api/profile-update', { 
        updatedData,
        userId,
      });
      // Handle success response here
      //change the state
      setEditMode(false);
      setFormData(updatedData); // Update the form data with the response data
      console.log(response);
      
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(buildInitialFormData());
    setEditMode(false);
  };

  const toggleOpenSection = (key: 'editBasic' | 'editAcademic' | 'personal' | 'academic') => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatDate = (value?: string | Date) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString();
  };

  const getInitials = (value?: string) => {
    if (!value) return 'U';
    const parts = value.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'U';
  };

  const getMockStatusClasses = (status: 'completed' | 'in-progress' | 'left') => {
    if (status === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'left') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const userAchievements = Array.isArray(user.achievements) ? user.achievements : [];
  const followerCount = typeof user.followerCount === 'number'
    ? user.followerCount
    : Array.isArray(user.followers)
    ? user.followers.length
    : 0;
  const userSkills = Array.isArray(user.skills) ? user.skills : [];
  const combinedTags = [...userSkills, ...formData.languages, ...formData.interests].filter(Boolean);
  const topTags = Array.from(new Set(combinedTags)).slice(0, 8);
  const latestAchievements = userAchievements.slice(0, 3);
  const hasMockScore = Boolean((summary?.stats.highestMock.totalQuestions ?? 0) > 0);
  const hasQuizScore = Boolean((summary?.stats.highestQuiz.totalQuestions ?? 0) > 0);
  const topWins = summary?.topWins ?? [];
  const topFinishCount = summary?.stats.topFinishes ?? 0;

  const getTopFinishTier = (count: number) => {
    if (count >= 12) return { label: 'Legend', stars: 5, tone: 'text-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (count >= 8) return { label: 'Diamond', stars: 4, tone: 'text-sky-500', chip: 'bg-sky-50 text-sky-700 border-sky-200' };
    if (count >= 5) return { label: 'Gold', stars: 3, tone: 'text-yellow-500', chip: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    if (count >= 3) return { label: 'Silver', stars: 2, tone: 'text-slate-500', chip: 'bg-slate-100 text-slate-700 border-slate-200' };
    if (count >= 1) return { label: 'Bronze', stars: 1, tone: 'text-orange-500', chip: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { label: 'Unranked', stars: 0, tone: 'text-slate-300', chip: 'bg-slate-50 text-slate-500 border-slate-200' };
  };

  const topFinishTier = getTopFinishTier(topFinishCount);
  const featuredTopWin = topWins[0] || null;
  const essentials = [
    { label: 'Email', value: isOwner ? formData.email || '-' : null },
    { label: 'Phone', value: isOwner ? user.phone || '-' : null },
    { label: 'College', value: formData.college || '-' },
    { label: 'Branch', value: formData.branch || '-' },
    { label: 'Year', value: formData.year || '-' },
    { label: 'Visibility', value: isOwner ? (formData.public ? 'Public' : 'Private') : null },
  ].filter((item) => item.value !== null);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        setSummaryLoading(true);
        const response = await axios.get(`/api/profile-summary/${encodeURIComponent(user._id)}`);
        if (isMounted) {
          setSummary(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile summary:', error);
      } finally {
        if (isMounted) {
          setSummaryLoading(false);
        }
      }
    };

    if (user?._id) {
      loadSummary();
    }

    return () => {
      isMounted = false;
    };
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile</CardTitle>
                  {isOwner ? (
                    <Button 
                      onClick={() => (editMode ? handleCancelEdit() : setEditMode(true))} 
                      variant="outline" 
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> 
                      {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 shadow-lg mb-4"
                  >
                    <img
                      src={formData.image}
                      alt="User Photo"
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                  
                  {editMode ? (
                    <div className="w-full space-y-4">
                      <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => toggleOpenSection('editBasic')}
                          className="flex w-full items-center justify-between text-left"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Basic Info</p>
                          <span className="text-sm font-semibold text-slate-500">{openSections.editBasic ? '▴' : '▾'}</span>
                        </button>
                        {openSections.editBasic && (
                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Full Name</label>
                              <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
                              <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Profile Photo URL</label>
                              <Input
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Bio</label>
                              <Textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Write a short bio"
                                className="min-h-[90px]"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => toggleOpenSection('editAcademic')}
                          className="flex w-full items-center justify-between text-left"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Academic</p>
                          <span className="text-sm font-semibold text-slate-500">{openSections.editAcademic ? '▴' : '▾'}</span>
                        </button>
                        {openSections.editAcademic && (
                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Date Of Birth</label>
                              <Input
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">College</label>
                              <Input
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                placeholder="College name"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Branch</label>
                              <Input
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                placeholder="Branch"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Year</label>
                              <Input
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="e.g. 3rd"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Profile Visibility</label>
                              <select
                                name="public"
                                value={String(formData.public)}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                              >
                                <option value="true">Public</option>
                                <option value="false">Private</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="w-full"
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSave}
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-xl font-bold">{formData.name}</h2>
                      {isOwner && formData.email ? <p className="text-gray-500 dark:text-gray-400">{formData.email}</p> : null}
                      <p className="mt-2 text-sm">{formData.bio}</p>
                      <div className="mt-4 space-y-1 text-sm">
                        {formData.college && <p>🎓 {formData.college}</p>}
                        {formData.branch && <p>📚 {formData.branch} /📅 {formData.year} year</p>}
                        {isOwner && formData.dob && <p>📅 {formData.dob}</p>}

                        
                      </div>
                    </div>
                  )}
                </div>

                {!editMode ? (
                  <div className="mt-6 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="mb-3 flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-indigo-600" />
                      <h3 className="font-semibold text-sm">Profile Essentials</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300">
                      {essentials.map((item) => (
                        <p key={item.label}>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{item.label}:</span> {item.value}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {!isPrivateProfile && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Social Links</h3>
                  {editMode ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-slate-600">LeetCode URL</label>
                      <Input
                        name="leetcode"
                        type="url"
                        value={formData.leetcode}
                        onChange={handleChange}
                        placeholder="LeetCode URL"
                        className="w-full"
                      />
                      <label className="block text-xs font-medium text-slate-600">GitHub URL</label>
                      <Input
                        name="github"
                        type="url"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="GitHub URL"
                        className="w-full"
                      />
                      <label className="block text-xs font-medium text-slate-600">LinkedIn URL</label>
                      <Input
                        name="linkedin"
                        type="url"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn URL"
                        className="w-full"
                      />
                      <label className="block text-xs font-medium text-slate-600">Twitter URL</label>
                      <Input
                        name="twitter"
                        type="url"
                        value={formData.twitter}
                        onChange={handleChange}
                        placeholder="Twitter URL"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.leetcode && (
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 mr-2" />
                          <a href={formData.leetcode} className="text-indigo-600 hover:underline truncate">
                            LeetCode
                          </a>
                        </div>
                      )}
                      {formData.github && (
                        <div className="flex items-center text-sm">
                          <Github className="w-4 h-4 mr-2" />
                          <a href={formData.github} className="text-indigo-600 hover:underline truncate">
                            GitHub
                          </a>
                        </div>
                      )}
                      {formData.linkedin && (
                        <div className="flex items-center text-sm">
                          <Linkedin className="w-4 h-4 mr-2" />
                          <a href={formData.linkedin} className="text-indigo-600 hover:underline truncate">
                            LinkedIn
                          </a>
                        </div>
                      )}
                      {formData.twitter && (
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 mr-2" />
                          <a href={formData.twitter} className="text-indigo-600 hover:underline truncate">
                            Twitter
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                )}

                <div className="mt-6">
                  <h3 className="font-medium mb-2">{isOwner ? 'Skills & Interests' : 'Top Stack'}</h3>
                  {editMode ? (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-slate-600">Languages</label>
                      <Input
                        value={formData.languages.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'languages')}
                        placeholder="Languages (comma separated)"
                        className="w-full"
                      />
                      <label className="block text-xs font-medium text-slate-600">Interests</label>
                      <Input
                        value={formData.interests.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'interests')}
                        placeholder="Interests (comma separated)"
                        className="w-full"
                      />
                      <p className="text-xs text-slate-500">Use comma to separate values (e.g. JavaScript, React, DSA)</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(isOwner ? [...formData.languages, ...formData.interests] : combinedTags.slice(0, 6)).map((item: string, i: number) => (
                        <Badge key={`${item}-${i}`} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  )}
                  
                </div>
                
              </CardContent>
            </Card>

            {/* Full User Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-gray-800 shadow-md">
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Mocks Played</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{summary?.stats.totalMocksPlayed ?? 0}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Quizzes Played</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{summary?.stats.totalQuizzesPlayed ?? 0}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Followers</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{followerCount}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Achievements</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{summary?.stats.certificates ?? userAchievements.length}</p>
                    </div>
                  </div>

                  {isOwner ? (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="mb-3 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-indigo-600" />
                        <h3 className="font-semibold text-sm">Best Scores</h3>
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
                        <h3 className="font-semibold text-sm">Stack & Wins</h3>
                      </div>
                      {topTags.length ? (
                        <div className="flex flex-wrap gap-2">
                          {topTags.map((item: string, index: number) => (
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
                              {featuredTopWin ? (
                                <Badge variant="secondary" className="capitalize">
                                  #1 {featuredTopWin.kind}
                                </Badge>
                              ) : null}
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
                          {latestAchievements.map((achievement: any, idx: number) => (
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
                        <div className="flex items-center gap-2 mb-3">
                          <UserCircle className="h-4 w-4 text-indigo-600" />
                          <h3 className="font-semibold text-sm">Overview</h3>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          <p>{[formData.college, formData.branch, formData.year].filter(Boolean).join(' • ') || 'No academic details shared.'}</p>
                          <p>{formData.bio || 'No bio added yet.'}</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-3">
                          <BadgeCheck className="h-4 w-4 text-indigo-600" />
                          <h3 className="font-semibold text-sm">Highlights</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {combinedTags.slice(0, 8).length ? combinedTags.slice(0, 8).map((item: string, index: number) => (
                            <Badge key={`${item}-${index}`} variant="outline">{item}</Badge>
                          )) : <p className="text-sm text-slate-500">No highlights shared.</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isPrivateProfile && isOwner ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                      <div className="mb-3 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-indigo-600" />
                        <h3 className="font-semibold text-sm">Old Participants You Played With</h3>
                      </div>
                      <div className="space-y-2 max-h-80 overflow-auto pr-1">
                        {summaryLoading ? (
                          <p className="text-slate-500 text-sm">Loading participants...</p>
                        ) : summary?.participants?.length ? (
                          summary.participants.map((participant) => (
                            <Link
                              key={participant.id}
                              href={participant.profileUrl}
                              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                              {participant.image ? (
                                <img
                                  src={participant.image}
                                  alt={participant.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
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
                  ) : null}

                  {isPrivateProfile ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700">
                      This user has kept detailed activity private.
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;