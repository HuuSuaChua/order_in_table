"use client";

import {
  Eye,
  Check,
  X,
} from "lucide-react";

import { Order, OrderStatus } from "@/types/order";

interface Props {
  order: Order;
  onView: () => void;
  onStatus: (
    id: string,
    status: OrderStatus
  ) => Promise<void>;
}

export default function OrderCard({
  order,
  onView,
  onStatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4">

        <div>
          <p className="font-bold text-white">
            #{order.order_code}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {order.table?.table_name ||
              order.table?.table_code ||
              "Không xác định"}
          </p>
        </div>

        <StatusBadge status={order.status} />

      </div>

      {/* Items */}
      <div className="space-y-2 p-4">

        {order.items?.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-3 text-sm"
          >
            <span className="text-slate-300">
              {item.product_name}
              <span className="ml-2 text-slate-500">
                x{item.quantity}
              </span>
            </span>

            <span className="font-medium text-slate-400">
              {Number(
                item.subtotal
              ).toLocaleString("vi-VN")}
              đ
            </span>
          </div>
        ))}

        {(order.items?.length || 0) > 3 && (
          <p className="text-xs text-slate-600">
            + {(order.items?.length || 0) - 3} món khác
          </p>
        )}

      </div>

      {/* Total */}
      <div className="border-t border-slate-800 p-4">

        <div className="mb-4 flex items-center justify-between">

          <span className="text-sm text-slate-500">
            Tổng cộng
          </span>

          <span className="text-lg font-bold text-cyan-400">
            {Number(order.total).toLocaleString("vi-VN")}
            đ
          </span>

        </div>

        {/* Actions */}
        <div className="flex gap-2">

          <button
            onClick={onView}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            <Eye className="h-4 w-4" />
            Chi tiết
          </button>

          {order.status === "pending" && (
            <>
              <button
                onClick={() =>
                  onStatus(
                    order.id,
                    "confirmed"
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-black hover:bg-cyan-400"
              >
                <Check className="h-4 w-4" />
                Xác nhận
              </button>

              <button
                onClick={() =>
                  onStatus(
                    order.id,
                    "cancelled"
                  )
                }
                className="rounded-xl bg-red-500/10 px-3 text-red-400 hover:bg-red-500/20"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}

          {order.status === "ready" && (
            <button
              onClick={() =>
                onStatus(
                  order.id,
                  "served"
                )
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 py-2.5 text-xs font-bold text-black hover:bg-green-400"
            >
              <Check className="h-4 w-4" />
              Đã phục vụ
            </button>
          )}

          {order.status === "served" && (
            <button
              onClick={() =>
                onStatus(
                  order.id,
                  "completed"
                )
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black hover:bg-emerald-400"
            >
              <Check className="h-4 w-4" />
              Hoàn tất
            </button>
          )}

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
    {
      label: string;
      className: string;
    }
  > = {
    pending: {
      label: "Chờ xác nhận",
      className:
        "bg-yellow-500/10 text-yellow-400",
    },

    confirmed: {
      label: "Đã xác nhận",
      className:
        "bg-blue-500/10 text-blue-400",
    },

    preparing: {
      label: "Đang chế biến",
      className:
        "bg-orange-500/10 text-orange-400",
    },

    ready: {
      label: "Đã sẵn sàng",
      className:
        "bg-green-500/10 text-green-400",
    },

    served: {
      label: "Đã phục vụ",
      className:
        "bg-purple-500/10 text-purple-400",
    },

    completed: {
      label: "Hoàn thành",
      className:
        "bg-emerald-500/10 text-emerald-400",
    },

    cancelled: {
      label: "Đã hủy",
      className:
        "bg-red-500/10 text-red-400",
    },
  };

  const item = config[status] || {
    label: status,
    className:
      "bg-slate-500/10 text-slate-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-bold ${item.className}`}
    >
      {item.label}
    </span>
  );
}