import { cookies } from "next/headers";
import { AUTH_URLS } from "@/lib/urls/urls";

/**
 * Helper function to refresh access token
 */
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

/**
 * Helper function to make authenticated request with automatic token refresh
 * This is the professional way to handle token refresh in API routes
 */
export async function makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
): Promise<{ response: Response; newAccessToken?: string; shouldRetry?: boolean }> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
        return {
            response: new Response(JSON.stringify({ message: "No authentication tokens" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            })
        };
    }

    // First attempt with current access token
    let response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            ...options.headers,
        },
    });

    // If we get 401, try to refresh the token
    if (response.status === 401) {
        console.log("Access token expired, attempting refresh...");
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
            console.log("Token refreshed successfully, retrying request...");

            // Retry the request with new token
            response = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${newAccessToken}`,
                    ...options.headers,
                },
            });

            return { response, newAccessToken, shouldRetry: true };
        } else {
            console.log("Token refresh failed, clearing cookies");
            // Clear invalid tokens
            cookieStore.set("accessToken", "", {
                httpOnly: true,
                path: "/",
                maxAge: 0,
            });
            cookieStore.set("refreshToken", "", {
                httpOnly: true,
                path: "/",
                maxAge: 0,
            });
        }
    }

    return { response };
}
