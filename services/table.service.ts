import { supabase } from "@/lib/supabase/client";
import { RestaurantTable } from "@/types/table";

export async function getTables(): Promise<RestaurantTable[]> {
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("getTables error:", error);
    throw error;
  }

  return data ?? [];
}

export async function createTable(
  tableName: string,
  tableCode: string,
  qrToken: string
): Promise<RestaurantTable> {
  const { data, error } = await supabase
    .from("tables")
    .insert({
      table_name: tableName,
      table_code: tableCode,
      qr_token: qrToken,
      status: "available",
    })
    .select()
    .single();

  if (error) {
    console.error("createTable error:", error);
    throw error;
  }

  return data;
}

export async function deleteTable(id: string) {
  const { error } = await supabase
    .from("tables")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteTable error:", error);
    throw error;
  }
}