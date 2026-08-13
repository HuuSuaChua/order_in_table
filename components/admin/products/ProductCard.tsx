"use client";

import {
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon,
  Tag,
} from "lucide-react";

import { Product } from "@/types/product";

interface Props {
  product: Product;

  onEdit: (
    product: Product
  ) => void;

  onDelete: (
    product: Product
  ) => void;

  onToggle: (
    product: Product
  ) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700">
      {/* IMAGE */}

      <div className="relative h-52 overflow-hidden bg-slate-950">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-slate-700" />
          </div>
        )}

        {/* STATUS */}

        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
              product.is_available
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {product.is_available
              ? "Đang bán"
              : "Ngừng bán"}
          </span>
        </div>
      </div>

      {/* CONTENT */}

      <div className="p-5">
        {/* CATEGORY */}

        {product.category?.name && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-400">
              <Tag className="h-3 w-3" />

              {product.category.name}
            </span>
          </div>
        )}

        {/* NAME + PRICE */}

        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-bold text-white">
            {product.name}
          </h3>

          <span className="whitespace-nowrap text-sm font-bold text-cyan-400">
            {Number(
              product.price
            ).toLocaleString("vi-VN")}
            đ
          </span>
        </div>

        {/* DESCRIPTION */}

        <p className="mb-4 line-clamp-2 min-h-10 text-xs leading-relaxed text-slate-400">
          {product.description ||
            "Chưa có mô tả sản phẩm."}
        </p>

        {/* ACTIONS */}

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() =>
              onToggle(product)
            }
            className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            title={
              product.is_available
                ? "Ngừng bán"
                : "Mở bán"
            }
          >
            {product.is_available ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              onEdit(product)
            }
            className="flex items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 py-2 text-blue-400 transition hover:bg-blue-500/20"
            title="Chỉnh sửa"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(product)
            }
            className="flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-red-400 transition hover:bg-red-500/20"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}