import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import SuperAdminPanel from '@/components/SuperAdminPanel';
import { getSuperAdminSession } from '@/lib/superAdmin';

export const metadata: Metadata = {
  title: 'Super Admin Panel',
  description: 'Full platform control for mocks, quizzes, results, and global options.',
};

export default async function SuperAdminPage() {
  const { session, isAllowed } = await getSuperAdminSession();

  if (!session?.user) {
    redirect('/signin');
  }

  if (!isAllowed) {
    redirect('/dashboard');
  }

  return <SuperAdminPanel />;
}
