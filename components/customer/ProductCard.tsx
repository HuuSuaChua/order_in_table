"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";

import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cart.store";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  
  // Lấy số lượng món này đã có trong giỏ hàng (nếu có)
  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.product_id === product.id)
  );
  const currentQuantity = cartItem?.quantity || 0;

  function handleAdd() {
    addItem(product);

    // Kích hoạt phản hồi nhanh khi thêm thành công
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 600);
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50">
      <div>
        {/* Aspect ratio chuẩn ảnh món ăn */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={product.image_url || "/images/food-placeholder.jpg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Badge Category */}
          {product.category?.name && (
            <span className="absolute left-3 top-3 rounded-lg bg-slate-900/75 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-md">
              {product.category.name}
            </span>
          )}

          {/* Badge hiển thị số lượng món này đang có trong giỏ */}
          {currentQuantity > 0 && (
            <span className="absolute right-3 top-3 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-black text-white shadow-md ring-2 ring-white">
              x{currentQuantity}
            </span>
          )}
        </div>

        {/* Thông tin món ăn */}
        <div className="p-4">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-amber-600">
            {product.name}
          </h3>

          <p className="mt-1 line-clamp-2 min-h-[36px] text-xs leading-relaxed text-slate-500">
            {product.description || "Chưa có mô tả chi tiết cho món ăn này."}
          </p>
        </div>
      </div>

      {/* Footer giá & Nút bấm thêm vào giỏ */}
      <div className="mt-2 border-t border-slate-100 p-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] font-medium text-slate-400">
              Giá bán
            </span>
            <span className="text-base font-extrabold text-amber-600">
              {Number(product.price).toLocaleString("vi-VN")}
              <span className="ml-0.5 text-xs font-semibold">đ</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Thêm ${product.name} vào giỏ`}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 active:scale-95 ${
              isAdded
                ? "bg-emerald-600 scale-105"
                : "bg-slate-900 hover:bg-amber-600"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 animate-in zoom-in-50" />
                <span>Đã thêm</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Thêm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}