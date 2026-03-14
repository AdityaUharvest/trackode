import { auth } from '@/auth';

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) {
    return false;
  }

  const raw = process.env.SUPER_ADMIN_EMAILS || '';
  const allowList = raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  // If no allow-list is configured, keep current behavior permissive for authenticated users.
  if (allowList.length === 0) {
    return true;
  }

  return allowList.includes(email.toLowerCase());
}

export async function getSuperAdminSession() {
  const session = await auth();
  const isAllowed = isSuperAdminEmail(session?.user?.email);

  return {
    session,
    isAllowed,
  };
}
