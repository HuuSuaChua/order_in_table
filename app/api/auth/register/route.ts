import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role;

    // =========================
    // Validate
    // =========================

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          message: "Vui lòng nhập đầy đủ thông tin.",
        },
        { status: 400 }
      );
    }

    // Chỉ cho phép Staff / Chef
    if (!["staff", "chef"].includes(role)) {
      return NextResponse.json(
        {
          message:
            "Chỉ có thể tạo tài khoản Staff hoặc Chef.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Mật khẩu phải có ít nhất 6 ký tự.",
        },
        { status: 400 }
      );
    }

    // =========================
    // Kiểm tra email trong users
    // =========================

    const {
      data: existingUser,
      error: existingUserError,
    } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) {
      console.error(
        "Check existing user error:",
        existingUserError
      );

      return NextResponse.json(
        {
          message: "Không thể kiểm tra tài khoản.",
        },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email này đã được sử dụng.",
        },
        { status: 409 }
      );
    }

    // =========================
    // 1. Tạo Auth User
    // =========================

    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,

        // Không cần xác thực email
        email_confirm: true,

        user_metadata: {
          name,
          role,
        },
      });

    if (authError) {
      console.error(
        "Create Auth user error:",
        authError
      );

      return NextResponse.json(
        {
          message: authError.message,
        },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          message: "Không thể tạo tài khoản Auth.",
        },
        { status: 500 }
      );
    }

    const authUserId = authData.user.id;

    // =========================
    // 2. Tạo public.users
    // =========================

    const {
      data: user,
      error: userError,
    } = await supabaseAdmin
      .from("users")
      .insert({
        id: authUserId,
        name,
        email,
        role,
      })
      .select(
        "id, name, email, role, created_at, updated_at"
      )
      .single();

    // =========================
    // Nếu tạo users thất bại
    // → xóa Auth User
    // =========================

    if (userError) {
      console.error(
        "Create public.users error:",
        userError
      );

      await supabaseAdmin.auth.admin.deleteUser(
        authUserId
      );

      return NextResponse.json(
        {
          message:
            "Không thể tạo thông tin người dùng.",
        },
        { status: 500 }
      );
    }

    // =========================
    // Thành công
    // =========================

    return NextResponse.json(
      {
        success: true,
        message: `Tạo tài khoản ${role} thành công.`,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Register API error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Đã xảy ra lỗi khi tạo tài khoản.",
      },
      { status: 500 }
    );
  }
}