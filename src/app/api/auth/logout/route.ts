import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ message: "ok" });
  clearAuthCookies(res);
  return res;
}


