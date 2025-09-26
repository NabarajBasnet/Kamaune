import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ message: "ok" });
  res.cookies.set("accessToken", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("refreshToken", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}


