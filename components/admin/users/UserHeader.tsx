import {
  ShieldCheck,
  Users,
} from "lucide-react";

interface Props {
  total: number;
}

export default function UserHeader({
  total,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          <ShieldCheck className="h-4 w-4" />
          Account Management
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Quản lý tài khoản
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Quản lý tài khoản Admin, Staff và Chef của nhà hàng.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
          <Users className="h-5 w-5 text-cyan-400" />
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Tổng tài khoản
          </p>

          <p className="text-lg font-bold text-white">
            {total}
          </p>
        </div>
      </div>
    </div>
  );
}