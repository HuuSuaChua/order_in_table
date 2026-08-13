"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    RefreshCw,
    Users,
} from "lucide-react";



import {
    createUser,
    deleteUser,
    getUsers,
    updateUserRole,
} from "@/services/user.service";

import { User, UserRole } from "@/types/user";
import UserHeader from "@/components/admin/users/UserHeader";
import UserStats from "@/components/admin/users/UserStats";
import UserSearch from "@/components/admin/users/UserSearch";
import UserTable from "@/components/admin/users/UserTable";
import UserModal from "@/components/admin/users/UserModal";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] =
        useState(false);

    async function loadUsers() {
        try {
            setLoading(true);

            const data = await getUsers();

            setUsers(data);
        } catch (error) {
            console.error(error);

            alert("Không thể tải danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        if (!keyword) {
            return users;
        }

        return users.filter(
            (user) =>
                user.name
                    .toLowerCase()
                    .includes(keyword) ||
                user.email
                    .toLowerCase()
                    .includes(keyword)
        );
    }, [users, search]);

    const stats = useMemo(() => {
        return {
            admin: users.filter(
                (user) => user.role === "admin"
            ).length,

            staff: users.filter(
                (user) => user.role === "staff"
            ).length,

            chef: users.filter(
                (user) => user.role === "chef"
            ).length,
        };
    }, [users]);

    async function handleCreateUser(data: {
        name: string;
        email: string;
        password: string;
        role: "staff" | "chef";
    }) {
        const newUser = await createUser(data);

        setUsers((prev) => [
            newUser,
            ...prev,
        ]);
    }

    async function handleDeleteUser(id: string) {
        const user = users.find(
            (item) => item.id === id
        );

        if (!user) {
            return;
        }

        const confirmed = confirm(
            `Bạn có chắc muốn xóa tài khoản "${user.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteUser(id);

            setUsers((prev) =>
                prev.filter(
                    (item) => item.id !== id
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể xóa tài khoản"
            );
        }
    }

    async function handleChangeRole(
        id: string,
        role: UserRole
    ) {
        try {
            const updatedUser =
                await updateUserRole(id, role);

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id
                        ? updatedUser
                        : user
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                "Không thể thay đổi vai trò"
            );
        }
    }

    return (
        <main className="min-h-screen bg-[#0b0f17] p-4 font-sans text-slate-100 md:p-8">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl">
                <UserHeader total={users.length} />

                <UserStats
                    admin={stats.admin}
                    staff={stats.staff}
                    chef={stats.chef}
                />

                {/* Controls */}
                <div className="mb-6 flex flex-col gap-3 md:flex-row">
                    <div className="flex-1">
                        <UserSearch
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:brightness-110"
                    >
                        <Plus className="h-4 w-4" />
                        Tạo tài khoản
                    </button>

                    <button
                        onClick={loadUsers}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${loading ? "animate-spin" : ""
                                }`}
                        />

                        Làm mới
                    </button>
                </div>

                {/* Result */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-cyan-400" />

                        <h2 className="font-bold text-white">
                            Danh sách tài khoản
                        </h2>
                    </div>

                    <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-500">
                        {filteredUsers.length} tài khoản
                    </span>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
                        <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-cyan-400" />

                        <p className="text-sm text-slate-500">
                            Đang tải tài khoản...
                        </p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
                        <Users className="mx-auto mb-3 h-8 w-8 text-slate-600" />

                        <p className="text-sm text-slate-500">
                            Không tìm thấy tài khoản.
                        </p>
                    </div>
                ) : (
                    <UserTable
                        users={filteredUsers}
                        onDelete={handleDeleteUser}
                        onChangeRole={handleChangeRole}
                    />
                )}
            </div>

            <UserModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateUser}
            />
        </main>
    );
}