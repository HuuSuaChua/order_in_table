"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    role: "staff" | "chef";
  }) => Promise<void>;
}

export default function UserModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] =
    useState<"staff" | "chef">("staff");

  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    if (!email.trim()) {
      alert("Vui lòng nhập email");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");

      onClose();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Không thể tạo tài khoản"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f1724] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div>
            <h2 className="text-lg font-bold text-white">
              Tạo tài khoản
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Tạo tài khoản Staff hoặc Chef
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5"
        >
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Họ và tên
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Nguyễn Văn A"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="staff@example.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Mật khẩu
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Tối thiểu 6 ký tự"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">
              Vai trò
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value as "staff" | "chef"
                )
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
            >
              <option value="staff">
                Staff - Nhân viên
              </option>

              <option value="chef">
                Chef - Bếp
              </option>
            </select>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />

            {loading
              ? "Đang tạo..."
              : "Tạo tài khoản"}
          </button>
        </form>
      </div>
    </div>
  );
}