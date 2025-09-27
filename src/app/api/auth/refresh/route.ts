import { NextRequest, NextResponse } from "next/server";
import { AUTH_URLS } from "@/lib/urls/urls";
import { setAccessTokenCookie, clearAuthCookies } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const refresh = request.cookies.get("refreshToken")?.value;
    if (!refresh) {
      return NextResponse.json(
        { message: "Missing refresh token" },
        { status: 401 }
      );
    }

    const upstream = await fetch(AUTH_URLS.REFRESH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const res = NextResponse.json(
        { message: data?.message || "Refresh failed" },
        { status: 401 }
      );
      clearAuthCookies(res);
      return res;
    }

    const newAccess = data?.data?.tokens?.access || data?.access;
    if (!newAccess) {
      return NextResponse.json(
        { message: "Invalid refresh response" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ message: "ok" });
    setAccessTokenCookie(res, newAccess);
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
