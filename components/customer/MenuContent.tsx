"use client";

import { useMemo, useState } from "react";
import { Utensils } from "lucide-react";

import ProductCard from "@/components/customer/ProductCard";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface Props {
  products: Product[];
  categories: Category[];
}

export default function MenuContent({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const activeCategories = useMemo(() => {
    return categories.filter((category) => category.is_active);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return products;
    }

    return products.filter(
      (product) => product.category_id === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <>
      {/* =========================
          Categories Horizontal Scroll
      ========================= */}
      <div className="sticky top-[65px] z-20 -mx-4 mb-6 bg-slate-50/95 px-4 py-2 backdrop-blur-md sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {/* Nút "Tất cả" */}
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
              selectedCategory === null
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "border border-slate-200/70 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Tất cả
            <span
              className={`ml-1.5 text-[10px] ${
                selectedCategory === null ? "text-slate-300" : "text-slate-400"
              }`}
            >
              ({products.length})
            </span>
          </button>

          {/* Danh sách Categories */}
          {activeCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const categoryCount = products.filter(
              (p) => p.category_id === category.id
            ).length;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "border border-slate-200/70 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {category.name}
                <span
                  className={`ml-1.5 text-[10px] ${
                    isSelected ? "text-slate-300" : "text-slate-400"
                  }`}
                >
                  ({categoryCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================
          Products Grid / Empty State
      ========================= */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Utensils className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            Chưa có món ăn
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-[250px]">
            Danh mục này hiện chưa có món ăn nào khả dụng. Vui lòng chọn danh mục khác.
          </p>
        </div>
      )}
    </>
  );
}