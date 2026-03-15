import React from 'react';
import { motion } from 'framer-motion';
import { Github, Globe, Linkedin, Edit3, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AcademicForm } from './AcademicForm';
import { BasicInfoForm } from './BasicInfoForm';
import type { OpenSections, ProfileFormData, ProfileUser } from './types';

type ProfileSidebarProps = {
  user: ProfileUser;
  formData: ProfileFormData;
  isOwner: boolean;
  isPrivateProfile: boolean;
  editMode: boolean;
  isSaving: boolean;
  openSections: OpenSections;
  essentials: Array<{ label: string; value: string | boolean }>;
  topStack: string[];
  onToggleEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onArrayChange: (event: React.ChangeEvent<HTMLInputElement>, field: 'languages' | 'interests') => void;
  onToggleSection: (key: keyof OpenSections) => void;
};

export function ProfileSidebar({
  user,
  formData,
  isOwner,
  isPrivateProfile,
  editMode,
  isSaving,
  openSections,
  essentials,
  topStack,
  onToggleEdit,
  onCancelEdit,
  onSave,
  onChange,
  onArrayChange,
  onToggleSection,
}: ProfileSidebarProps) {
  return (
    <Card className="bg-white shadow-md dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile</CardTitle>
          {isOwner ? (
            <Button onClick={onToggleEdit} variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" />
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-indigo-500 shadow-lg"
          >
            <img src={formData.image} alt="User Photo" className="h-full w-full object-cover" />
          </motion.div>

          {editMode ? (
            <div className="w-full space-y-4">
              <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onToggleSection('editBasic')}
                  className="flex w-full items-center justify-between text-left"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Basic Info</p>
                  <span className="text-sm font-semibold text-slate-500">{openSections.editBasic ? '▴' : '▾'}</span>
                </button>
                <BasicInfoForm open={openSections.editBasic} formData={formData} onChange={onChange} />
              </div>

              <div className="space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onToggleSection('editAcademic')}
                  className="flex w-full items-center justify-between text-left"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Academic</p>
                  <span className="text-sm font-semibold text-slate-500">{openSections.editAcademic ? '▴' : '▾'}</span>
                </button>
                <AcademicForm open={openSections.editAcademic} formData={formData} onChange={onChange} />
              </div>

              <div className="flex gap-2">
                <Button onClick={onCancelEdit} variant="outline" className="w-full" disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={onSave} className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSaving}>
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
                {formData.college ? <p>🎓 {formData.college}</p> : null}
                {formData.branch ? <p>📚 {formData.branch} /📅 {formData.year} year</p> : null}
                {isOwner && formData.dob ? <p>📅 {formData.dob}</p> : null}
              </div>
            </div>
          )}
        </div>

        {!editMode ? (
          <div className="mt-6 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold">Profile Essentials</h3>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300">
              {essentials.map((item) => (
                <p key={item.label}>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{item.label}:</span> {String(item.value)}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {!isPrivateProfile ? (
          <div className="mt-6">
            <h3 className="mb-2 font-medium">Social Links</h3>
            {editMode ? (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600">LeetCode URL</label>
                <Input name="leetcode" type="url" value={formData.leetcode} onChange={onChange} placeholder="LeetCode URL" className="w-full" />
                <label className="block text-xs font-medium text-slate-600">GitHub URL</label>
                <Input name="github" type="url" value={formData.github} onChange={onChange} placeholder="GitHub URL" className="w-full" />
                <label className="block text-xs font-medium text-slate-600">LinkedIn URL</label>
                <Input name="linkedin" type="url" value={formData.linkedin} onChange={onChange} placeholder="LinkedIn URL" className="w-full" />
                <label className="block text-xs font-medium text-slate-600">Twitter URL</label>
                <Input name="twitter" type="url" value={formData.twitter} onChange={onChange} placeholder="Twitter URL" className="w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {formData.leetcode ? (
                  <div className="flex items-center text-sm">
                    <Globe className="mr-2 h-4 w-4" />
                    <a href={formData.leetcode} className="truncate text-indigo-600 hover:underline">LeetCode</a>
                  </div>
                ) : null}
                {formData.github ? (
                  <div className="flex items-center text-sm">
                    <Github className="mr-2 h-4 w-4" />
                    <a href={formData.github} className="truncate text-indigo-600 hover:underline">GitHub</a>
                  </div>
                ) : null}
                {formData.linkedin ? (
                  <div className="flex items-center text-sm">
                    <Linkedin className="mr-2 h-4 w-4" />
                    <a href={formData.linkedin} className="truncate text-indigo-600 hover:underline">LinkedIn</a>
                  </div>
                ) : null}
                {formData.twitter ? (
                  <div className="flex items-center text-sm">
                    <Globe className="mr-2 h-4 w-4" />
                    <a href={formData.twitter} className="truncate text-indigo-600 hover:underline">Twitter</a>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-6">
          <h3 className="mb-2 font-medium">{isOwner ? 'Skills & Interests' : 'Top Stack'}</h3>
          {editMode ? (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600">Languages</label>
              <Input
                value={formData.languages.join(', ')}
                onChange={(event) => onArrayChange(event, 'languages')}
                placeholder="Languages (comma separated)"
                className="w-full"
              />
              <label className="block text-xs font-medium text-slate-600">Interests</label>
              <Input
                value={formData.interests.join(', ')}
                onChange={(event) => onArrayChange(event, 'interests')}
                placeholder="Interests (comma separated)"
                className="w-full"
              />
              <p className="text-xs text-slate-500">Use comma to separate values (e.g. JavaScript, React, DSA)</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(isOwner ? [...formData.languages, ...formData.interests] : topStack).map((item, index) => (
                <Badge key={`${item}-${index}`} variant="outline">{item}</Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
