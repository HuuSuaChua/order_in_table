"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function UserSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm theo tên hoặc email..."
        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
      />
    </div>
  );
}