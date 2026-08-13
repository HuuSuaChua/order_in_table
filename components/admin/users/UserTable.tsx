"use client";

import {
  ChefHat,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";

import { User, UserRole } from "@/types/user";

interface Props {
  users: User[];
  onDelete: (id: string) => void;
  onChangeRole: (
    id: string,
    role: UserRole
  ) => void;
}

function getRoleInfo(role: UserRole) {
  switch (role) {
    case "admin":
      return {
        label: "Admin",
        icon: ShieldCheck,
        className:
          "bg-purple-500/10 text-purple-400 border-purple-500/20",
      };

    case "chef":
      return {
        label: "Chef",
        icon: ChefHat,
        className:
          "bg-orange-500/10 text-orange-400 border-orange-500/20",
      };

    default:
      return {
        label: "Staff",
        icon: UserCog,
        className:
          "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      };
  }
}

export default function UserTable({
  users,
  onDelete,
  onChangeRole,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px]">
          <thead className="border-b border-slate-800 bg-slate-950/60">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Người dùng
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Vai trò
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ngày tạo
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {users.map((user) => {
              const role = getRoleInfo(user.role);
              const Icon = role.icon;

              return (
                <tr
                  key={user.id}
                  className="transition hover:bg-slate-800/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                        {user.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-600">
                          {user.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-400">
                    {user.email}
                  </td>

                  <td className="px-5 py-4">
                    {user.role === "admin" ? (
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${role.className}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {role.label}
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          onChangeRole(
                            user.id,
                            e.target.value as UserRole
                          )
                        }
                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
                      >
                        <option value="staff">
                          Staff
                        </option>

                        <option value="chef">
                          Chef
                        </option>
                      </select>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {new Date(
                      user.created_at
                    ).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="px-5 py-4 text-right">
                    {user.role !== "admin" && (
                      <button
                        onClick={() =>
                          onDelete(user.id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}