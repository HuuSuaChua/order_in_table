"use client";

import {
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Props {
  total: number;
  available: number;
  unavailable: number;
}

export default function ProductStats({
  total,
  available,
  unavailable,
}: Props) {
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: total,
      icon: Package,
    },
    {
      title: "Đang bán",
      value: available,
      icon: CheckCircle2,
    },
    {
      title: "Ngừng bán",
      value: unavailable,
      icon: XCircle,
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                <Icon className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}