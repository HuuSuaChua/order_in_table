import Link from "next/link";
import {
  UtensilsCrossed,
  ShieldCheck,
  QrCode,
  ArrowRight,
  ChefHat,
  UserCheck,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Order-In-Table | Hệ Thống Gọi Món & Quản Lý",
  description: "Giải pháp gọi món thông minh qua QR tại bàn cho nhà hàng.",
};

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#0a0d14] text-slate-100 font-sans antialiased">
      {/* Background Ambient Glow */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="relative z-10 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Logo Giữ Nguyên */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0d121f]">
                <UtensilsCrossed className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">
                Order-In-Table
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Trang Chủ Hệ Thống</span>
            </div>
          </div>

          <Link
            href="/admin/login"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white"
          >
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Cổng Quản Lý</span>
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Thực Đơn Điện Tử & Quản Lý Nhà Hàng</span>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.15]">
          Giải Pháp Gọi Món Thông Minh <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 bg-clip-text text-transparent">
            Tối Ưu Vận Hành Nhà Hàng
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Trải nghiệm gọi món QR mượt mà dành cho khách hàng, kết hợp hệ thống điều hành realtime cho Phục vụ, Đầu bếp và Quản lý.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="/admin/login"
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-cyan-500/20 transition duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-95"
          >
            <span>Đăng Nhập Quản Hệ Thống</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Portals Grid */}
        <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 text-left backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 mb-3">
              <QrCode className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Khách Gọi Món</h3>
            <p className="mt-1 text-xs text-slate-400">
              Quét mã QR tại bàn để chọn món tiện lợi.
            </p>
          </div>

          <Link
            href="/admin/login"
            className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 text-left backdrop-blur-xl transition hover:border-cyan-500/50 hover:bg-slate-900/70"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20 mb-3">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400">
              Nhân Viên Phục Vụ
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Xác nhận đơn món và hỗ trợ khách hàng.
            </p>
          </Link>

          <Link
            href="/admin/login"
            className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 text-left backdrop-blur-xl transition hover:border-orange-500/50 hover:bg-slate-900/70"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20 mb-3">
              <ChefHat className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-orange-400">
              Màn Hình Bếp (KDS)
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Điều hành bếp và chế biến món ăn realtime.
            </p>
          </Link>
        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} Order-In-Table. All rights reserved.</p>
      </footer>
    </main>
  );
}