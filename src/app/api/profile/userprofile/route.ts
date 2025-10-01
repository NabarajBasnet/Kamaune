import { makeAuthenticatedApiRequest } from "@/lib/auth-utils";
import { USER_PROFILES } from "@/lib/urls/urls";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await makeAuthenticatedApiRequest(USER_PROFILES.GET_PROFILE, {
            method: "GET"
        })
        return response;
    } catch (error) {
        console.log("Error: ", error)
        return error
    }
}

export async function PUT(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        const payload = await req.json()
        console.log("Payload: ", payload)
        const response = await makeAuthenticatedApiRequest(`${USER_PROFILES.PUT_PROFILE}/${id}/`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });

        return response as Response;
    } catch (error: any) {
        console.log("Error: ", error)
        return new Response(JSON.stringify({ message: "Failed to update profile", error: error?.message || "Unknown" }), { status: 500 });
    }
}
