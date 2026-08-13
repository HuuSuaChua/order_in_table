"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại.");
      }

      switch (data.user.role) {
        case "admin":
          router.push("/admin");
          break;

        case "staff":
          router.push("/staff");
          break;

        case "chef":
          router.push("/chef");
          break;

        default:
          setError("Tài khoản chưa được phân quyền truy cập.");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại. Vui lòng kiểm tra lại."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Alert Error Box */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-medium text-red-400 animate-in fade-in-0 zoom-in-95">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Email */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Địa chỉ Email
        </label>

        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 transition-colors group-focus-within:text-cyan-400">
            <Mail className="h-4 w-4" />
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@restaurant.com"
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-4 text-xs font-medium text-white shadow-inner outline-none transition duration-200 placeholder:text-slate-600 focus:border-cyan-500 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/10"
          />
        </div>
      </div>

      {/* Input Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Mật khẩu
          </label>
        </div>

        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 transition-colors group-focus-within:text-cyan-400">
            <Lock className="h-4 w-4" />
          </div>

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-10 text-xs font-medium text-white shadow-inner outline-none transition duration-200 placeholder:text-slate-600 focus:border-cyan-500 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/10"
          />

          {/* Toggle Password Visibility Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Đang xác thực hệ thống...</span>
          </>
        ) : (
          <span>Đăng Nhập Quản Lý</span>
        )}
      </button>
    </form>
  );
}