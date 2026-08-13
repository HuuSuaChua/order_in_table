"use client";

import { OrderStatus } from "@/types/order";

interface Props {
  value: OrderStatus | "all";
  onChange: (
    value: OrderStatus | "all"
  ) => void;
}

const filters: {
  label: string;
  value: OrderStatus | "all";
}[] = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chờ xử lý",
    value: "pending",
  },
  {
    label: "Đã xác nhận",
    value: "confirmed",
  },
  {
    label: "Đang chuẩn bị",
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

export default function OrderFilters({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() =>
            onChange(filter.value)
          }
          className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
            value === filter.value
              ? "bg-cyan-500 text-white"
              : "border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}