import { formatProfileDate } from "./utils";

type ProfileParticipantsCardProps = {
  totalParticipants: number;
  joinedOn?: string | Date | null;
  publicProfile: boolean;
};

export function ProfileParticipantsCard({ totalParticipants, joinedOn, publicProfile }: ProfileParticipantsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Public Snapshot</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Profile visibility</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            publicProfile
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {publicProfile ? "Public" : "Private"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">
          <p className="text-sm text-slate-500">Participants reached</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{totalParticipants}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">
          <p className="text-sm text-slate-500">Joined</p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{formatProfileDate(joinedOn)}</p>
        </div>
      </div>
    </div>
  );
}
