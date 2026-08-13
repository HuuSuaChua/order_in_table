"use client";

import { useEffect, useMemo, useState } from "react";
import TableQRCode from "@/components/admin/TableQRCode";
import { RestaurantTable } from "@/types/table";

import {
  Plus,
  Search,
  UtensilsCrossed,
  Sparkles,
  Trash2,
  LayoutGrid,
} from "lucide-react";

import {
  getTables,
  createTable as createTableApi,
  deleteTable as deleteTableApi,
} from "@/services/table.service";

function generateTableToken() {
  return `table_${crypto.randomUUID().replace(/-/g, "")}`;
}

function generateTableCode(
  tables: RestaurantTable[]
) {
  const numbers = tables.map((table) => {
    const match =
      table.table_code.match(/^T(\d+)$/);

    return match ? Number(match[1]) : 0;
  });

  const next =
    numbers.length > 0
      ? Math.max(...numbers) + 1
      : 1;

  return `T${String(next).padStart(2, "0")}`;
}

export default function AdminTablesPage() {
  const [tableName, setTableName] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [tables, setTables] =
    useState<RestaurantTable[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  // =========================
  // Load tables
  // =========================

  useEffect(() => {
    async function loadTables() {
      try {
        setLoading(true);

        const data = await getTables();

        setTables(data);
      } catch (error) {
        console.error(error);

        alert(
          "Không thể tải danh sách bàn"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTables();
  }, []);

  // =========================
  // Create table
  // =========================

  const createTable = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!tableName.trim()) {
      alert("Vui lòng nhập tên bàn");
      return;
    }

    try {
      setCreating(true);

      const newTable =
        await createTableApi(
          tableName.trim(),
          generateTableCode(tables),
          generateTableToken()
        );

      setTables((prev) => [
        newTable,
        ...prev,
      ]);

      setTableName("");
    } catch (error) {
      console.error(error);

      alert("Không thể tạo bàn");
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // Delete table
  // =========================

  const deleteTable = async (
    id: string
  ) => {
    const confirmed = confirm(
      "Bạn có chắc chắn muốn xóa bàn này không?"
    );

    if (!confirmed) return;

    try {
      await deleteTableApi(id);

      setTables((prev) =>
        prev.filter(
          (table) => table.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert("Không thể xóa bàn");
    }
  };

  // =========================
  // Search
  // =========================

  const filteredTables = useMemo(() => {
    const keyword =
      searchQuery.toLowerCase().trim();

    if (!keyword) {
      return tables;
    }

    return tables.filter(
      (table) =>
        table.table_name
          .toLowerCase()
          .includes(keyword) ||
        table.table_code
          .toLowerCase()
          .includes(keyword)
    );
  }, [tables, searchQuery]);

  return (
    <main className="min-h-screen bg-[#0b0f17] p-3 font-sans text-slate-100 selection:bg-cyan-500 selection:text-black sm:p-4 md:p-6 lg:p-8">

      {/* =========================
          Background
      ========================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute right-[-100px] top-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl sm:h-96 sm:w-96" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">

        {/* =========================
            Header
        ========================= */}

        <div className="mb-6 flex flex-col gap-5 border-b border-slate-800 pb-6 sm:mb-8 md:flex-row md:items-center md:justify-between">

          <div className="min-w-0">

            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Sparkles className="h-4 w-4 shrink-0" />

              <span>
                Management System
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
              Quản Lý Bàn & QR Code
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              Tạo không gian bàn ăn số hóa
              và quản lý mã QR đặt món tự
              động.
            </p>

          </div>

          {/* Stats */}

          <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-xl sm:w-auto">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <LayoutGrid className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Tổng số bàn
              </p>

              <p className="text-lg font-bold text-white">
                {tables.length}
              </p>
            </div>

          </div>

        </div>

        {/* =========================
            Control
        ========================= */}

        <div className="mb-6 grid gap-4 sm:mb-8 md:grid-cols-12 md:gap-6">

          {/* Create */}

          <form
            onSubmit={createTable}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl transition-all hover:border-slate-700/80 sm:p-5 md:col-span-7 lg:col-span-8"
          >

            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Plus className="h-4 w-4 text-cyan-400" />

              Tạo bàn mới
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                value={tableName}
                onChange={(e) =>
                  setTableName(
                    e.target.value
                  )
                }
                placeholder="Nhập tên bàn..."
                disabled={creating}
                className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={creating}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0"
              >

                <Plus className="h-4 w-4" />

                {creating
                  ? "Đang tạo..."
                  : "Tạo Bàn"}

              </button>

            </div>

          </form>

          {/* Search */}

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl sm:p-5 md:col-span-5 lg:col-span-4">

            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Search className="h-4 w-4 text-cyan-400" />

              Tìm kiếm
            </h2>

            <div className="relative">

              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Tên hoặc mã bàn..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />

            </div>

          </div>

        </div>

        {/* =========================
            List Header
        ========================= */}

        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-100 sm:text-xl">

            <UtensilsCrossed className="h-5 w-5 shrink-0 text-cyan-400" />

            <span>
              Danh Sách Bàn
            </span>

          </h2>

          <span className="w-fit rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            Hiển thị{" "}
            {filteredTables.length}/
            {tables.length}
          </span>

        </div>

        {/* =========================
            Loading
        ========================= */}

        {loading ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center sm:p-12">

            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="text-sm text-slate-400">
              Đang tải danh sách bàn...
            </p>

          </div>

        ) : filteredTables.length === 0 ? (

          /* =========================
             Empty
          ========================= */

          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center backdrop-blur-sm sm:p-12">

            <LayoutGrid className="mx-auto mb-4 h-10 w-10 text-slate-700" />

            <p className="text-sm text-slate-400">
              Không tìm thấy bàn phù hợp.
            </p>

            {searchQuery && (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery("")
                }
                className="mt-3 text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                Xóa tìm kiếm
              </button>
            )}

          </div>

        ) : (

          /* =========================
             Table Grid
          ========================= */

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">

            {filteredTables.map(
              (table) => (

                <div
                  key={table.id}
                  className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl hover:shadow-cyan-500/5 sm:p-4"
                >

                  {/* QR */}

                  <div className="min-w-0 overflow-hidden rounded-xl">
                    <TableQRCode
                      tableName={
                        table.table_name
                      }
                      tableCode={
                        table.table_code
                      }
                      qrToken={
                        table.qr_token
                      }
                    />
                  </div>

                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() =>
                      deleteTable(
                        table.id
                      )
                    }
                    className="mt-3 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 transition-all hover:border-red-500/30 hover:bg-red-500/20 active:scale-[0.98]"
                  >

                    <Trash2 className="h-3.5 w-3.5" />

                    Xóa Bàn

                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}