"use client";

import {
  ShoppingCart,
} from "lucide-react";

import { useCartStore } from "@/stores/cart.store";

interface Props {
  onClick: () => void;
}

export default function CartButton({
  onClick,
}: Props) {
  const items =
    useCartStore(
      (state) => state.items
    );

  const quantity =
    items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-amber-600"
    >
      <ShoppingCart className="h-5 w-5" />

      {quantity > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {quantity > 99
            ? "99+"
            : quantity}
        </span>
      )}
    </button>
  );
}