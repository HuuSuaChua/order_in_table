"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function OrderSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Tìm mã đơn hoặc tên bàn..."
        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
      />
    </div>
  );
}