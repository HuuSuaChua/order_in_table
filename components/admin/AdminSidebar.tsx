"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Table2,
  ChevronRight,
  Tags,
  ClipboardList,
  X,
  Users,
  LogOut,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import { supabase } from "@/lib/supabase/client";

const menuItems = [
  {
    label: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Quản lý bàn",
    href: "/admin/tables",
    icon: Table2,
  },
  {
    label: "Quản lý món",
    href: "/admin/products",
    icon: UtensilsCrossed,
  },
  {
    label: "Quản lý danh mục",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Quản lý đơn hàng",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Quản lý tài khoản",
    href: "/admin/users",
    icon: Users,
  },
];

interface Props {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn đăng xuất không?"
    );

    if (!confirmed) return;

    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        alert("Không thể đăng xuất. Vui lòng thử lại.");
        return;
      }

      // Đóng sidebar mobile
      onClose();

      // Chuyển về trang đăng nhập
      router.replace("/admin/login");

      // Refresh để đảm bảo middleware/server nhận session mới
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Đã xảy ra lỗi khi đăng xuất.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          border-r border-slate-800
          bg-[#0b0f17] text-slate-100
          transition-transform duration-300 ease-in-out

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-base font-bold text-white">
                Order-In-Table
              </h1>

              <p className="text-xs text-slate-500">
                Management
              </p>
            </div>
          </div>

          {/* Close mobile */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Quản lý
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />

                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-cyan-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-800 p-4">
          <div className="rounded-xl bg-slate-900/80 p-3">
            {/* User */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                A
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  Administrator
                </p>

                <p className="text-xs text-slate-500">
                  Quản trị viên
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-400 transition hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}