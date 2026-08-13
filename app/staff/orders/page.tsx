"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  XCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

import {
  getOrders,
  updateOrderStatus,
} from "@/services/order.service";

import {
  Order,
  OrderStatus,
} from "@/types/order";

const filters: {
  label: string;
  value: "all" | OrderStatus;
}[] = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chờ xác nhận",
    value: "pending",
  },
  {
    label: "Đã xác nhận",
    value: "confirmed",
  },
  {
    label: "Đang chế biến",
    value: "preparing",
  },
  {
    label: "Sẵn sàng",
    value: "ready",
  },
  {
    label: "Đã phục vụ",
    value: "served",
  },
  {
    label: "Hoàn thành",
    value: "completed",
  },
  {
    label: "Đã hủy",
    value: "cancelled",
  },
];

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Chờ xác nhận",
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Clock,
  },

  confirmed: {
    label: "Đã xác nhận",
    className:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: CheckCircle2,
  },

  preparing: {
    label: "Đang chế biến",
    className:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
    icon: ChefHat,
  },

  ready: {
    label: "Sẵn sàng",
    className:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    icon: PackageCheck,
  },

  served: {
    label: "Đã phục vụ",
    className:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: CheckCircle2,
  },

  completed: {
    label: "Hoàn thành",
    className:
      "bg-green-500/10 text-green-400 border-green-500/20",
    icon: CheckCircle2,
  },

  cancelled: {
    label: "Đã hủy",
    className:
      "bg-red-500/10 text-red-400 border-red-500/20",
    icon: XCircle,
  },
};

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] =
    useState<"all" | OrderStatus>("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(
    orderId: string,
    status: OrderStatus
  ) {
    try {
      const updatedOrder =
        await updateOrderStatus(
          orderId,
          status
        );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...updatedOrder,
              }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert(
        "Không thể cập nhật trạng thái đơn hàng."
      );
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    loadOrders();
  }

  const filteredOrders = useMemo(() => {
    if (filter === "all") {
      return orders;
    }

    return orders.filter(
      (order) => order.status === filter
    );
  }, [orders, filter]);

  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const preparingCount = orders.filter(
    (order) => order.status === "preparing"
  ).length;

  const readyCount = orders.filter(
    (order) => order.status === "ready"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "completed"
  ).length;

  return (
    <main className="min-h-screen bg-[#0b0f17] p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-cyan-400">
              <ClipboardList className="h-5 w-5" />

              <span className="text-xs font-bold uppercase tracking-widest">
                Staff Management
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white">
              Quản lý đơn hàng
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Theo dõi và xử lý các đơn hàng của khách.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            Làm mới
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Chờ xác nhận"
            value={pendingCount}
            icon={Clock}
          />

          <StatCard
            title="Đang chế biến"
            value={preparingCount}
            icon={ChefHat}
          />

          <StatCard
            title="Sẵn sàng"
            value={readyCount}
            icon={PackageCheck}
          />

          <StatCard
            title="Hoàn thành"
            value={completedCount}
            icon={CheckCircle2}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {filters.map((item) => {
              const active =
                filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setFilter(item.value)
                  }
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-cyan-400" />

            <p className="text-sm text-slate-400">
              Đang tải đơn hàng...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
            <ClipboardList className="mx-auto mb-3 h-10 w-10 text-slate-600" />

            <p className="font-medium text-slate-300">
              Không có đơn hàng
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Không tìm thấy đơn hàng với trạng thái này.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={
                  handleStatusChange
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   ORDER CARD
===================================================== */

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (
    id: string,
    status: OrderStatus
  ) => Promise<void>;
}) {
  const config =
    statusConfig[order.status];

  const StatusIcon = config.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      {/* Order Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-bold text-white">
              #{order.order_code}
            </h2>

            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${config.className}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />

              {config.label}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {new Date(
              order.created_at
            ).toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Table */}
        <div className="rounded-xl bg-slate-950 px-4 py-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Bàn
          </p>

          <p className="font-bold text-cyan-400">
            {order.table?.table_code ??
              "N/A"}

            {order.table?.table_name
              ? ` - ${order.table.table_name}`
              : ""}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="p-5">
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl bg-slate-950/60 p-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-200">
                  {item.product_name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {Number(
                    item.unit_price
                  ).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  × {item.quantity}
                </p>

                {item.note && (
                  <p className="mt-2 text-xs text-amber-400">
                    Ghi chú: {item.note}
                  </p>
                )}
              </div>

              <p className="shrink-0 font-semibold text-slate-200">
                {Number(
                  item.subtotal
                ).toLocaleString(
                  "vi-VN"
                )}
                đ
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        {order.note && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs font-medium text-amber-400">
              Ghi chú đơn hàng
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {order.note}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex flex-col gap-4 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs text-slate-500">
              Tổng tiền
            </span>

            <p className="text-xl font-bold text-cyan-400">
              {Number(
                order.total
              ).toLocaleString(
                "vi-VN"
              )}
              đ
            </p>
          </div>

          <StatusActions
            order={order}
            onStatusChange={
              onStatusChange
            }
          />
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   STATUS ACTIONS
===================================================== */

function StatusActions({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (
    id: string,
    status: OrderStatus
  ) => Promise<void>;
}) {
  const actions: Partial<
    Record<OrderStatus, OrderStatus>
  > = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "ready",
    ready: "served",
    served: "completed",
  };

  const nextStatus =
    actions[order.status];

  if (!nextStatus) {
    return null;
  }

  const nextLabel: Record<
    OrderStatus,
    string
  > = {
    pending: "Xác nhận đơn",
    confirmed: "Bắt đầu chế biến",
    preparing: "Đánh dấu sẵn sàng",
    ready: "Đã phục vụ",
    served: "Hoàn thành",
    completed: "",
    cancelled: "",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {order.status === "pending" && (
        <button
          type="button"
          onClick={() =>
            onStatusChange(
              order.id,
              "cancelled"
            )
          }
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
        >
          Hủy
        </button>
      )}

      <button
        type="button"
        onClick={() =>
          onStatusChange(
            order.id,
            nextStatus
          )
        }
        className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        {nextLabel[order.status]}
      </button>
    </div>
  );
}