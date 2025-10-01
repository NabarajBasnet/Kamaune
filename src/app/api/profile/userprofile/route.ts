import { makeAuthenticatedApiRequest, makeAuthenticatedRequest } from "@/lib/auth-utils";
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
