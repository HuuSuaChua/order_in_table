import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const allowedRoles = ["staff", "chef"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      password,
      role,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          error: "Vui lòng nhập họ tên",
        },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        {
          error: "Vui lòng nhập email",
        },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          error: "Mật khẩu phải có ít nhất 6 ký tự",
        },
        { status: 400 }
      );
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          error: "Role không hợp lệ",
        },
        { status: 400 }
      );
    }

    // =========================
    // Tạo tài khoản Supabase Auth
    // =========================

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json(
        {
          error: authError.message,
        },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          error: "Không tạo được tài khoản Auth",
        },
        { status: 500 }
      );
    }

    // =========================
    // Tạo profile public.users
    // =========================

    const {
      data: user,
      error: userError,
    } = await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        name: name.trim(),
        email: email.trim(),
        role,
      })
      .select()
      .single();

    if (userError) {
      // Nếu tạo profile thất bại
      // xóa luôn Auth User để tránh tài khoản rác

      await supabaseAdmin.auth.admin.deleteUser(
        authData.user.id
      );

      return NextResponse.json(
        {
          error: userError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Tạo tài khoản thành công",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      {
        error: "Đã xảy ra lỗi khi tạo tài khoản",
      },
      {
        status: 500,
      }
    );
  }
  
}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Thiếu user id",
        },
        { status: 400 }
      );
    }

    // Không cho xóa nếu không tìm thấy user
    const {
      data: user,
      error: findError,
    } = await supabaseAdmin
      .from("users")
      .select("id, role")
      .eq("id", id)
      .single();

    if (findError || !user) {
      return NextResponse.json(
        {
          error: "Không tìm thấy tài khoản",
        },
        { status: 404 }
      );
    }

    // Không cho API này xóa admin
    if (user.role === "admin") {
      return NextResponse.json(
        {
          error: "Không thể xóa tài khoản admin",
        },
        { status: 403 }
      );
    }

    // Xóa Auth User
    const {
      error: authError,
    } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      return NextResponse.json(
        {
          error: authError.message,
        },
        { status: 400 }
      );
    }

    // Xóa profile
    await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", id);

    return NextResponse.json({
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return NextResponse.json(
      {
        error: "Không thể xóa tài khoản",
      },
      {
        status: 500,
      }
    );
  }
}