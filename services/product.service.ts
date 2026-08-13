import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/product";

export interface ProductPayload {
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

// ===============================
// GET ALL PRODUCTS
// ===============================

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (
        id,
        name
      )
    `)
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("getProducts error:", error);
    throw error;
  }

  return (data ?? []) as Product[];
}

// ===============================
// GET PRODUCT
// ===============================

export async function getProduct(
  id: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (
        id,
        name
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProduct error:", error);
    return null;
  }

  return data as Product;
}

// ===============================
// CREATE
// ===============================

export async function createProduct(
  product: ProductPayload
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: product.category_id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      is_available: product.is_available,
      sort_order: product.sort_order,
    })
    .select(`
      *,
      category:categories (
        id,
        name
      )
    `)
    .single();

  if (error) {
    console.error("createProduct error:", error);
    throw error;
  }

  return data as Product;
}

// ===============================
// UPDATE
// ===============================

export async function updateProduct(
  id: string,
  product: Partial<ProductPayload>
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select(`
      *,
      category:categories (
        id,
        name
      )
    `)
    .single();

  if (error) {
    console.error("updateProduct error:", error);
    throw error;
  }

  return data as Product;
}

// ===============================
// DELETE
// ===============================

export async function deleteProduct(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteProduct error:", error);
    throw error;
  }
}