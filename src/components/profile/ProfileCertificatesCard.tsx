import type { CertificateAchievement } from "./types";

type ProfileCertificatesCardProps = {
  certificates: CertificateAchievement[];
  onDownload: (certificate: CertificateAchievement) => Promise<void> | void;
};

export function ProfileCertificatesCard({ certificates, onDownload }: ProfileCertificatesCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Certificates</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Earned credentials</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {certificates.length}
        </span>
      </div>

      {certificates.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700">
          No certificates earned yet.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {certificates.map((certificate) => (
            <div
              key={certificate.certificateId || `${certificate.title}-${certificate.issuedAt}`}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{certificate.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {certificate.positionLabel} · {certificate.badgeLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDownload(certificate)}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
