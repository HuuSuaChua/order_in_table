import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase =
      await createSupabaseServerClient();

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Không thể đăng xuất.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đăng xuất thành công.",
    });
  } catch (error) {
    console.error(
      "POST /api/auth/logout:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Đã xảy ra lỗi khi đăng xuất.",
      },
      { status: 500 }
    );
  }
}