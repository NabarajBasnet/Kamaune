import { NextRequest } from "next/server";
import { PRODUCT_URLS } from "@/lib/urls/urls";
import { makeAuthenticatedApiRequest } from "@/lib/auth-utils";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const url = new URL(req.url);
    const slug = url.pathname.split('/').pop();
    
    return await makeAuthenticatedApiRequest(`${PRODUCT_URLS.UPDATE_PRODUCT}${slug}/`, {
        method: "PATCH",
        body: JSON.stringify(body)
    })
}