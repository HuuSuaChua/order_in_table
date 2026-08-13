"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { UtensilsCrossed } from "lucide-react";

import {
  getOrders,
  updateOrderStatus,
} from "@/services/order.service";

import {
  Order,
  OrderStatus,
} from "@/types/order";

import OrderHeader from "@/components/admin/orders/OrderHeader";
import OrderStats from "@/components/admin/orders/OrderStats";
import OrderSearch from "@/components/admin/orders/OrderSearch";
import OrderFilters from "@/components/admin/orders/OrderFilters";
import OrderGrid from "@/components/admin/orders/OrderGrid";
import OrderDetailModal from "@/components/admin/orders/OrderDetailModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<OrderStatus | "all">("all");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [updating, setUpdating] =
    useState(false);

  // =========================
  // Load
  // =========================

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);

      const data =
        await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);

      alert(
        "Không thể tải danh sách đơn hàng."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // Filter
  // =========================

  const filteredOrders = useMemo(() => {
    const keyword =
      searchQuery
        .toLowerCase()
        .trim();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        order.status ===
          statusFilter;

      const matchesSearch =
        !keyword ||
        order.order_code
          .toLowerCase()
          .includes(keyword) ||
        order.table?.table_name
          ?.toLowerCase()
          .includes(keyword) ||
        order.table?.table_code
          ?.toLowerCase()
          .includes(keyword);

      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    orders,
    searchQuery,
    statusFilter,
  ]);

  // =========================
  // Update status
  // =========================

  async function handleStatusChange(
    order: Order,
    status: OrderStatus
  ) {
    try {
      setUpdating(true);

      const updated =
        await updateOrderStatus(
          order.id,
          status
        );

      setOrders((prev) =>
        prev.map((item) =>
          item.id === updated.id
            ? {
                ...item,
                ...updated,
              }
            : item
        )
      );

      setSelectedOrder((prev) =>
        prev?.id === updated.id
          ? {
              ...prev,
              ...updated,
            }
          : prev
      );
    } catch (error) {
      console.error(error);

      alert(
        "Không thể cập nhật trạng thái đơn hàng."
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] p-4 font-sans text-slate-100 md:p-8">
      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <OrderHeader
          onRefresh={loadOrders}
        />

        <OrderStats
          total={orders.length}
          pending={
            orders.filter(
              (order) =>
                order.status ===
                  "pending" ||
                order.status ===
                  "confirmed"
            ).length
          }
          preparing={
            orders.filter(
              (order) =>
                order.status ===
                "preparing"
            ).length
          }
          completed={
            orders.filter(
              (order) =>
                order.status ===
                "completed"
            ).length
          }
        />

        <OrderSearch
          value={searchQuery}
          onChange={
            setSearchQuery
          }
        />

        <OrderFilters
          value={statusFilter}
          onChange={
            setStatusFilter
          }
        />

        {/* Title */}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <UtensilsCrossed className="h-5 w-5 text-cyan-400" />

            Danh sách đơn hàng
          </h2>

          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            Hiển thị{" "}
            {
              filteredOrders.length
            }
            /
            {orders.length}
          </span>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <p className="text-sm text-slate-400">
              Đang tải đơn hàng...
            </p>
          </div>
        ) : filteredOrders.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <UtensilsCrossed className="mx-auto mb-4 h-10 w-10 text-slate-700" />

            <p className="text-sm text-slate-400">
              Không tìm thấy đơn hàng.
            </p>
          </div>
        ) : (
          <OrderGrid
            orders={
              filteredOrders
            }
            onView={
              setSelectedOrder
            }
            onStatusChange={
              handleStatusChange
            }
          />
        )}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
        onStatusChange={
          handleStatusChange
        }
      />

      {updating && (
        <div className="fixed bottom-5 right-5 z-[200] rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
          Đang cập nhật đơn hàng...
        </div>
      )}
    </main>
  );
}