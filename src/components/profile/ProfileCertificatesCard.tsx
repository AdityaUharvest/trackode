import { Award, Download, FileCheck } from 'lucide-react';
import type { CertificateAchievement } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ProfileCertificatesCardProps = {
  certificates: CertificateAchievement[];
  onDownload: (certificate: CertificateAchievement) => Promise<void> | void;
};

export function ProfileCertificatesCard({ certificates, onDownload }: ProfileCertificatesCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-5 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <Award className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Credentials</h3>
            <p className="text-xs text-slate-500">Official certificates earned</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {certificates.length} Total
        </span>
      </div>

      {certificates.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-800">
          <FileCheck className="h-10 w-10 text-slate-200 dark:text-slate-700" />
          <p className="mt-4 text-sm font-medium text-slate-400">No certificates earned yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {certificates.map((certificate) => (
            <div
              key={certificate.certificateId || `${certificate.quizTitle}-${certificate.date}`}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/50 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900 dark:text-slate-100">{certificate.quizTitle || 'Mock Test'}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white text-[10px] font-bold uppercase dark:bg-slate-800">
                    {certificate.positionLabel || (Number(certificate.rank) === 1 ? 'Winner' : 'Participant')}
                  </Badge>
                  <span className="text-xs text-slate-400">•</span>
                  <p className="text-[11px] font-medium text-slate-500">{certificate.badgeLabel || 'Badge Unlocked'}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(certificate)}
                className="h-9 gap-2 rounded-xl bg-white px-4 font-bold shadow-sm dark:bg-slate-900"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
