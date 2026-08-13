import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createServerClient } from "@supabase/ssr";

export async function middleware(
  request: NextRequest
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({ name, value }) => {
                request.cookies.set(
                  name,
                  value
                );
              }
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options
                );
              }
            );
          },
        },
      }
    );

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

  // ==================================
  // Chưa đăng nhập
  // ==================================

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !user
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );
  }

  if (
    pathname.startsWith("/staff") &&
    !user
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );
  }

  if (
    pathname.startsWith("/chef") &&
    !user
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );
  }

  // ==================================
  // Đã đăng nhập
  // ==================================

  if (user) {
    const { data: profile } =
      await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

    const role =
      profile?.role;

    // Admin
    if (
      pathname.startsWith("/admin") &&
      pathname !== "/admin/login" &&
      role !== "admin"
    ) {
      return redirectByRole(
        role,
        request
      );
    }

    // Staff
    if (
      pathname.startsWith("/staff") &&
      role !== "staff"
    ) {
      return redirectByRole(
        role,
        request
      );
    }

    // Chef
    if (
      pathname.startsWith("/chef") &&
      role !== "chef"
    ) {
      return redirectByRole(
        role,
        request
      );
    }
  }

  return response;
}

function redirectByRole(
  role: string | undefined,
  request: NextRequest
) {
  switch (role) {
    case "admin":
      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url
        )
      );

    case "staff":
      return NextResponse.redirect(
        new URL(
          "/staff",
          request.url
        )
      );

    case "chef":
      return NextResponse.redirect(
        new URL(
          "/chef",
          request.url
        )
      );

    default:
      return NextResponse.redirect(
        new URL(
          "/admin/login",
          request.url
        )
      );
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/chef/:path*",
  ],
};