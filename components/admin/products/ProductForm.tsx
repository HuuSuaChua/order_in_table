"use client";

import { Check } from "lucide-react";

import { Category } from "@/types/category";
import ImageUpload from "./ImageUpload";
import React from "react";

export interface ProductFormValues {
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

interface Props {
  categories: Category[];

  initialValues?: ProductFormValues;

  saving: boolean;

  onSubmit: (
    data: ProductFormValues
  ) => Promise<void>;

  onCancel: () => void;
}

export default function ProductForm({
  categories,
  initialValues,
  saving,
  onSubmit,
  onCancel,
}: Props) {
  const [categoryId, setCategoryId] =
    React.useState(
      initialValues?.category_id ?? ""
    );

  const [name, setName] =
    React.useState(
      initialValues?.name ?? ""
    );

  const [description, setDescription] =
    React.useState(
      initialValues?.description ?? ""
    );

  const [price, setPrice] =
    React.useState(
      initialValues
        ? String(initialValues.price)
        : ""
    );

  const [imageUrl, setImageUrl] =
    React.useState(
      initialValues?.image_url ?? ""
    );

  const [isAvailable, setIsAvailable] =
    React.useState(
      initialValues?.is_available ?? true
    );

  const [sortOrder, setSortOrder] =
    React.useState(
      initialValues
        ? String(initialValues.sort_order)
        : "0"
    );

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Vui lòng nhập tên sản phẩm.");
      return;
    }

    const numericPrice = Number(price);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      alert("Giá sản phẩm không hợp lệ.");
      return;
    }

    await onSubmit({
      category_id: categoryId || null,

      name: name.trim(),

      description:
        description.trim() || null,

      price: numericPrice,

      image_url:
        imageUrl || null,

      is_available: isAvailable,

      sort_order:
        Number(sortOrder) || 0,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* CATEGORY */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Danh mục
        </label>

        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value)
          }
          disabled={saving}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="">
            -- Chọn danh mục --
          </option>

          {categories
            .filter(
              (category) =>
                category.is_active
            )
            .map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
        </select>

        {categories.length === 0 && (
          <p className="mt-2 text-xs text-amber-400">
            Chưa có danh mục. Hãy tạo danh mục
            trước.
          </p>
        )}
      </div>

      {/* NAME */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Tên sản phẩm
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Ví dụ: Cơm chiên hải sản"
          disabled={saving}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* DESCRIPTION */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Mô tả
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={3}
          placeholder="Mô tả món ăn..."
          disabled={saving}
          className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* PRICE / SORT */}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Giá
          </label>

          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="45000"
            disabled={saving}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Thứ tự
          </label>

          <input
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
            disabled={saving}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* IMAGE */}

      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        disabled={saving}
      />

      {/* STATUS */}

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Trạng thái bán
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Cho phép khách hàng nhìn thấy món
          </p>
        </div>

        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) =>
            setIsAvailable(
              e.target.checked
            )
          }
          disabled={saving}
          className="h-5 w-5 accent-cyan-500"
        />
      </label>

      {/* BUTTONS */}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
        >
          Hủy
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            "Đang lưu..."
          ) : (
            <>
              <Check className="h-4 w-4" />

              {initialValues
                ? "Lưu thay đổi"
                : "Tạo sản phẩm"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}