"use client";

import { Minus, Plus, Trash2, Pencil } from "lucide-react";
import { CartItem as CartItemType } from "@/types/order";

interface Props {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onNoteChange: (note: string) => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  onNoteChange,
}: Props) {
  const subtotal = item.quantity * Number(item.unit_price);

  return (
    <div className="group relative border-b border-slate-100 py-4 last:border-0">
      <div className="flex gap-3.5">
        {/* Hình ảnh món ăn */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
          <img
            src={item.image_url || "/images/food-placeholder.jpg"}
            alt={item.product_name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Thông tin món ăn */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h4 className="line-clamp-1 text-sm font-bold text-slate-900">
                {item.product_name}
              </h4>

              {/* Nút xóa món */}
              <button
                type="button"
                onClick={onRemove}
                title="Xóa món này"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500 active:scale-90"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-0.5 text-xs font-semibold text-amber-600">
              {Number(item.unit_price).toLocaleString("vi-VN")}
              <span className="ml-0.5 text-[10px]">đ</span>
            </p>
          </div>

          {/* Điều chỉnh số lượng & Tổng tiền món */}
          <div className="mt-2 flex items-center justify-between">
            {/* Bộ điều khiển số lượng */}
            <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-50/50 p-0.5 shadow-sm">
              <button
                type="button"
                onClick={onDecrease}
                aria-label="Giảm số lượng"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-slate-900 active:scale-90"
              >
                <Minus className="h-3 w-3" />
              </button>

              <span className="w-7 text-center text-xs font-bold text-slate-900">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                aria-label="Tăng số lượng"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-slate-900 active:scale-90"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Thành tiền món */}
            <span className="text-sm font-black text-slate-900">
              {subtotal.toLocaleString("vi-VN")}
              <span className="ml-0.5 text-xs font-semibold">đ</span>
            </span>
          </div>
        </div>
      </div>

      {/* Ô nhập ghi chú riêng từng món */}
      <div className="relative mt-2.5">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
          <Pencil className="h-3 w-3" />
        </div>
        <input
          value={item.note || ""}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Ghi chú món này (ít cay, không hành...)"
          maxLength={200}
          className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 py-1.5 pl-8 pr-3 text-[11px] text-slate-700 transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/10"
        />
      </div>
    </div>
  );
}