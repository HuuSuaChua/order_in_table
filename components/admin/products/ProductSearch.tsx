"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3 pl-12 pr-12 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}