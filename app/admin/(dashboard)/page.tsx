"use client";

import { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  Table2,
  UtensilsCrossed,
  ClipboardList,
  Wallet,
  Clock3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Package,
} from "lucide-react";

import Link from "next/link";

import { supabase } from "@/lib/supabase/client";

interface Order {
  id: string;
  order_code: string;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  note: string | null;
  table_id: string;
  created_at: string;
}

interface Table {
  id: string;
  table_name: string;
  table_code: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface DashboardData {
  tables: Table[];
  products: Product[];
  orders: Order[];
  orderItems: OrderItem[];
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Chờ xác nhận",
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },

  confirmed: {
    label: "Đã xác nhận",
    className:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },

  preparing: {
    label: "Đang chuẩn bị",
    className:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },

  ready: {
    label: "Đã sẵn sàng",
    className:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },

  served: {
    label: "Đã phục vụ",
    className:
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },

  completed: {
    label: "Hoàn thành",
    className:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },

  cancelled: {
    label: "Đã hủy",
    className:
      "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export default function AdminDashboardPage() {
  const [data, setData] =
    useState<DashboardData>({
      tables: [],
      products: [],
      orders: [],
      orderItems: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================
  // Load dashboard
  // =====================================

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const [
        tablesResponse,
        productsResponse,
        ordersResponse,
        orderItemsResponse,
      ] = await Promise.all([
        supabase
          .from("tables")
          .select(
            "id, table_name, table_code"
          ),

        supabase
          .from("products")
          .select(
            "id, name, price, is_available"
          ),

        supabase
          .from("orders")
          .select(
            `
              id,
              order_code,
              status,
              subtotal,
              discount,
              total,
              note,
              table_id,
              created_at
            `
          )
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("order_items")
          .select(
            `
              id,
              order_id,
              product_id,
              product_name,
              quantity,
              unit_price,
              subtotal
            `
          ),
      ]);

      if (tablesResponse.error) {
        throw tablesResponse.error;
      }

      if (productsResponse.error) {
        throw productsResponse.error;
      }

      if (ordersResponse.error) {
        throw ordersResponse.error;
      }

      if (orderItemsResponse.error) {
        throw orderItemsResponse.error;
      }

      setData({
        tables:
          tablesResponse.data ?? [],

        products:
          productsResponse.data ?? [],

        orders:
          (ordersResponse.data ?? []) as Order[],

        orderItems:
          (orderItemsResponse.data ??
            []) as OrderItem[],
      });
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setError(
        "Không thể tải dữ liệu dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================
  // Today's orders
  // =====================================

  const todayOrders = useMemo(() => {
    const now = new Date();

    return data.orders.filter((order) => {
      const date = new Date(
        order.created_at
      );

      return (
        date.getDate() === now.getDate() &&
        date.getMonth() ===
          now.getMonth() &&
        date.getFullYear() ===
          now.getFullYear()
      );
    });
  }, [data.orders]);

  // =====================================
  // Revenue
  // =====================================

  const todayRevenue = useMemo(() => {
    return todayOrders
      .filter(
        (order) =>
          order.status !== "cancelled"
      )
      .reduce(
        (total, order) =>
          total + Number(order.total),
        0
      );
  }, [todayOrders]);

  // =====================================
  // Pending orders
  // =====================================

  const pendingOrders = useMemo(() => {
    return data.orders.filter(
      (order) =>
        order.status === "pending"
    );
  }, [data.orders]);

  // =====================================
  // Active orders
  // =====================================

  const activeOrders = useMemo(() => {
    return data.orders.filter(
      (order) =>
        [
          "confirmed",
          "preparing",
          "ready",
          "served",
        ].includes(order.status)
    );
  }, [data.orders]);

  // =====================================
  // Top products
  // =====================================

  const topProducts = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        quantity: number;
        revenue: number;
      }
    >();

    for (const item of data.orderItems) {
      const existing =
        map.get(item.product_id);

      if (existing) {
        existing.quantity +=
          Number(item.quantity);

        existing.revenue +=
          Number(item.subtotal);
      } else {
        map.set(item.product_id, {
          name: item.product_name,
          quantity:
            Number(item.quantity),
          revenue:
            Number(item.subtotal),
        });
      }
    }

    return Array.from(map.values())
      .sort(
        (a, b) =>
          b.quantity - a.quantity
      )
      .slice(0, 5);
  }, [data.orderItems]);

  // =====================================
  // Recent orders
  // =====================================

  const recentOrders =
    data.orders.slice(0, 6);

  // =====================================
  // Format currency
  // =====================================

  function formatCurrency(
    value: number
  ) {
    return `${Number(value).toLocaleString(
      "vi-VN"
    )}đ`;
  }

  // =====================================
  // Format date
  // =====================================

  function formatDate(
    value: string
  ) {
    return new Date(value).toLocaleString(
      "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0f17] p-4 text-slate-100 md:p-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-800" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-slate-900"
              />
            ))}

