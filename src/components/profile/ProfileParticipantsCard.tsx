import { Users, Globe, Lock, Calendar } from 'lucide-react';
import { formatProfileDate } from "./utils";

type ProfileParticipantsCardProps = {
  totalParticipants: number;
  joinedOn?: string | Date | null;
  publicProfile: boolean;
};

export function ProfileParticipantsCard({ totalParticipants, joinedOn, publicProfile }: ProfileParticipantsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-5 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${publicProfile ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {publicProfile ? (
              <Globe className="h-5 w-5 text-emerald-500" />
            ) : (
              <Lock className="h-5 w-5 text-slate-500" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Visibility</h3>
            <p className="text-xs text-slate-500">{publicProfile ? 'Public highlights' : 'Private activity'}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${
            publicProfile
              ? "bg-emerald-500 text-white"
              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {publicProfile ? "Online" : "Hidden"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="group rounded-2xl bg-slate-50/50 p-4 transition-all hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reach</p>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">{totalParticipants}</p>
        </div>
        <div className="group rounded-2xl bg-slate-50/50 p-4 transition-all hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-purple-500" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Member Since</p>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{formatProfileDate(joinedOn)}</p>
        </div>
      </div>
    </div>
  );
}
