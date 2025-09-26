import { cookies } from "next/headers";
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
): Promise<{ response: Response; newAccessToken?: string; shouldRetry?: boolean }> {

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            ...options.headers,
        },
    });

    if (!refreshToken) {
        console.log("No refresh token found, cannot refresh");
        return { response };
    }

    if (response.status === 401) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {

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
