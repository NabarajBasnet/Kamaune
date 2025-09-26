import { NextResponse, NextRequest } from "next/server";

// Protect dashboard routes; redirect unauthenticated users to /login
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  const accessToken = request.cookies.get("accessToken")?.value;

  if (isDashboard && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
