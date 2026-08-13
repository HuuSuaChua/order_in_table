"use client";

import { useMemo, useState } from "react";
import { Utensils, Search, X, ShoppingBag, ArrowRight } from "lucide-react";

import CartDrawer from "./CartDrawer";
import ProductCard from "../ProductCard";

import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { useCartStore } from "@/stores/cart.store";

interface Props {
  tableId: string;
  products: Product[];
  categories: Category[];
}

export default function CartSection({
  tableId,
  products,
  categories,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartOpen, setCartOpen] = useState(false);

  // Lấy danh sách món trong giỏ
  const items = useCartStore((state) => state.items);

  const totalQuantity = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity * Number(item.unit_price),
      0
    );
  }, [items]);

  // Lọc sản phẩm theo danh mục & từ khóa tìm kiếm
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
      {/* ================================================= */}
      {/* Sticky Top Bar: Search Input & Categories          */}
      {/* ================================================= */}
      <div className="sticky top-[65px] z-20 -mx-4 space-y-3 bg-slate-50/95 px-4 py-2.5 backdrop-blur-md sm:mx-0 sm:px-0">
        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm món ăn ngon..."
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
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "border border-slate-200/70 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Tất cả ({products.length})
          </button>

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

      {/* ================================================= */}
      {/* Product Grid / Empty State                        */}
      {/* ================================================= */}
      {filteredProducts.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Utensils className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            Chưa có món ăn
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-[250px]">
            {searchQuery
              ? `Không tìm thấy món ăn nào phù hợp với từ khóa "${searchQuery}".`
              : "Danh mục này hiện chưa có món ăn khả dụng."}
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

      {/* ================================================= */}
      {/* Floating Cart Button / Bar (Luôn hiển thị)         */}
      {/* ================================================= */}
      <div className="fixed bottom-5 right-4 z-40 sm:bottom-6 sm:right-6">
        {totalQuantity > 0 ? (
          /* TRƯỜNG HỢP 1: Giỏ có món -> Hiển thị Thanh tổng tiền nổi rộng */
          <div className="fixed bottom-4 left-0 right-0 z-40 px-4 sm:px-6">
            <div className="mx-auto max-w-lg">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-900 p-3.5 text-white shadow-2xl shadow-slate-900/30 transition-all duration-300 hover:bg-amber-600 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-900 font-bold">
                    <ShoppingBag className="h-5 w-5 text-white" />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2 ring-slate-900">
                      {totalQuantity > 99 ? "99+" : totalQuantity}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-medium text-slate-300">
                      {totalQuantity} món đã chọn
                    </p>
                    <p className="text-sm font-black text-white">
                      {totalPrice.toLocaleString("vi-VN")}{" "}
                      <span className="text-xs font-normal">đ</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-sm">
                  <span>Xem giỏ món</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP 2: Giỏ trống -> Hiển thị Nút tròn giỏ hàng ở góc dưới bên phải */
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label="Mở giỏ hàng"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-900/40 transition-all duration-300 hover:bg-amber-600 active:scale-90"
          >
            <ShoppingBag className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        tableId={tableId}
      />
    </>
  );
}