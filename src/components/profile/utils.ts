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
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="58%" stop-color="#e2e8f0" />
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
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
  </defs>

  <rect width="1400" height="990" fill="url(#bg)" />
  <rect x="24" y="24" width="1352" height="942" rx="28" fill="none" stroke="#1e293b" stroke-width="3" />
  <rect x="44" y="44" width="1312" height="902" rx="24" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.65" />

  <rect x="74" y="64" width="1252" height="150" rx="20" fill="url(#topBar)" filter="url(#softShadow)" />
  <rect x="106" y="96" width="86" height="86" rx="18" fill="#ffffff" opacity="0.98" />
  <image href="${logoDataUrl}" x="117" y="107" width="64" height="64" preserveAspectRatio="xMidYMid meet" />

  <text x="220" y="128" font-family="Arial, sans-serif" font-size="20" fill="#bfdbfe" letter-spacing="2.2">TRACKODE</text>
  <text x="220" y="174" font-family="Georgia, serif" font-size="40" fill="#ffffff">Certificate of Achievement</text>

  <text x="1244" y="125" text-anchor="end" font-family="Arial, sans-serif" font-size="15" fill="#cbd5e1" letter-spacing="1.4">CERTIFICATE ID</text>
  <text x="1244" y="152" text-anchor="end" font-family="Courier New, monospace" font-size="18" fill="#ffffff">${escapeXml(certId)}</text>
  <text x="1244" y="178" text-anchor="end" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1">Issued: ${escapeXml(issueDate)}</text>

  <circle cx="180" cy="306" r="96" fill="#ffffff" opacity="0.42" />
  <circle cx="1222" cy="338" r="116" fill="#ffffff" opacity="0.30" />

  <text x="700" y="302" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" fill="#334155">This certificate is proudly presented to</text>
  <text x="700" y="384" text-anchor="middle" font-family="Georgia, serif" font-size="${holderFontSize}" fill="#0f172a">${escapeXml(holderName)}</text>
  <line x1="430" y1="406" x2="970" y2="406" stroke="#94a3b8" stroke-width="1.5" opacity="0.7" />

  <text x="700" y="454" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#334155">for outstanding performance in</text>
  <text x="700" y="508" text-anchor="middle" font-family="Georgia, serif" font-size="${eventFontSize}" fill="#1e293b">${escapeXml(achievement.quizTitle || 'Mock Test')}</text>

  <rect x="148" y="544" width="786" height="230" rx="18" fill="url(#panel)" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)" />
  <rect x="182" y="580" width="230" height="56" rx="28" fill="url(#gold)" />
  <text x="297" y="616" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#78350f">${escapeXml(badgeLabel)}</text>

  <text x="446" y="618" font-family="Arial, sans-serif" font-size="31" font-weight="700" fill="#0f172a">${escapeXml(rankLabel)}</text>
  <line x1="182" y1="652" x2="900" y2="652" stroke="#dbe3ee" stroke-width="1.6" />

  <text x="186" y="698" font-family="Arial, sans-serif" font-size="24" fill="#0f172a">Score: ${achievement.score || 0}/${achievement.totalQuestions || 0}</text>
  <text x="516" y="698" font-family="Arial, sans-serif" font-size="24" fill="#0f172a">Accuracy: ${achievement.percentage || 0}%</text>
  <text x="186" y="736" font-family="Arial, sans-serif" font-size="18" fill="#475569">Verification URL</text>
  <text x="186" y="760" font-family="Arial, sans-serif" font-size="14" fill="#64748b">${escapeXml(verifyUrl)}</text>

  <rect x="958" y="544" width="294" height="294" rx="18" fill="url(#panel)" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)" />
  <image href="${qrDataUrl}" x="1005" y="588" width="200" height="200" />
  <text x="1105" y="816" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" fill="#475569">Scan to verify certificate</text>

  <line x1="172" y1="872" x2="512" y2="872" stroke="#334155" stroke-width="2" />
  <text x="342" y="858" text-anchor="middle" font-family="Brush Script MT, Lucida Handwriting, cursive" font-size="35" fill="#1e293b">/s/ Rohit Kumar Yadav</text>
  <text x="342" y="909" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#0f172a">Rohit Kumar Yadav</text>
  <text x="342" y="936" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">Chief Technology Officer</text>

  <line x1="888" y1="872" x2="1228" y2="872" stroke="#334155" stroke-width="2" />
  <text x="1058" y="858" text-anchor="middle" font-family="Brush Script MT, Lucida Handwriting, cursive" font-size="35" fill="#1e293b">/s/ Aditya upadhyay</text>
  <text x="1058" y="909" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#0f172a">Aditya upadhyay</text>
  <text x="1058" y="936" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">Chief Executive Officer</text>
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
