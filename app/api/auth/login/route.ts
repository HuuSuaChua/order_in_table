import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Vui lòng nhập email và mật khẩu.",
        },
        { status: 400 }
      );
    }

    const supabase =
      await createSupabaseServerClient();

    // Đăng nhập Supabase Auth
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          message: "Email hoặc mật khẩu không chính xác.",
        },
        { status: 401 }
      );
    }

    // Lấy thông tin role
    const {
      data: user,
      error: userError,
    } = await supabase
      .from("users")
      .select(
        "id, name, email, role, created_at, updated_at"
      )
      .eq("id", authData.user.id)
      .single();

    if (userError || !user) {
      await supabase.auth.signOut();

      return NextResponse.json(
        {
          message:
            "Tài khoản chưa được cấu hình.",
        },
        { status: 403 }
      );
    }

    if (
      !["admin", "staff", "chef"].includes(
        user.role
      )
    ) {
      await supabase.auth.signOut();

      return NextResponse.json(
        {
          message: "Tài khoản không có quyền truy cập.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message: "Đã xảy ra lỗi khi đăng nhập.",
      },
      { status: 500 }
    );
  }
}