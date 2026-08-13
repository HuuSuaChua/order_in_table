"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];

  addToCart: (product: Product) => void;

  removeFromCart: (productId: string) => void;

  increaseQuantity: (productId: string) => void;

  decreaseQuantity: (productId: string) => void;

  clearCart: () => void;

  totalItems: number;

  totalPrice: number;
}

const CartContext =
  createContext<CartContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function CartProvider({ children }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);

  const [hydrated, setHydrated] =
    useState(false);

  // ================================
  // Load cart từ localStorage
  // ================================

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem("restaurant_cart");

      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error(
        "Không thể load giỏ hàng:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  // ================================
  // Save cart
  // ================================

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "restaurant_cart",
      JSON.stringify(items)
    );
  }, [items, hydrated]);

  // ================================
  // Thêm sản phẩm
  // ================================

  function addToCart(product: Product) {
    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.product.id === product.id
        );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity: 1,
        },
      ];
    });
  }

  // ================================
  // Xóa sản phẩm
  // ================================

  function removeFromCart(
    productId: string
  ) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.product.id !== productId
      )
    );
  }

  // ================================
  // Tăng
  // ================================

  function increaseQuantity(
    productId: string
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  // ================================
  // Giảm
  // ================================

  function decreaseQuantity(
    productId: string
  ) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  }

  // ================================
  // Clear
  // ================================

  function clearCart() {
    setItems([]);
  }

  // ================================
  // Tổng số lượng
  // ================================

  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [items]);

  // ================================
  // Tổng tiền
  // ================================

  const totalPrice = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        Number(item.product.price) *
          item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ================================
// Hook
// ================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart phải được sử dụng bên trong CartProvider"
    );
  }

  return context;
}