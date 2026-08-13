"use client";

import { Plus, ShoppingBag } from "lucide-react";

interface Props {
  onRefresh: () => void;
}

export default function OrderHeader({
  onRefresh,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
            <ShoppingBag className="h-5 w-5 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Quản lý đơn hàng
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Theo dõi và xử lý đơn hàng của khách
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
      >
        Làm mới
      </button>
    </div>
  );
}