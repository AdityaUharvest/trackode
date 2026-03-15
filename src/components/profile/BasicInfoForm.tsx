import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ProfileFormData } from './types';

type BasicInfoFormProps = {
  open: boolean;
  formData: ProfileFormData;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function BasicInfoForm({ open, formData, onChange }: BasicInfoFormProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Full Name</label>
        <Input name="name" value={formData.name} onChange={onChange} placeholder="Enter full name" className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
        <Input name="email" type="email" value={formData.email} onChange={onChange} placeholder="name@example.com" className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Profile Photo URL</label>
        <Input name="image" value={formData.image} onChange={onChange} placeholder="https://..." className="w-full" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Bio</label>
        <Textarea name="bio" value={formData.bio} onChange={onChange} placeholder="Write a short bio" className="min-h-[90px]" />
      </div>
    </div>
  );
}
