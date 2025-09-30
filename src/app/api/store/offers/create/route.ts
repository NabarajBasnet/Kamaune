import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { OFFER_URLS } from "@/lib/urls/urls";
import { makeAuthenticatedApiRequest, makeAuthenticatedRequest, refreshAccessToken } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        console.log("Form data: ", formData)

        return await makeAuthenticatedApiRequest(OFFER_URLS.CREATE_OFFER, {
            method: "POST",
            body: formData,
        })
    } catch (error: any) {
        return error
    }
}
