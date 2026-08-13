"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Menu,
  X,
  LogOut,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Props {
  children: React.ReactNode;
}

const menuItems = [
  {
    label: "Tổng quan",
    href: "/staff",
    icon: LayoutDashboard,
  },
  {
    label: "Đơn hàng",
    href: "/staff/orders",
    icon: ClipboardList,
  },
];

export default function StaffLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          border-r border-slate-800
          bg-[#0b0f17]
          transition-transform duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="font-bold text-white">
                Order-In-Table
              </h1>

              <p className="text-xs text-slate-500">
                Staff Management
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Nhân viên
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/staff"
                  ? pathname === "/staff"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group flex items-center justify-between
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    transition
                    ${
                      active
                        ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${
                        active
                          ? "text-cyan-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />

                    <span>{item.label}</span>
                  </div>

                  {active && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 rounded-xl bg-slate-900 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 font-bold">
                S
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  Staff
                </p>

                <p className="text-xs text-slate-500">
                  Nhân viên
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800 bg-[#0b0f17]/95 px-4 backdrop-blur lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="ml-3">
          <p className="text-sm font-bold text-white">
            Staff
          </p>

          <p className="text-[10px] text-slate-500">
            Order-In-Table
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="min-h-screen lg:ml-64">
        {children}
      </main>
    </div>
  );
}