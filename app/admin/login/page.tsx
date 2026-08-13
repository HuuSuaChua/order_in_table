import LoginForm from "@/components/auth/LoginForm";
import { UtensilsCrossed, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0d14] p-4 text-slate-100 font-sans antialiased">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="mb-8 text-center">
          {/* Logo Badge */}
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-2xl shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#0d121f]">
              <UtensilsCrossed className="h-7 w-7 text-cyan-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-400 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Hệ Thống Quản Lý Nội Bộ</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Order-In-Table
          </h1>

          <p className="mt-1.5 text-xs text-slate-400">
            Vui lòng đăng nhập tài khoản được cấp quyền để tiếp tục
          </p>
        </div>

        {/* Form Container (Glassmorphism) */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-slate-700/80">
          <LoginForm />
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Order-In-Table. All rights reserved.
        </p>
      </div>
    </main>
  );
}