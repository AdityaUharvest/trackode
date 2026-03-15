import connectDB from '@/lib/util';
import User from '@/app/model/User';

type PageProps = {
  params: Promise<{ certificateId?: string }>;
};

function formatDate(value?: string | Date) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

export default async function CertificateVerifyPage({ params }: PageProps) {
  await connectDB();

  const resolved = await params;
  const certificateId = decodeURIComponent(resolved.certificateId || '').trim();

  let certificate: any = null;
  let holderName = '';

  if (certificateId) {
    const user = await User.findOne({
      achievements: {
        $elemMatch: {
          type: 'certificate',
          certificateId,
        },
      },
    })
      .select({ name: 1, achievements: 1 })
      .lean<any>();

    if (user) {
      holderName = user.name || 'Participant';
      certificate = (Array.isArray(user.achievements) ? user.achievements : []).find(
        (achievement: any) => achievement?.type === 'certificate' && achievement?.certificateId === certificateId
      );
    }
  }

  const isValid = Boolean(certificate);
  const rank = Number(certificate?.rank || 0);
  const badgeLabel = certificate?.badgeLabel || (rank > 0 && rank <= 3 ? 'Winner' : 'Participant');

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Trackode Certificate Verification</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {isValid ? 'Certificate Verified' : 'Certificate Not Found'}
        </h1>

        <div
          className={`mt-6 rounded-xl border p-4 ${
            isValid ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
          }`}
        >
          <p className={`text-sm font-medium ${isValid ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isValid
              ? 'This certificate is valid and issued by Trackode.'
              : 'This certificate id is invalid or has not been issued.'}
          </p>
        </div>

        <div className="mt-6 space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-medium text-slate-900">Certificate ID:</span> {certificateId || '-'}
          </p>
          {isValid ? (
            <>
              <p>
                <span className="font-medium text-slate-900">Holder:</span> {holderName}
              </p>
              <p>
                <span className="font-medium text-slate-900">Mock:</span> {certificate.quizTitle || 'Mock Test'}
              </p>
              <p>
                <span className="font-medium text-slate-900">Position:</span>{' '}
                {certificate.positionLabel || `${rank} Position`}
              </p>
              <p>
                <span className="font-medium text-slate-900">Status:</span> {badgeLabel}
              </p>
              <p>
                <span className="font-medium text-slate-900">Score:</span>{' '}
                {Number(certificate.score || 0)}/{Number(certificate.totalQuestions || 0)} ({Number(certificate.percentage || 0)}%)
              </p>
              <p>
                <span className="font-medium text-slate-900">Issued On:</span> {formatDate(certificate.date)}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
