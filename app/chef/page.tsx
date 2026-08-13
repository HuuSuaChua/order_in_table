"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChefHat,
  Clock,
  Flame,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { getOrders } from "@/services/order.service";
import { Order } from "@/types/order";

export default function ChefPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const confirmed = orders.filter(
    (order) => order.status === "confirmed"
  );

  const preparing = orders.filter(
    (order) => order.status === "preparing"
  );

  const ready = orders.filter(
    (order) => order.status === "ready"
  );

  return (
    <main className="min-h-screen bg-[#0b0f17] p-4 text-slate-100 md:p-8">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <div className="flex items-center gap-2 text-orange-400">
            <ChefHat className="h-5 w-5" />

            <span className="text-xs font-bold uppercase tracking-widest">
              Kitchen
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Bếp
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Theo dõi và chế biến các món ăn.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">

          <Stat
            title="Chờ chế biến"
            value={confirmed.length}
            icon={Clock}
          />

          <Stat
            title="Đang chế biến"
            value={preparing.length}
            icon={Flame}
          />

          <Stat
            title="Đã hoàn thành"
            value={ready.length}
            icon={CheckCircle2}
          />

        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-white">
                Đơn cần chế biến
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Các đơn đã được Staff xác nhận
              </p>
            </div>

            <Link
              href="/chef/orders"
              className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-400"
            >
              Vào khu vực bếp
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Đang tải...
            </p>
          ) : confirmed.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Hiện không có đơn cần chế biến.
            </p>
          ) : (
            <div className="mt-5 space-y-3">

              {confirmed.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-bold text-white">
                        #{order.order_code}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {order.table?.table_name}
                      </p>
                    </div>

                    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                      Chờ bếp
                    </span>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}

function Stat({
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

        <Icon className="h-6 w-6 text-orange-400" />

      </div>

    </div>
  );
}