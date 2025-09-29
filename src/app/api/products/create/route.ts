import { NextRequest, NextResponse } from "next/server";
import { PRODUCT_URLS } from "@/lib/urls/urls";
import { makeAuthenticatedApiRequest } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const response = await makeAuthenticatedApiRequest(
        PRODUCT_URLS.CREATE_PRODUCT,
        { method: "POST", body: formData },
        { raw: true }
    );

    return new NextResponse(response.body, {
        status: response.status,
        headers: response.headers,
    });
}
