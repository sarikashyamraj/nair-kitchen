import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) =>
              request.cookies.set(name, value)
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) =>
              supabaseResponse.cookies.set(
                name,
                value,
                options
              )
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/auth");

  const isPublicAuthRoute =
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/forgot-password";

  /*
   * Redirect unauthenticated users away from
   * protected Kitchen Brain pages.
   */
  if (!user && !isAuthRoute) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname = "/auth/login";

    return NextResponse.redirect(loginUrl);
  }

  /*
   * Redirect authenticated users away from
   * Login, Sign-up, and Forgot Password.
   */
  if (user && isPublicAuthRoute) {
    const dashboardUrl =
      request.nextUrl.clone();

    dashboardUrl.pathname = "/";

    return NextResponse.redirect(
      dashboardUrl
    );
  }

  return supabaseResponse;
}