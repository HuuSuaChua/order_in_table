"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { Product } from "@/types/product";
import { Category } from "@/types/category";

import ProductForm, {
  ProductFormValues,
} from "./ProductForm";

interface Props {
  open: boolean;

  product: Product | null;

  categories: Category[];

  saving: boolean;

  onClose: () => void;

  onSubmit: (
    data: ProductFormValues
  ) => Promise<void>;
}

export default function ProductModal({
  open,
  product,
  categories,
  saving,
  onClose,
  onSubmit,
}: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }
  }, [open, product]);

  if (!open) {
    return null;
  }

  const initialValues: ProductFormValues | undefined =
    product
      ? {
          category_id:
            product.category_id,

          name: product.name,

          description:
            product.description,

          price: Number(product.price),

          image_url:
            product.image_url,

          is_available:
            product.is_available,

          sort_order:
            Number(product.sort_order),
        }
      : undefined;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-[#0f1722] shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-white">
              {product
                ? "Chỉnh sửa sản phẩm"
                : "Thêm sản phẩm"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {product
                ? "Cập nhật thông tin sản phẩm"
                : "Nhập thông tin món ăn"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}

        <div className="max-h-[80vh] overflow-y-auto p-6">
          <ProductForm
            categories={categories}
            initialValues={initialValues}
            saving={saving}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}