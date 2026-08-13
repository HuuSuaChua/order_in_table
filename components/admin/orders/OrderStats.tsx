"use client";

import {
  Clock3,
  CheckCircle2,
  CookingPot,
  ShoppingBag,
} from "lucide-react";

interface Props {
  total: number;
  pending: number;
  preparing: number;
  completed: number;
}

export default function OrderStats({
  total,
  pending,
  preparing,
  completed,
}: Props) {
  const stats = [
    {
      label: "Tổng đơn",
      value: total,
      icon: ShoppingBag,
    },
    {
      label: "Chờ xử lý",
      value: pending,
      icon: Clock3,
    },
    {
      label: "Đang chuẩn bị",
      value: preparing,
      icon: CookingPot,
    },
    {
      label: "Hoàn thành",
      value: completed,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {stat.label}
              </span>

              <Icon className="h-5 w-5 text-cyan-400" />
            </div>

            <p className="text-2xl font-bold text-white">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}