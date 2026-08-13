"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  FolderTree,
} from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";

import { Category } from "@/types/category";

export default function AdminCategoryPage() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editing, setEditing] =
    useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [sortOrder, setSortOrder] =
    useState("0");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh mục.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setSortOrder("0");
    setShowForm(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setDescription(
      category.description ?? ""
    );
    setSortOrder(
      String(category.sort_order)
    );
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditing(null);
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục.");
      return;
    }

    try {
      setSaving(true);

      if (editing) {
        const updated =
          await updateCategory(
            editing.id,
            {
              name: name.trim(),
              description:
                description.trim() || null,
              sort_order:
                Number(sortOrder) || 0,
            }
          );

        setCategories((prev) =>
          prev.map((item) =>
            item.id === updated.id
              ? updated
              : item
          )
        );
      } else {
        const created =
          await createCategory({
            name: name.trim(),
            description:
              description.trim() || null,
            sort_order:
              Number(sortOrder) || 0,
          });

        setCategories((prev) => [
          ...prev,
          created,
        ]);
      }

      closeForm();
    } catch (error) {
      console.error(error);
      alert(
        "Không thể lưu danh mục."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    category: Category
  ) {
    if (
      !confirm(
        `Bạn có chắc muốn xóa "${category.name}"?`
      )
    ) {
      return;
    }

    try {
      await deleteCategory(category.id);

      setCategories((prev) =>
        prev.filter(
          (item) =>
            item.id !== category.id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Không thể xóa danh mục. Có thể đang có sản phẩm thuộc danh mục này."
      );
    }
  }

  async function toggleCategory(
    category: Category
  ) {
    try {
      const updated =
        await updateCategory(
          category.id,
          {
            is_active:
              !category.is_active,
          }
        );

      setCategories((prev) =>
        prev.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Không thể thay đổi trạng thái."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f17] p-4 text-slate-100 md:p-8">

      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-6">

          <div>

            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <FolderTree className="h-4 w-4" />
              Management System
            </div>

            <h1 className="text-3xl font-extrabold text-white">
              Quản Lý Danh Mục
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Quản lý danh mục thực đơn.
            </p>

          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Thêm danh mục
          </button>

        </div>

        {/* List */}

        {loading ? (
          <div className="rounded-2xl bg-slate-900 p-10 text-center">
            Đang tải...
          </div>
        ) : (
          <div className="space-y-3">

            {categories.map(
              (category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                      <FolderTree className="h-5 w-5" />
                    </div>

                    <div>

                      <h3 className="font-bold text-white">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {category.description ||
                          "Chưa có mô tả"}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        toggleCategory(
                          category
                        )
                      }
                      className={`rounded-full px-3 py-1 text-xs ${
                        category.is_active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {category.is_active
                        ? "Đang hoạt động"
                        : "Đã tắt"}
                    </button>

                    <button
                      onClick={() =>
                        openEdit(category)
                      }
                      className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          category
                        )
                      }
                      className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* Modal */}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">

          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0f1722]">

            <div className="flex items-center justify-between border-b border-slate-800 p-5">

              <h2 className="font-bold text-white">
                {editing
                  ? "Chỉnh sửa danh mục"
                  : "Thêm danh mục"}
              </h2>

              <button
                onClick={closeForm}
                className="text-slate-400"
              >
                <X />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Tên danh mục
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Ví dụ: Món chính"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Mô tả
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Thứ tự
                </label>

                <input
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 rounded-xl bg-slate-800 py-3"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold"
                >
                  <Check className="h-4 w-4" />
                  {saving
                    ? "Đang lưu..."
                    : "Lưu"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}