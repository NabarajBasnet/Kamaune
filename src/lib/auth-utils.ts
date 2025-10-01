import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_URLS } from "@/lib/urls/urls";

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
        const refreshResponse = await fetch(AUTH_URLS.REFRESH, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshResponse.ok) {
            return null;
        }

        const refreshData = await refreshResponse.json();
        return refreshData?.data?.tokens?.access || refreshData?.access || null;
    } catch (error) {
        console.error("Token refresh failed:", error);
        return null;
    }
}

export async function makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
): Promise<{ response: Response; newAccessToken?: string }> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        const doFetch = async (token?: string) => {
            // Avoid forcing JSON content-type when sending FormData (e.g., multipart uploads)
            const isFormData =
                typeof FormData !== "undefined" && options.body instanceof FormData;

            const mergedHeaders: HeadersInit = {
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                ...(options.headers || {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            return fetch(url, {
                ...options,
                headers: mergedHeaders,
                credentials: "include",
            });
        };

        if (!accessToken && refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                const response = await doFetch(newAccessToken);
                return { response, newAccessToken };
            }
            const response = await doFetch();
            return { response };
        }

        let response = await doFetch(accessToken);

        if (response.status !== 401) {
            return { response };
        }

        if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                response = await doFetch(newAccessToken);
                return { response, newAccessToken };
            }
        }

        return { response };
    } catch (error) {
        console.error("Error in makeAuthenticatedRequest: ", error);
        throw error;
    }
}

export async function makeAuthenticatedApiRequest(
    url: string,
    options: RequestInit = {},
    { raw = false } = {}
): Promise<NextResponse | Response> {
    try {
        const { response, newAccessToken } = await makeAuthenticatedRequest(url, options);

        if (raw) {
            return response;
        }

        let data;
        try {
            data = await response.json();
        } catch {
            data = { message: response.statusText, status: response.status };
        }

        const nextResponse = NextResponse.json(data, { status: response.status });

        if (newAccessToken) {
            nextResponse.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 15 * 60,
            });
        }

        return nextResponse;
    } catch (error: any) {
        console.error("Error in makeAuthenticatedApiRequest:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message || "Unknown" },
            { status: 500 }
        );
    }
}

export function setAccessTokenCookie(response: NextResponse, accessToken: string): void {
    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
    });
}

export function clearAuthCookies(response: NextResponse): void {
    response.cookies.set("accessToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
    });
    response.cookies.set("refreshToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
    });
}
