import { notFound } from "next/navigation";
import { UtensilsCrossed, Store } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import CartSection from "@/components/customer/cart/CartSection";

interface Props {
  params: Promise<{
    qrToken: string;
  }>;
}

export default async function TableOrderPage({ params }: Props) {
  const { qrToken } = await params;

  // ================================
  // Lấy thông tin bàn
  // ================================
  const { data: table, error: tableError } = await supabase
    .from("tables")
    .select("*")
    .eq("qr_token", qrToken)
    .single();

  if (tableError || !table) {
    console.error("Không tìm thấy bàn:", tableError);
    notFound();
  }

  // ================================
  // Lấy danh sách danh mục (categories)
  // ================================
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (categoryError) {
    console.error("Không thể lấy category:", categoryError);
  }

  // ================================
  // Lấy danh sách sản phẩm + category
  // ================================
  const { data: productsData, error: productError } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (
        id,
        name
      )
    `)
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (productError) {
    console.error("Không thể lấy danh sách sản phẩm:", productError);
  }

  const products = (productsData ?? []) as Product[];

  return (
    <main className="min-h-screen bg-slate-50/60 pb-32 font-sans text-slate-800 antialiased">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
        <div className="mx-auto max-w-5xl px-4 py-3.5 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Tên nhà hàng */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                  Ăn vặt DÌ DIỆU
                </h1>
                <p className="text-xs font-medium text-slate-500">
                  Trải nghiệm gọi món tại bàn
                </p>
              </div>
            </div>

            {/* Thông tin bàn */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{table.table_name || table.table_code}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================================ */}
      {/* Main Content Area                */}
      {/* ================================ */}
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        {/* Banner Chào Mừng */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white shadow-md shadow-orange-500/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                Thực đơn điện tử
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Xin chào quý khách! 👋
              </h2>
              <p className="mt-1 text-xs text-amber-100 sm:text-sm">
                Vui lòng chọn món ăn ưa thích bên dưới để đặt món nhanh chóng.
              </p>
            </div>
            <UtensilsCrossed className="hidden h-16 w-16 opacity-20 sm:block" />
          </div>
        </div>

        {/* Dynamic Category + Product + Cart Section */}
        <CartSection
          tableId={table.id}
          categories={categories ?? []}
          products={products}
        />
      </div>
    </main>
  );
}