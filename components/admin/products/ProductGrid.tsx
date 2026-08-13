"use client";

import { Product } from "@/types/product";

import ProductCard from "./ProductCard";

interface Props {
  products: Product[];

  onEdit: (
    product: Product
  ) => void;

  onDelete: (
    product: Product
  ) => void;

  onToggle: (
    product: Product
  ) => void;
}

export default function ProductGrid({
  products,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}