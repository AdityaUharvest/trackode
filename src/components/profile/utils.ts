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
  const holderFontSize = holderName.length > 28 ? 42 : holderName.length > 20 ? 52 : 62;
  const eventFontSize = (achievement.quizTitle || 'Mock Test').length > 34 ? 32 : 40;
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
  <rect width="1400" height="990" fill="#f8fafc" />
  <rect x="36" y="36" width="1328" height="918" rx="20" fill="#ffffff" stroke="#0f172a" stroke-width="2" />

  <rect x="92" y="90" width="1216" height="120" rx="12" fill="#0f172a" />
  <rect x="122" y="116" width="68" height="68" rx="12" fill="#ffffff" />
  <image href="${logoDataUrl}" x="132" y="126" width="48" height="48" preserveAspectRatio="xMidYMid meet" />
  <text x="214" y="138" font-family="Arial, sans-serif" font-size="18" fill="#cbd5e1" letter-spacing="2">TRACKODE</text>
  <text x="214" y="177" font-family="Georgia, serif" font-size="38" fill="#ffffff">Certificate of Achievement</text>
  <text x="1274" y="140" text-anchor="end" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1">ID: ${escapeXml(certId)}</text>
  <text x="1274" y="168" text-anchor="end" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1">Issued: ${escapeXml(issueDate)}</text>

  <text x="700" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#334155">This certificate is awarded to</text>
  <text x="700" y="374" text-anchor="middle" font-family="Georgia, serif" font-size="${holderFontSize}" fill="#0f172a">${escapeXml(holderName)}</text>
  <line x1="420" y1="400" x2="980" y2="400" stroke="#cbd5e1" stroke-width="1.5" />

  <text x="700" y="452" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#334155">for performance in</text>
  <text x="700" y="506" text-anchor="middle" font-family="Georgia, serif" font-size="${eventFontSize}" fill="#0f172a">${escapeXml(achievement.quizTitle || 'Mock Test')}</text>

  <rect x="140" y="548" width="810" height="228" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="184" y="610" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#0f172a">${escapeXml(rankLabel)}</text>
  <text x="184" y="652" font-family="Arial, sans-serif" font-size="22" fill="#334155">Status: ${escapeXml(badgeLabel)}</text>
  <text x="184" y="694" font-family="Arial, sans-serif" font-size="22" fill="#334155">Score: ${achievement.score || 0}/${achievement.totalQuestions || 0}</text>
  <text x="184" y="736" font-family="Arial, sans-serif" font-size="22" fill="#334155">Accuracy: ${achievement.percentage || 0}%</text>

  <rect x="980" y="548" width="280" height="280" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
  <image href="${qrDataUrl}" x="1020" y="588" width="200" height="200" />
  <text x="1120" y="810" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#475569">Scan to verify</text>

  <text x="140" y="845" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Verification URL: ${escapeXml(verifyUrl)}</text>

  <line x1="170" y1="886" x2="510" y2="886" stroke="#334155" stroke-width="1.8" />
  <text x="340" y="872" text-anchor="middle" font-family="Brush Script MT, Lucida Handwriting, cursive" font-size="34" fill="#0f172a">/s/ Rohit Kumar Yadav</text>
  <text x="340" y="922" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" fill="#0f172a">Rohit Kumar Yadav</text>
  <text x="340" y="944" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#64748b">Chief Technology Officer</text>

  <line x1="890" y1="886" x2="1230" y2="886" stroke="#334155" stroke-width="1.8" />
  <text x="1060" y="872" text-anchor="middle" font-family="Brush Script MT, Lucida Handwriting, cursive" font-size="34" fill="#0f172a">/s/ Aditya upadhyay</text>
  <text x="1060" y="922" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" fill="#0f172a">Aditya upadhyay</text>
  <text x="1060" y="944" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#64748b">Chief Executive Officer</text>
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
