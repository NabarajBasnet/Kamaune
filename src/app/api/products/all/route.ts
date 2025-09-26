import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PRODUCT_URLS } from "@/lib/urls/urls";
import { makeAuthenticatedRequest } from "@/lib/auth-utils";

export async function GET(_req: NextRequest) {
    try {
        const { response, newAccessToken } = await makeAuthenticatedRequest(
            PRODUCT_URLS.GET_ALL,
            { cache: "no-store" }
        );

        if (!response.ok) {
            return NextResponse.json(
                { message: "Failed to fetch products" },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Create response with updated cookies if token was refreshed
        const res = NextResponse.json(data, { status: response.status });
        
        if (newAccessToken) {
            res.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/",
                maxAge: 15 * 60,
            });
        }

        return res;
    } catch (error: unknown) {
        console.error("Products API error:", error);
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message || "Unexpected error" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Unknown error" },
            { status: 500 }
        );
    }
}
