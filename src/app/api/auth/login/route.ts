import { NextRequest, NextResponse } from "next/server";
import { AUTH_URLS } from "@/lib/urls/urls";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const upstream = await fetch(AUTH_URLS.LOG_IN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data?.message || "Login failed", errors: data?.errors },
        { status: upstream.status }
      );
    }

    const access = data?.data?.tokens?.access;
    const refresh = data?.data?.tokens?.refresh;
    const userEmail = data?.data?.email;

    if (!access || !refresh) {
      return NextResponse.json(
        { message: "Invalid auth response" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({
      data: { email: userEmail },
      message: "ok",
    });

    // Set httpOnly cookies
    res.cookies.set("accessToken", access, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    res.cookies.set("refreshToken", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
