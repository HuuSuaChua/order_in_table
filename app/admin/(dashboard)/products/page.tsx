"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  UtensilsCrossed,
} from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/product.service";

import {
  getCategories,
} from "@/services/category.service";

import { Product } from "@/types/product";
import { Category } from "@/types/category";

import ProductHeader from "@/components/admin/products/ProductHeader";
import ProductStats from "@/components/admin/products/ProductStats";
import ProductSearch from "@/components/admin/products/ProductSearch";
import ProductGrid from "@/components/admin/products/ProductGrid";
import ProductModal from "@/components/admin/products/ProductModal";

import {
  ProductFormValues,
} from "@/components/admin/products/ProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [
        productsData,
        categoriesData,
      ] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData);

      setCategories(categoriesData);
    } catch (error) {
      console.error(error);

      alert(
        "Không thể tải dữ liệu sản phẩm."
      );
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // SEARCH
  // ===============================

  const filteredProducts = useMemo(() => {
    const keyword =
      searchQuery
        .toLowerCase()
        .trim();

    if (!keyword) {
      return products;
    }

    return products.filter(
      (product) => {
        const nameMatch =
          product.name
            .toLowerCase()
            .includes(keyword);

        const descriptionMatch =
          product.description
            ?.toLowerCase()
            .includes(keyword);

        const categoryMatch =
          product.category?.name
            ?.toLowerCase()
            .includes(keyword);

        return (
          nameMatch ||
          !!descriptionMatch ||
          !!categoryMatch
        );
      }
    );
  }, [
    products,
    searchQuery,
  ]);

  // ===============================
  // MODAL
  // ===============================

  function openCreateModal() {
    setEditingProduct(null);

    setShowModal(true);
  }

  function openEditModal(
    product: Product
  ) {
    setEditingProduct(product);

    setShowModal(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingProduct(null);
  }

  // ===============================
  // CREATE / UPDATE
  // ===============================

  async function handleProductSubmit(
    data: ProductFormValues
  ) {
    try {
      setSaving(true);

      if (editingProduct) {
        const updated =
          await updateProduct(
            editingProduct.id,
            data
          );

        setProducts((prev) =>
          prev.map((item) =>
            item.id === updated.id
              ? updated
              : item
          )
        );
      } else {
        const created =
          await createProduct(data);

        setProducts((prev) => [
          created,
          ...prev,
        ]);
      }

      setShowModal(false);

      setEditingProduct(null);
    } catch (error) {
      console.error(error);

      alert(
        editingProduct
          ? "Không thể cập nhật sản phẩm."
          : "Không thể tạo sản phẩm."
      );
    } finally {
      setSaving(false);
    }
  }

  // ===============================
  // DELETE
  // ===============================

  async function handleDelete(
    product: Product
  ) {
    const confirmed = confirm(
      `Bạn có chắc chắn muốn xóa "${product.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(
        product.id
      );

      setProducts((prev) =>
        prev.filter(
          (item) =>
            item.id !== product.id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Không thể xóa sản phẩm."
      );
    }
  }

  // ===============================
  // TOGGLE AVAILABLE
  // ===============================

  async function toggleAvailable(
    product: Product
  ) {
    try {
      const updated =
        await updateProduct(
          product.id,
          {
            is_available:
              !product.is_available,
          }
        );

      setProducts((prev) =>
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

  // ===============================
  // RENDER
  // ===============================

  return (
    <main className="min-h-screen bg-[#0b0f17] p-4 font-sans text-slate-100 md:p-8">
      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}

        <ProductHeader
          onAdd={
            openCreateModal
          }
        />

        {/* STATS */}

        <ProductStats
          total={
            products.length
          }
          available={
            products.filter(
              (p) =>
                p.is_available
            ).length
          }
          unavailable={
            products.filter(
              (p) =>
                !p.is_available
            ).length
          }
        />

        {/* SEARCH */}

        <ProductSearch
          value={searchQuery}
          onChange={
            setSearchQuery
          }
        />

        {/* TITLE */}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <UtensilsCrossed className="h-5 w-5 text-cyan-400" />

            Danh sách sản phẩm
          </h2>

          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            Hiển thị{" "}
            {
              filteredProducts.length
            }
            /
            {
              products.length
            }
          </span>
        </div>

        {/* PRODUCTS */}

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <p className="text-sm text-slate-400">
              Đang tải sản phẩm...
            </p>
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <UtensilsCrossed className="mx-auto mb-4 h-10 w-10 text-slate-700" />

            <p className="text-sm text-slate-400">
              Không tìm thấy sản phẩm.
            </p>
          </div>
        ) : (
          <ProductGrid
            products={
              filteredProducts
            }
            onEdit={
              openEditModal
            }
            onDelete={
              handleDelete
            }
            onToggle={
              toggleAvailable
            }
          />
        )}
      </div>

      {/* MODAL */}

      <ProductModal
        open={showModal}
        product={
          editingProduct
        }
        categories={
          categories
        }
        saving={saving}
        onClose={
          closeModal
        }
        onSubmit={
          handleProductSubmit
        }
      />
    </main>
  );
}