"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({
  children,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      {/* =========================
          Sidebar
      ========================= */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* =========================
          Mobile Header
      ========================= */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800 bg-[#0b0f17]/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="ml-3">
          <p className="text-sm font-bold text-white">
            Order-In-Table
          </p>

          <p className="text-[10px] text-slate-500">
            Management
          </p>
        </div>
      </header>

      {/* =========================
          Main Content
      ========================= */}
      <main className="min-h-screen lg:ml-64">
        {children}
      </main>
    </div>
  );
}