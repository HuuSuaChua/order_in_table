"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  UtensilsCrossed,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Vui lòng nhập họ tên.");
      return;
    }

    if (!trimmedEmail) {
      setError("Vui lòng nhập email.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Kiểm tra email đã tồn tại trong public.users
       */
      const { data: existingUser, error: checkError } =
        await supabase
          .from("users")
          .select("id")
          .eq("email", trimmedEmail)
          .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingUser) {
        setError("Email này đã được sử dụng.");
        return;
      }

      /*
       * Tạo tài khoản Supabase Auth
       */
      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });

      if (authError) {
        throw authError;
      }

      const user = authData.user;

      if (!user) {
        throw new Error(
          "Không thể tạo tài khoản."
        );
      }

      /*
       * Lưu thông tin nhân viên vào public.users
       *
       * Mặc định đăng ký tài khoản là STAFF.
       *
       * Không cho người dùng tự chọn admin.
       */
      const { error: profileError } =
        await supabase
          .from("users")
          .insert({
            id: user.id,
            name: trimmedName,
            email: trimmedEmail,
            role: "staff",
          });

      if (profileError) {
        /*
         * Nếu tạo Auth thành công nhưng insert
         * profile thất bại thì báo lỗi.
         */
        console.error(
          "Create profile error:",
          profileError
        );

        throw new Error(
          "Tạo tài khoản thành công nhưng không thể tạo hồ sơ người dùng."
        );
      }

      /*
       * Nếu Supabase yêu cầu xác nhận email
       */
      if (!authData.session) {
        setSuccess(
          "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản."
        );

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        return;
      }

      /*
       * Nếu không yêu cầu xác nhận email
       */
      setSuccess(
        "Đăng ký thành công. Đang chuyển đến trang đăng nhập..."
      );

      setTimeout(() => {
        router.push("/admin/login");
      }, 1200);
    } catch (error: unknown) {
      console.error(
        "Register error:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Không thể đăng ký tài khoản."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f17] px-4 py-8 text-slate-100">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
            <UtensilsCrossed className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Order-In-Table
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Tạo tài khoản quản lý
          </p>

        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-white">
              Đăng ký tài khoản
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tạo tài khoản nhân viên để truy cập hệ thống.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* Name */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Họ và tên
              </label>

              <div className="relative">

                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Nguyễn Văn A"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-10 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                />

              </div>

            </div>

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="admin@example.com"
                  disabled={loading}
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-10 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Mật khẩu
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-10 py-3 pr-11 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

              <p className="mt-1.5 text-xs text-slate-600">
                Mật khẩu tối thiểu 6 ký tự.
              </p>

            </div>

            {/* Confirm Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Xác nhận mật khẩu
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-10 py-3 pr-11 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

            </div>

            {/* Role */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

              <p className="text-sm font-semibold text-white">
                Quyền tài khoản
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Tài khoản đăng ký mới mặc định là
                <span className="ml-1 font-semibold text-cyan-400">
                  Staff
                </span>
                .
              </p>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Đăng ký
                </>
              )}

            </button>

          </form>

          {/* Login */}
          <div className="mt-6 border-t border-slate-800 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Đã có tài khoản?
            </p>

            <Link
              href="/admin/login"
              className="mt-2 inline-block text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Đăng nhập
            </Link>

          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Order-In-Table Management System
        </p>

      </div>
    </main>
  );
}