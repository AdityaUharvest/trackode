import React from 'react';
import { Input } from '@/components/ui/input';
import type { ProfileFormData } from './types';

type AcademicFormProps = {
  open: boolean;
  formData: ProfileFormData;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export function AcademicForm({ open, formData, onChange }: AcademicFormProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Date Of Birth</label>
        <Input name="dob" type="date" value={formData.dob} onChange={onChange} className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">College</label>
        <Input name="college" value={formData.college} onChange={onChange} placeholder="College name" className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Branch</label>
        <Input name="branch" value={formData.branch} onChange={onChange} placeholder="Branch" className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Year</label>
        <Input name="year" value={formData.year} onChange={onChange} placeholder="e.g. 3rd" className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Profile Visibility</label>
        <select
          name="public"
          value={String(formData.public)}
          onChange={onChange}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="true">Public</option>
          <option value="false">Private</option>
        </select>
      </div>
    </div>
  );
}
