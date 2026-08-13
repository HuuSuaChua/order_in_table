import { supabase } from "@/lib/supabase/client";
import { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createCategory(data: {
  name: string;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
}) {
  const { data: category, error } = await supabase
    .from("categories")
    .insert({
      name: data.name,
      description: data.description ?? null,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return category as Category;
}

export async function updateCategory(
  id: string,
  data: Partial<{
    name: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
  }>
) {
  const { data: category, error } = await supabase
    .from("categories")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return category as Category;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}