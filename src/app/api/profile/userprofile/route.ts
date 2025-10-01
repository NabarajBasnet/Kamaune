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
        if (!id) {
            return new Response(JSON.stringify({ message: "Missing profile id" }), { status: 400 });
        }

        const formData = await req.formData();

        const response = await makeAuthenticatedApiRequest(`${USER_PROFILES.GET_PROFILE}/${id}/`, {
            method: "PUT",
            body: formData,
        }, { raw: true });

        return response as Response;
    } catch (error: any) {
        console.log("Error: ", error)
        return new Response(JSON.stringify({ message: "Failed to update profile", error: error?.message || "Unknown" }), { status: 500 });
    }
}
