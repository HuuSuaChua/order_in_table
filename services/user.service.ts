import { supabase } from "@/lib/supabase/client";
import { User, UserRole } from "@/types/user";

/**
 * Lấy danh sách tài khoản
 *
 * Chỉ lấy:
 * admin / staff / chef
 */
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("role", ["admin", "staff", "chef"])
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("getUsers error:", error);
    throw error;
  }

  return (data ?? []) as User[];
}

/**
 * Cập nhật role
 */
export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateUserRole error:", error);
    throw error;
  }

  return data as User;
}

/**
 * Tạo Staff / Chef
 *
 * KHÔNG tạo trực tiếp bằng Supabase client.
 * API server sẽ:
 *
 * 1. Tạo auth.users
 * 2. Lấy auth.users.id
 * 3. Tạo public.users
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "staff" | "chef";
}): Promise<User> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Không thể tạo tài khoản"
    );
  }

  return result.user as User;
}

/**
 * Xóa tài khoản
 *
 * Phải gọi API server vì cần xóa:
 *
 * auth.users
 * +
 * public.users
 */
export async function deleteUser(
  id: string
): Promise<void> {
  const response = await fetch(
    `/api/admin/users?id=${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.error ||
        "Không thể xóa tài khoản"
    );
  }
}