import { makeAuthenticatedApiRequest } from "@/lib/auth-utils";
import { BRANDS_URLS } from "@/lib/urls/urls";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return await makeAuthenticatedApiRequest(BRANDS_URLS.GET_ALL, {
        method: "GET"
    })
}