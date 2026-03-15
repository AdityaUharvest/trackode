import QRCode from 'qrcode';
import type { CertificateAchievement, ProfileFormData, ProfileUser, TopFinishTier } from './types';

export function createInitialProfileFormData(user: ProfileUser): ProfileFormData {
  return {
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
    image: user.image || '',
  };
}

export function formatProfileDate(value?: string | Date) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

export function getInitials(value?: string) {
  if (!value) return 'U';
  const parts = value.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'U';
}

export function getOrdinal(rank: number) {
  const mod10 = rank % 10;
  const mod100 = rank % 100;
  if (mod10 === 1 && mod100 !== 11) return `${rank}st`;
  if (mod10 === 2 && mod100 !== 12) return `${rank}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${rank}rd`;
  return `${rank}th`;
}

export function getTopFinishTier(count: number): TopFinishTier {
  if (count >= 12) return { label: 'Legend', stars: 5, tone: 'text-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (count >= 8) return { label: 'Diamond', stars: 4, tone: 'text-sky-500', chip: 'bg-sky-50 text-sky-700 border-sky-200' };
  if (count >= 5) return { label: 'Gold', stars: 3, tone: 'text-yellow-500', chip: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
  if (count >= 3) return { label: 'Silver', stars: 2, tone: 'text-slate-500', chip: 'bg-slate-100 text-slate-700 border-slate-200' };
  if (count >= 1) return { label: 'Bronze', stars: 1, tone: 'text-orange-500', chip: 'bg-orange-50 text-orange-700 border-orange-200' };
  return { label: 'Unranked', stars: 0, tone: 'text-slate-300', chip: 'bg-slate-50 text-slate-500 border-slate-200' };
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function downloadProfileCertificate(achievement: CertificateAchievement, user: ProfileUser) {
  if (typeof window === 'undefined') return;

  const holderName = user?.name || user?.email || 'Participant';
  const rank = Number(achievement.rank || 0);
  const rankLabel = achievement.positionLabel || `${getOrdinal(rank)} Position`;
  const badgeLabel = achievement.badgeLabel || (rank > 0 && rank <= 3 ? 'Winner' : 'Participant');
  const issueDate = formatProfileDate(achievement.date);
  const fallbackCertId = `TRK-${String(achievement.quizId || achievement.quizTitle || 'mock').replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}-${String(user?._id || 'user').slice(-6).toUpperCase()}`;
  const certId = achievement.certificateId || fallbackCertId;
  const verifyUrl = `${window.location.origin}/certificate/verify/${encodeURIComponent(certId)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 220 });
  let logoDataUrl = `${window.location.origin}/logo.png`;

  try {
    const logoResponse = await fetch('/logo.png', { cache: 'force-cache' });
    if (logoResponse.ok) {
      const logoBlob = await logoResponse.blob();
      logoDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result || logoDataUrl));
        reader.onerror = () => reject(new Error('Could not read logo'));
        reader.readAsDataURL(logoBlob);
      });
    }
  } catch {
    // Keep URL fallback when local file read fails.
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="990" viewBox="0 0 1400 990">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="65%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#dbeafe" />
    </linearGradient>
    <linearGradient id="topBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
  </defs>
  <rect width="1400" height="990" fill="url(#bg)" />
  <rect x="28" y="28" width="1344" height="934" rx="26" fill="none" stroke="#1e293b" stroke-width="3" />
  <rect x="60" y="60" width="1280" height="140" rx="20" fill="url(#topBar)" filter="url(#softShadow)" />
  <rect x="92" y="88" width="84" height="84" rx="20" fill="#ffffff" opacity="0.98" />
  <image href="${logoDataUrl}" x="102" y="98" width="64" height="64" preserveAspectRatio="xMidYMid meet" />
  <text x="198" y="122" font-family="Arial, sans-serif" font-size="20" fill="#bfdbfe" letter-spacing="2">TRACKODE</text>
  <text x="198" y="163" font-family="Georgia, serif" font-size="38" fill="#ffffff">Certificate of Achievement</text>
  <text x="1240" y="127" text-anchor="end" font-family="Arial, sans-serif" font-size="16" fill="#dbeafe">CERTIFICATE ID</text>
  <text x="1240" y="155" text-anchor="end" font-family="Courier New, monospace" font-size="18" fill="#ffffff">${escapeXml(certId)}</text>
  <circle cx="180" cy="300" r="90" fill="#ffffff" opacity="0.45" />
  <circle cx="1230" cy="330" r="110" fill="#ffffff" opacity="0.35" />
  <text x="700" y="286" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#334155">This certificate is proudly presented to</text>
  <text x="700" y="366" text-anchor="middle" font-family="Georgia, serif" font-size="64" fill="#0f172a">${escapeXml(holderName)}</text>
  <text x="700" y="426" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#334155">for outstanding performance in</text>
  <text x="700" y="484" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="#1e293b">${escapeXml(achievement.quizTitle || 'Mock Test')}</text>
  <rect x="160" y="536" width="780" height="190" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)" />
  <rect x="190" y="570" width="220" height="58" rx="29" fill="url(#gold)" />
  <text x="300" y="608" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#78350f">${escapeXml(badgeLabel)}</text>
  <text x="460" y="607" font-family="Arial, sans-serif" font-size="30" fill="#0f172a">${escapeXml(rankLabel)}</text>
  <text x="190" y="674" font-family="Arial, sans-serif" font-size="25" fill="#0f172a">Score: ${achievement.score || 0}/${achievement.totalQuestions || 0}</text>
  <text x="520" y="674" font-family="Arial, sans-serif" font-size="25" fill="#0f172a">Accuracy: ${achievement.percentage || 0}%</text>
  <rect x="980" y="536" width="260" height="260" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)" />
  <image href="${qrDataUrl}" x="1010" y="566" width="200" height="200" />
  <text x="1110" y="785" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" fill="#475569">Scan to verify certificate</text>
  <text x="160" y="778" font-family="Arial, sans-serif" font-size="21" fill="#334155">Issued on: ${escapeXml(issueDate)}</text>
  <text x="160" y="806" font-family="Arial, sans-serif" font-size="15" fill="#64748b">Verification URL: ${escapeXml(verifyUrl)}</text>
  <line x1="190" y1="866" x2="560" y2="866" stroke="#334155" stroke-width="2" />
  <text x="190" y="852" font-family="Brush Script MT, Lucida Handwriting, cursive" font-size="36" fill="#1e293b">/s/ Rohit Kumar Yadav</text>
  <text x="190" y="902" font-family="Arial, sans-serif" font-size="24" fill="#0f172a">Rohit Kumar Yadav</text>
  <text x="190" y="930" font-family="Arial, sans-serif" font-size="19" fill="#475569">Chief Technology Officer</text>
  <line x1="840" y1="866" x2="1210" y2="866" stroke="#334155" stroke-width="2" />
  <text x="840" y="852" font-family="Brush Script MT, Lucida Handwriting, cursive" font-size="36" fill="#1e293b">/s/ Aditya upadhyay</text>
  <text x="840" y="902" font-family="Arial, sans-serif" font-size="24" fill="#0f172a">Aditya upadhyay</text>
  <text x="840" y="930" font-family="Arial, sans-serif" font-size="19" fill="#475569">Chief Executive Officer</text>
</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(achievement.quizTitle || 'mock-certificate').replace(/\s+/g, '-').toLowerCase()}-${certId}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
