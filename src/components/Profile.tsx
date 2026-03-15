"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ProfileDashboard } from './profile/ProfileDashboard';
import { ProfileSidebar } from './profile/ProfileSidebar';
import { useProfileSummary } from './profile/useProfileSummary';
import type {
  CertificateAchievement,
  OpenSections,
  ProfileFormData,
  ProfileUser,
} from './profile/types';
import {
  createInitialProfileFormData,
  downloadProfileCertificate,
  formatProfileDate,
  getInitials,
  getOrdinal,
  getTopFinishTier,
} from './profile/utils';

const Profile = ({ user, isOwner = false, isPrivateProfile = false }: { user: ProfileUser; isOwner?: boolean; isPrivateProfile?: boolean }) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(createInitialProfileFormData(user));
  const [openSections, setOpenSections] = useState<OpenSections>({
    editBasic: true,
    editAcademic: true,
    personal: true,
    academic: true,
  });
  const { summary, summaryLoading } = useProfileSummary(user?._id);

  useEffect(() => {
    setFormData(createInitialProfileFormData(user));
  }, [user]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === 'public') {
      setFormData((prev) => ({ ...prev, public: value === 'true' }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (event: React.ChangeEvent<HTMLInputElement>, field: 'languages' | 'interests') => {
    const values = event.target.value.split(',').map((value) => value.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const handleSave = async () => {
    const userId = user._id;
    const updatedData = { ...formData, userId };
    setIsSaving(true);
    try {
      await axios.put('/api/profile-update', {
        updatedData,
        userId,
      });
      setEditMode(false);
      setFormData(updatedData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(createInitialProfileFormData(user));
    setEditMode(false);
  };

  const toggleOpenSection = (key: keyof OpenSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleEditMode = () => {
    if (editMode) {
      handleCancelEdit();
      return;
    }
    setEditMode(true);
  };

  const userAchievements = Array.isArray(user.achievements) ? user.achievements : [];
  const certificateAchievements = userAchievements
    .filter((achievement): achievement is CertificateAchievement => Boolean((achievement as CertificateAchievement)?.type === 'certificate'))
    .sort((left, right) => {
      const leftDate = left?.date ? new Date(left.date).getTime() : 0;
      const rightDate = right?.date ? new Date(right.date).getTime() : 0;
      return rightDate - leftDate;
    });
  const followerCount = typeof user.followerCount === 'number'
    ? user.followerCount
    : Array.isArray(user.followers)
    ? user.followers.length
    : 0;
  const userSkills = Array.isArray(user.skills) ? user.skills : [];
  const combinedTags = [...userSkills, ...formData.languages, ...formData.interests].filter(Boolean);
  const topTags = Array.from(new Set(combinedTags)).slice(0, 8);
  const latestAchievements = userAchievements.slice(0, 3);
  const topFinishTier = getTopFinishTier(summary?.stats.topFinishes ?? 0);
  const essentials = [
    { label: 'Email', value: isOwner ? formData.email || '-' : null },
    { label: 'Phone', value: isOwner ? user.phone || '-' : null },
    { label: 'College', value: formData.college || '-' },
    { label: 'Branch', value: formData.branch || '-' },
    { label: 'Year', value: formData.year || '-' },
    { label: 'Visibility', value: isOwner ? (formData.public ? 'Public' : 'Private') : null },
  ].filter((item): item is { label: string; value: string } => item.value !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ProfileSidebar
              user={user}
              formData={formData}
              isOwner={isOwner}
              isPrivateProfile={isPrivateProfile}
              editMode={editMode}
              isSaving={isSaving}
              openSections={openSections}
              essentials={essentials}
              topStack={combinedTags.slice(0, 6)}
              onToggleEdit={toggleEditMode}
              onCancelEdit={handleCancelEdit}
              onSave={handleSave}
              onChange={handleChange}
              onArrayChange={handleArrayChange}
              onToggleSection={toggleOpenSection}
            />

            <div className="space-y-6 lg:col-span-2">
              <ProfileDashboard
                isOwner={isOwner}
                isPrivateProfile={isPrivateProfile}
                summary={summary}
                summaryLoading={summaryLoading}
                followerCount={followerCount}
                userAchievementsCount={userAchievements.length}
                formData={formData}
                topTags={topTags}
                latestAchievements={latestAchievements}
                certificateAchievements={certificateAchievements}
                topFinishTier={topFinishTier}
                onDownloadCertificate={(achievement) => downloadProfileCertificate(achievement, user)}
                formatDate={formatProfileDate}
                getInitials={getInitials}
                getOrdinal={getOrdinal}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