          </div>

        </div>

      </main>
    );
  }

  // =====================================
  // Error
  // =====================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#0b0f17] p-4 text-slate-100 md:p-8">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">

            <XCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />

            <p className="text-sm text-red-300">
              {error}
            </p>

            <button
              onClick={loadDashboard}
              className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
            >
              Thử lại
            </button>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] p-4 font-sans text-slate-100 md:p-6 lg:p-8">

      {/* =================================
          Background
      ================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* =================================
            Header
        ================================= */}

        <div className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">

              <LayoutDashboard className="h-4 w-4" />

              Dashboard

            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">

              Tổng quan hệ thống

            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Theo dõi hoạt động nhà hàng
              trong ngày.
            </p>

          </div>

          <button
            onClick={loadDashboard}
            className="w-fit rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Làm mới dữ liệu
          </button>

        </div>

        {/* =================================
            Statistics
        ================================= */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Tables */}

          <StatCard
            title="Tổng số bàn"
            value={data.tables.length}
            description="Bàn đang quản lý"
            icon={Table2}
            href="/admin/tables"
          />

          {/* Products */}

          <StatCard
            title="Tổng số món"
            value={data.products.length}
            description={`${data.products.filter(
              (product) =>
                product.is_available
            ).length} món đang bán`}
            icon={UtensilsCrossed}
            href="/admin/products"
          />

          {/* Orders */}

          <StatCard
            title="Đơn hôm nay"
            value={todayOrders.length}
            description={`${pendingOrders.length} đơn đang chờ`}
            icon={ClipboardList}
            href="/admin/orders"
          />

          {/* Revenue */}

          <StatCard
            title="Doanh thu hôm nay"
            value={formatCurrency(
              todayRevenue
            )}
            description="Không tính đơn đã hủy"
            icon={Wallet}
            href="/admin/orders"
          />

        </div>

        {/* =================================
            Order status
        ================================= */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatusCard
            title="Chờ xác nhận"
            value={
              pendingOrders.length
            }
            icon={Clock3}
            className="text-amber-400"
          />

          <StatusCard
            title="Đang xử lý"
            value={
              data.orders.filter(
                (order) =>
                  order.status ===
                    "confirmed" ||
                  order.status ===
                    "preparing"
              ).length
            }
            icon={ClipboardList}
            className="text-blue-400"
          />

          <StatusCard
            title="Đang phục vụ"
            value={
              data.orders.filter(
                (order) =>
                  order.status ===
                    "ready" ||
                  order.status ===
                    "served"
              ).length
            }
            icon={UtensilsCrossed}
            className="text-cyan-400"
          />

          <StatusCard
            title="Hoàn thành"
            value={
              data.orders.filter(
                (order) =>
                  order.status ===
                  "completed"
              ).length
            }
            icon={CheckCircle2}
            className="text-emerald-400"
          />

        </div>

        {/* =================================
            Main content
        ================================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =================================
              Recent orders
          ================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl lg:col-span-2">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h2 className="font-bold text-white">
                  Đơn hàng gần đây
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Các đơn hàng mới nhất
                </p>

              </div>

              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                Xem tất cả

                <ArrowRight className="h-3.5 w-3.5" />

              </Link>

            </div>

            <div className="divide-y divide-slate-800">

              {recentOrders.length === 0 ? (

                <div className="p-8 text-center text-sm text-slate-500">
                  Chưa có đơn hàng.
                </div>

              ) : (

                recentOrders.map(
                  (order) => {

                    const status =
                      STATUS_CONFIG[
                        order.status
                      ] ??
                      {
                        label:
                          order.status,
                        className:
                          "bg-slate-500/10 text-slate-400 border-slate-500/20",
                      };

                    const table =
                      data.tables.find(
                        (item) =>
                          item.id ===
                          order.table_id
                      );

                    return (
                      <div
                        key={order.id}
                        className="flex flex-col gap-3 p-4 transition hover:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="font-semibold text-white">
                              #
                              {
                                order.order_code
                              }
                            </span>

                            <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                              {table
                                ?.table_code ??
                                "Không rõ bàn"}
                            </span>

                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(
                              order.created_at
                            )}
                          </p>

                        </div>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>

                          <span className="whitespace-nowrap text-sm font-bold text-cyan-400">
                            {formatCurrency(
                              Number(
                                order.total
                              )
                            )}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

          </div>

          {/* =================================
              Top products
          ================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">

            <div className="border-b border-slate-800 px-5 py-4">

              <div className="flex items-center gap-2">

                <TrendingUp className="h-4 w-4 text-cyan-400" />

                <h2 className="font-bold text-white">
                  Món bán chạy
                </h2>

              </div>

              <p className="mt-1 text-xs text-slate-500">
                Theo số lượng đã gọi
              </p>

            </div>

            <div className="p-4">

              {topProducts.length === 0 ? (

                <div className="py-8 text-center text-sm text-slate-500">
                  Chưa có dữ liệu món ăn.
                </div>

              ) : (

                <div className="space-y-3">

                  {topProducts.map(
                    (product, index) => (
                      <div
                        key={product.name}
                        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-400">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-white">
                            {product.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Đã bán{" "}
                            {
                              product.quantity
                            }{" "}
                            phần
                          </p>

                        </div>

                        <span className="text-xs font-semibold text-slate-300">
                          {formatCurrency(
                            product.revenue
                          )}
                        </span>

                      </div>
                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

        {/* =================================
            Quick actions
        ================================= */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <QuickAction
            href="/admin/tables"
            icon={Table2}
            title="Quản lý bàn"
            description="Tạo và quản lý QR"
          />

          <QuickAction
            href="/admin/products"
            icon={UtensilsCrossed}
            title="Quản lý món"
            description="Cập nhật thực đơn"
          />

          <QuickAction
            href="/admin/orders"
            icon={ClipboardList}
            title="Quản lý đơn"
            description={`${activeOrders.length} đơn đang xử lý`}
          />

          <QuickAction
            href="/admin/categories"
            icon={Package}
            title="Danh mục"
            description="Quản lý danh mục món"
          />

        </div>

      </div>

    </main>
  );
}

/* =========================================
   Stat Card
========================================= */

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  href: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
    >

      <div className="mb-4 flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Icon className="h-5 w-5" />
        </div>

        <ArrowRight className="h-4 w-4 text-slate-700 transition group-hover:text-cyan-400" />

      </div>

      <p className="text-xs font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 truncate text-xl font-bold text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </Link>
  );
}

/* =========================================
   Status Card
========================================= */

interface StatusCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  className: string;
}

function StatusCard({
  title,
  value,
  icon: Icon,
  className,
}: StatusCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/70 ${className}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>

        <p className="text-xs text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-xl font-bold text-white">
          {value}
        </p>

      </div>

    </div>
  );
}

/* =========================================
   Quick Action
========================================= */

interface QuickActionProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 transition-all hover:border-slate-700 hover:bg-slate-900"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">

        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="truncate text-xs text-slate-500">
          {description}
        </p>

      </div>

    </Link>
  );
}