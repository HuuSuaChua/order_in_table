"use client";

import {
  Clock3,
  Eye,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import {
  Order,
  OrderStatus,
} from "@/types/order";

interface Props {
  order: Order;

  onView: (
    order: Order
  ) => void;

  onStatusChange: (
    order: Order,
    status: OrderStatus
  ) => void;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Chờ xử lý",
    className:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },

  confirmed: {
    label: "Đã xác nhận",
    className:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },

  preparing: {
    label: "Đang chuẩn bị",
    className:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },

  ready: {
    label: "Sẵn sàng",
    className:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },

  served: {
    label: "Đã phục vụ",
    className:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
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

const nextStatus: Partial<
  Record<OrderStatus, OrderStatus>
> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "served",
  served: "completed",
};

export default function OrderCard({
  order,
  onView,
  onStatusChange,
}: Props) {
  const status =
    statusConfig[order.status];

  const next = nextStatus[order.status];

  const itemCount =
    order.items?.reduce(
      (total, item) =>
        total + item.quantity,
      0
    ) ?? 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">
            #{order.order_code}
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />

            {order.table?.table_name ||
              order.table?.table_code ||
              "Không xác định"}
          </div>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-950/60 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShoppingBag className="h-3.5 w-3.5" />
            Số món
          </div>

          <p className="mt-1 font-bold text-white">
            {itemCount}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/60 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            Thời gian
          </div>

          <p className="mt-1 text-xs font-semibold text-white">
            {new Date(
              order.created_at
            ).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-sm text-slate-500">
          Tổng tiền
        </span>

        <span className="text-lg font-bold text-cyan-400">
          {Number(
            order.total
          ).toLocaleString("vi-VN")}
          đ
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onView(order)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Eye className="h-4 w-4" />
          Chi tiết
        </button>

        {next && (
          <button
            type="button"
            onClick={() =>
              onStatusChange(
                order,
                next
              )
            }
            className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-xs font-semibold text-white hover:bg-cyan-400"
          >
            {status.label === "Chờ xử lý"
              ? "Xác nhận"
              : status.label ===
                "Đã xác nhận"
              ? "Bắt đầu làm"
              : status.label ===
                "Đang chuẩn bị"
              ? "Sẵn sàng"
              : status.label ===
                "Sẵn sàng"
              ? "Đã phục vụ"
              : "Hoàn thành"}
          </button>
        )}
      </div>
    </div>
  );
}