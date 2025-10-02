import { NextRequest, NextResponse } from "next/server";
import { PRODUCT_URLS } from "@/lib/urls/urls";
import { makeAuthenticatedApiRequest } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
    const body = await req.json();
    return await makeAuthenticatedApiRequest(PRODUCT_URLS.CREATE_PRODUCT, {
        method: "POST",
        body: JSON.stringify(body)
    })
}
