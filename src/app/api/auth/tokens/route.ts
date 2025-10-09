import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value
        const refreshToken = cookieStore.get("refreshToken")?.value

        if (!accessToken && refreshToken) {
            // Refresh tokens
            await fetch('/api/auth/refresh', {
                method: "POST"
            });
        }

        if (!accessToken && !refreshToken) {
            return NextResponse.json({
                data: 'Unauthorized'
            }, { status: 401 });
        }

        return NextResponse.json({
            data: { accessToken, refreshToken }
        }, { status: 200 });

    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({
            'error': error
        }, { status: 500 })
    }
}