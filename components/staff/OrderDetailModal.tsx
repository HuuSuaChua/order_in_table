"use client";

import { X } from "lucide-react";

import {
  Order,
  OrderStatus,
} from "@/types/order";

interface Props {
  order: Order;
  onClose: () => void;
  onStatus: (
    id: string,
    status: OrderStatus
  ) => Promise<void>;
}

export default function OrderDetailModal({
  order,
  onClose,
  onStatus,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-[#0f1724] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">

          <div>
            <p className="text-xs text-slate-500">
              Đơn hàng
            </p>

            <h2 className="text-xl font-bold text-white">
              #{order.order_code}
            </h2>

            <p className="mt-1 text-xs text-cyan-400">
              {order.table?.table_name ||
                order.table?.table_code}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-5">

          <h3 className="mb-3 text-sm font-bold text-white">
            Món ăn
          </h3>

          <div className="space-y-3">

            {order.items?.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"
              >
                <div className="flex justify-between gap-3">

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {Number(
                        item.unit_price
                      ).toLocaleString("vi-VN")}
                      đ × {item.quantity}
                    </p>

                    {item.note && (
                      <p className="mt-2 rounded-lg bg-yellow-500/10 px-2 py-1 text-xs text-yellow-400">
                        Ghi chú: {item.note}
                      </p>
                    )}
                  </div>

                  <p className="text-sm font-bold text-cyan-400">
                    {Number(
                      item.subtotal
                    ).toLocaleString("vi-VN")}
                    đ
                  </p>

                </div>
              </div>
            ))}

          </div>

          {order.note && (
            <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="text-xs font-bold text-yellow-400">
                Ghi chú đơn hàng
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {order.note}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="mt-5 border-t border-slate-800 pt-4">

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Tạm tính
              </span>

              <span className="text-sm text-slate-300">
                {Number(
                  order.subtotal
                ).toLocaleString("vi-VN")}
                đ
              </span>
            </div>

            <div className="mt-2 flex justify-between">
              <span className="font-semibold text-white">
                Tổng cộng
              </span>

              <span className="text-xl font-bold text-cyan-400">
                {Number(
                  order.total
                ).toLocaleString("vi-VN")}
                đ
              </span>
            </div>

          </div>

        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-800 p-5">

          {order.status === "pending" && (
            <div className="flex gap-3">

              <button
                onClick={() =>
                  onStatus(
                    order.id,
                    "cancelled"
                  )
                }
                className="flex-1 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20"
              >
                Hủy đơn
              </button>

              <button
                onClick={() =>
                  onStatus(
                    order.id,
                    "confirmed"
                  )
                }
                className="flex-1 rounded-xl bg-cyan-500 py-3 text-sm font-bold text-black hover:bg-cyan-400"
              >
                Xác nhận đơn
              </button>

            </div>
          )}

          {order.status === "ready" && (
            <button
              onClick={() =>
                onStatus(
                  order.id,
                  "served"
                )
              }
              className="w-full rounded-xl bg-green-500 py-3 text-sm font-bold text-black"
            >
              Xác nhận đã phục vụ
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
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black"
            >
              Hoàn tất đơn hàng
            </button>
          )}

        </div>

      </div>
    </div>
  );
}