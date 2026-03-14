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

  // Security default: no allow-list means no one is treated as super admin.
  if (allowList.length === 0) {
    return false;
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
