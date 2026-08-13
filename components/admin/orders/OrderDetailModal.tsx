"use client";

import {
  X,
  CheckCircle2,
} from "lucide-react";

import {
  Order,
  OrderStatus,
} from "@/types/order";

interface Props {
  order: Order | null;

  onClose: () => void;

  onStatusChange: (
    order: Order,
    status: OrderStatus
  ) => void;
}

const statusConfig: Record<
  OrderStatus,
  string
> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  ready: "Sẵn sàng",
  served: "Đã phục vụ",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: Props) {
  if (!order) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0f1722] shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-white">
              Đơn #{order.order_code}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {order.table?.table_name ||
                order.table?.table_code}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Trạng thái
              </span>

              <span className="font-semibold text-cyan-400">
                {
                  statusConfig[
                    order.status
                  ]
                }
              </span>
            </div>
          </div>

          {/* Items */}

          <div className="space-y-3">
            {order.items?.map(
              (item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        {item.product_name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {Number(
                          item.unit_price
                        ).toLocaleString(
                          "vi-VN"
                        )}
                        đ ×{" "}
                        {item.quantity}
                      </p>

                      {item.note && (
                        <p className="mt-2 rounded-lg bg-yellow-500/5 p-2 text-xs text-yellow-400">
                          Ghi chú:{" "}
                          {item.note}
                        </p>
                      )}
                    </div>

                    <span className="font-bold text-cyan-400">
                      {Number(
                        item.subtotal
                      ).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </span>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Order note */}

          {order.note && (
            <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="text-xs font-semibold text-yellow-400">
                Ghi chú đơn hàng
              </p>

              <p className="mt-2 text-sm text-slate-300">
                {order.note}
              </p>
            </div>
          )}

          {/* Total */}

          <div className="mt-6 border-t border-slate-800 pt-5">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tạm tính</span>

              <span>
                {Number(
                  order.subtotal
                ).toLocaleString(
                  "vi-VN"
                )}
                đ
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm text-slate-500">
              <span>Giảm giá</span>

              <span>
                -{" "}
                {Number(
                  order.discount
                ).toLocaleString(
                  "vi-VN"
                )}
                đ
              </span>
            </div>

            <div className="mt-4 flex justify-between">
              <span className="font-semibold text-white">
                Tổng cộng
              </span>

              <span className="text-xl font-bold text-cyan-400">
                {Number(
                  order.total
                ).toLocaleString(
                  "vi-VN"
                )}
                đ
              </span>
            </div>
          </div>

          {/* Status actions */}

          <div className="mt-6 grid grid-cols-2 gap-2">
            {(
              [
                "pending",
                "confirmed",
                "preparing",
                "ready",
                "served",
                "completed",
                "cancelled",
              ] as OrderStatus[]
            ).map((status) => (
              <button
                key={status}
                type="button"
                disabled={
                  status ===
                  order.status
                }
                onClick={() =>
                  onStatusChange(
                    order,
                    status
                  )
                }
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  status ===
                  order.status
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {statusConfig[status]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}