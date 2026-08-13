"use client";

import { useMemo, useState } from "react";
import { Utensils, Search, X } from "lucide-react";
import ProductCard from "@/components/customer/ProductCard";
import { Product } from "@/types/product";

interface Props {
  products: Product[];
}

export default function ProductMenu({ products }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Tách danh sách category duy nhất từ danh sách sản phẩm
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    products.forEach((product) => {
      if (product.category) {
        map.set(product.category.id, product.category);
      }
    });
    return Array.from(map.values());
  }, [products]);

  // Lọc sản phẩm theo danh mục VÀ từ khóa tìm kiếm
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === "all" || product.category_id === selectedCategory;

      const matchSearch =
        searchQuery.trim() === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <>
      {/* Search Bar & Category Navigation Area */}
      <div className="sticky top-[65px] z-20 -mx-4 space-y-3 bg-slate-50/95 px-4 py-2.5 backdrop-blur-md sm:mx-0 sm:px-0">
        
        {/* Ô tìm kiếm món ăn */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên món ăn..."
            className="w-full rounded-2xl border border-slate-200/80 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {/* Nút "Tất cả" */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "border border-slate-200/70 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Tất cả
            <span
              className={`ml-1.5 text-[10px] ${
                selectedCategory === "all" ? "text-slate-300" : "text-slate-400"
              }`}
            >
              ({products.length})
            </span>
          </button>

          {/* Danh sách các danh mục */}
          {categories.map((category) => {
            const count = products.filter(
              (p) => p.category_id === category.id
            ).length;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
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
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid danh sách món ăn */}
      {filteredProducts.length > 0 ? (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Trạng thái trống (không tìm thấy món) */
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Utensils className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            Không tìm thấy món ăn
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-[250px]">
            {searchQuery
              ? `Không có kết quả nào phù hợp với từ khóa "${searchQuery}".`
              : "Danh mục này hiện chưa có món ăn nào khả dụng."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>
      )}
    </>
  );
}