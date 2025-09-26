import { NextRequest, NextResponse } from "next/server";
import { AUTH_URLS } from "@/lib/urls/urls";

export async function POST(request: NextRequest) {
  try {
    const refresh = request.cookies.get("refreshToken")?.value;
    console.log("Refresh in refresh: ", refresh)
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
      // Clear cookies if refresh is invalid
      const res = NextResponse.json(
        { message: data?.message || "Refresh failed" },
        { status: 401 }
      );
      res.cookies.set("accessToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      res.cookies.set("refreshToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    const newAccess = data?.data?.tokens?.access || data?.access;
    console.log('New Access: ', newAccess)
    if (!newAccess) {
      return NextResponse.json(
        { message: "Invalid refresh response" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ message: "ok" });
    res.cookies.set("accessToken", newAccess, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
