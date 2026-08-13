"use client";

import { useEffect, useState } from "react";
import {
  ChefHat,
  Check,
  Flame,
  RefreshCw,
  Clock,
  UtensilsCrossed,
  AlertCircle,
  FileText,
  CookingPot,
} from "lucide-react";

import {
  getOrders,
  updateOrderStatus,
} from "@/services/order.service";

import { Order } from "@/types/order";

export default function ChefOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "confirmed" | "preparing">("all");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(
        data.filter((order) =>
          ["confirmed", "preparing"].includes(order.status)
        )
      );
    } catch (error) {
      console.error(error);
      alert("Không thể tải đơn bếp");
    } finally {
      setLoading(false);
    }
  }

  async function startCooking(order: Order) {
    try {
      setUpdatingId(order.id);
      const updated = await updateOrderStatus(order.id, "preparing");

      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id
            ? {
                ...item,
                ...updated,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);
      alert("Không thể cập nhật đơn");
    } finally {
      setUpdatingId(null);
    }
  }

  async function finishCooking(order: Order) {
    try {
      setUpdatingId(order.id);
      await updateOrderStatus(order.id, "ready");

      setOrders((prev) => prev.filter((item) => item.id !== order.id));
    } catch (error) {
      console.error(error);
      alert("Không thể hoàn thành món");
    } finally {
      setUpdatingId(null);
    }
  }

  // Thống kê số lượng
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const totalItemsCount = orders.reduce(
    (acc, o) => acc + (o.items?.reduce((iAcc, item) => iAcc + item.quantity, 0) || 0),
    0
  );

  // Lọc theo tab được chọn
  const filteredOrders = orders.filter((order) => {
    if (filter === "confirmed") return order.status === "confirmed";
    if (filter === "preparing") return order.status === "preparing";
    return true;
  });

  return (
    <main className="relative min-h-screen bg-[#0a0d14] p-4 text-slate-100 font-sans antialiased md:p-8">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-800/80 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
              <ChefHat className="h-4 w-4" />
              <span>Kitchen Display System</span>
            </div>

            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Điều Hành Bếp & Chế Biến
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Quản lý thực đơn chế biến realtime từ các đơn hàng đã xác nhận.
            </p>
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs font-bold text-slate-300 shadow-lg backdrop-blur-md transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-orange-400" : ""}`} />
            <span>Làm Mới Dữ Liệu</span>
          </button>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Chờ bếp nấu</p>
                <p className="text-xl font-black text-white">{confirmedCount} <span className="text-xs font-medium text-slate-500">đơn</span></p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Đang chế biến</p>
                <p className="text-xl font-black text-white">{preparingCount} <span className="text-xs font-medium text-slate-500">đơn</span></p>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                <CookingPot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tổng món cần làm</p>
                <p className="text-xl font-black text-white">{totalItemsCount} <span className="text-xs font-medium text-slate-500">phần</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilter("all")}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
              filter === "all"
                ? "bg-slate-100 text-slate-900 shadow-lg"
                : "border border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            Tất cả đơn ({orders.length})
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
              filter === "confirmed"
                ? "bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/20"
                : "border border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            Chờ bếp ({confirmedCount})
          </button>
          <button
            onClick={() => setFilter("preparing")}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
              filter === "preparing"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "border border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            Đang nấu ({preparingCount})
          </button>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/40" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center backdrop-blur-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 text-slate-600 mb-4">
              <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-white">Hiện không có đơn nào</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              Các đơn hàng mới sẽ xuất hiện ở đây ngay khi nhân viên phục vụ xác nhận.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredOrders.map((order) => {
              const isConfirmed = order.status === "confirmed";
              const isUpdating = updatingId === order.id;

              return (
                <div
                  key={order.id}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isConfirmed
                      ? "border-yellow-500/30 bg-slate-900/70 hover:border-yellow-500/50"
                      : "border-orange-500/40 bg-slate-900/90 shadow-xl shadow-orange-500/5 hover:border-orange-500/60"
                  }`}
                >
                  <div>
                    {/* Order Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 p-4 bg-slate-950/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black text-white">
                            #{order.order_code}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs font-bold text-cyan-400">
                          {order.table?.table_name || order.table?.table_code || "Bàn chưa chọn"}
                        </p>
                      </div>

                      {/* Status Tag */}
                      {isConfirmed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-bold text-yellow-400">
                          <Clock className="h-3 w-3 animate-pulse" />
                          <span>Chờ bếp</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[11px] font-bold text-orange-400">
                          <Flame className="h-3 w-3 animate-bounce" />
                          <span>Đang nấu</span>
                        </span>
                      )}
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-2.5 p-4">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-xl border border-slate-800/60 bg-slate-950/60 p-3 transition hover:border-slate-700/80"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="text-xs font-bold text-slate-100 truncate">
                                {item.product_name}
                              </p>
                              <span className="shrink-0 rounded-lg bg-orange-500/20 px-2 py-0.5 font-mono text-xs font-extrabold text-orange-400">
                                x{item.quantity}
                              </span>
                            </div>

                            {/* Item Level Note */}
                            {item.note && (
                              <div className="mt-1.5 flex items-center gap-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 text-[11px] text-yellow-300">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                <span className="truncate">{item.note}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Level Note */}
                    {order.note && (
                      <div className="px-4 pb-2">
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                            <FileText className="h-3 w-3" />
                            <span>Ghi chú toàn đơn</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                            {order.note}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  <div className="border-t border-slate-800/80 p-4 bg-slate-950/30">
                    {isConfirmed ? (
                      <button
                        onClick={() => startCooking(order)}
                        disabled={isUpdating}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-orange-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                      >
                        <Flame className="h-4 w-4" />
                        <span>{isUpdating ? "Đang xử lý..." : "Bắt Đầu Chế Biến"}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => finishCooking(order)}
                        disabled={isUpdating}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
                      >
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>{isUpdating ? "Đang xử lý..." : "Hoàn Thành Ra Món"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}