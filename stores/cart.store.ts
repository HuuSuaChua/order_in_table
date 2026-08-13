"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CartItem } from "@/types/order";
import { Product } from "@/types/product";

interface CartStore {
  items: CartItem[];

  addItem: (product: Product) => void;

  removeItem: (productId: string) => void;

  increaseQuantity: (productId: string) => void;

  decreaseQuantity: (productId: string) => void;

  updateNote: (
    productId: string,
    note: string
  ) => void;

  clearCart: () => void;

  getTotalQuantity: () => number;

  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // =========================
      // Thêm món
      // =========================
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product_id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product_id === product.id
                  ? {
                      ...item,
                      quantity:
                        item.quantity + 1,
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product_id: product.id,
                product_name: product.name,
                quantity: 1,
                unit_price: Number(
                  product.price
                ),
                image_url:
                  product.image_url ?? null,
                note: "",
              },
            ],
          };
        });
      },

      // =========================
      // Xóa món
      // =========================
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.product_id !== productId
          ),
        }));
      },

      // =========================
      // Tăng
      // =========================
      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
          ),
        }));
      },

      // =========================
      // Giảm
      // =========================
      decreaseQuantity: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product_id === productId
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item
            )
            .filter(
              (item) => item.quantity > 0
            ),
        }));
      },

      // =========================
      // Ghi chú món
      // =========================
      updateNote: (productId, note) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId
              ? {
                  ...item,
                  note,
                }
              : item
          ),
        }));
      },

      // =========================
      // Clear
      // =========================
      clearCart: () => {
        set({
          items: [],
        });
      },

      // =========================
      // Tổng số món
      // =========================
      getTotalQuantity: () => {
        return get().items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        );
      },

      // =========================
      // Tổng tiền
      // =========================
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            item.quantity *
              item.unit_price,
          0
        );
      },
    }),
    {
      name: "restaurant-cart",
    }
  )
);