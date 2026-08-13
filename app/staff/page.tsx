"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

import { getOrders } from "@/services/order.service";
import { Order } from "@/types/order";

export default function StaffPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error("Load staff orders error:", error);
    } finally {
      setLoading(false);
    }
  }

  const pending = orders.filter(
    (order) => order.status === "pending"
  );

  const preparing = orders.filter(
    (order) => order.status === "preparing"
  );

  const ready = orders.filter(
    (order) => order.status === "ready"
  );

  const completed = orders.filter(
    (order) => order.status === "completed"
  );

  return (
    <main className="min-h-screen bg-[#0b0f17] p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            Staff Management
          </p>

          <h1 className="text-3xl font-bold text-white">
            Tổng quan
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Theo dõi và xử lý các đơn hàng của nhà hàng.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Chờ xác nhận"
            value={pending.length}
            icon={Clock3}
          />

          <StatCard
            title="Đang chế biến"
            value={preparing.length}
            icon={UtensilsCrossed}
          />

          <StatCard
            title="Đã sẵn sàng"
            value={ready.length}
            icon={ClipboardList}
          />

          <StatCard
            title="Hoàn thành"
            value={completed.length}
            icon={CheckCircle2}
          />

        </div>

        {/* Orders */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="font-bold text-white">
                Đơn hàng gần đây
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Các đơn hàng mới nhất
              </p>
            </div>

            <Link
              href="/staff/orders"
              className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Đang tải đơn hàng...
            </p>
          ) : orders.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Chưa có đơn hàng.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/staff/orders?id=${order.id}`}
                  className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-cyan-500/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">
                      #{order.order_code}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.table?.table_name ||
                        order.table?.table_code ||
                        "Không xác định bàn"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    <span className="text-sm font-bold text-cyan-400">
                      {Number(order.total).toLocaleString("vi-VN")}đ
                    </span>

                    <StatusBadge status={order.status} />

                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
          <Icon className="h-5 w-5" />
        </div>

      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const config: Record<
    string,
    { label: string; className: string }
  > = {
    pending: {
      label: "Chờ xác nhận",
      className: "bg-yellow-500/10 text-yellow-400",
    },
    confirmed: {
      label: "Đã xác nhận",
      className: "bg-blue-500/10 text-blue-400",
    },
    preparing: {
      label: "Đang chế biến",
      className: "bg-orange-500/10 text-orange-400",
    },
    ready: {
      label: "Đã sẵn sàng",
      className: "bg-green-500/10 text-green-400",
    },
    served: {
      label: "Đã phục vụ",
      className: "bg-purple-500/10 text-purple-400",
    },
    completed: {
      label: "Hoàn thành",
      className: "bg-emerald-500/10 text-emerald-400",
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-red-500/10 text-red-400",
    },
  };

  const item = config[status] || {
    label: status,
    className: "bg-slate-500/10 text-slate-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}