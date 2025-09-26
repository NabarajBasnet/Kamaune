import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PRODUCT_URLS } from "@/lib/urls/urls";

export async function GET(_req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: "No access token" },
                { status: 401 }
            );
        }

        const upstream = await fetch(PRODUCT_URLS.GET_ALL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!upstream.ok) {
            NextResponse.json(
                { message: "Internal server error" },
                { status: 500 }
            )
        };

        const data = await upstream.json();

        return NextResponse.json(data, { status: upstream.status });
    } catch (error: unknown) {
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
