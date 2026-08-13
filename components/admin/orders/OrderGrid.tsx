"use client";

import { Order, OrderStatus } from "@/types/order";
import OrderCard from "./OrderCard";

interface Props {
  orders: Order[];

  onView: (
    order: Order
  ) => void;

  onStatusChange: (
    order: Order,
    status: OrderStatus
  ) => void;
}

export default function OrderGrid({
  orders,
  onView,
  onStatusChange,
}: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onView={onView}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}