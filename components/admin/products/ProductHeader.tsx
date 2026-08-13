"use client";

import { Plus, UtensilsCrossed } from "lucide-react";

interface Props {
  onAdd: () => void;
}

export default function ProductHeader({
  onAdd,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
            <UtensilsCrossed className="h-6 w-6 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Quản lý sản phẩm
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Quản lý món ăn và sản phẩm trong menu
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
      >
        <Plus className="h-5 w-5" />

        Thêm sản phẩm
      </button>
    </div>
  );
}