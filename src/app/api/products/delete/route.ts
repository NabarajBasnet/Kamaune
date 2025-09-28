import { NextRequest } from "next/server";
import { makeAuthenticatedApiRequest } from "@/lib/auth-utils";
import { PRODUCT_URLS } from "@/lib/urls/urls";

export async function DELETE(req: NextRequest) {
    const slug = new URL(req.url).searchParams.get("slug");
    return await makeAuthenticatedApiRequest(`${PRODUCT_URLS.DELETE_PRODUCT}/${slug}/`, { method: "DELETE" });
}
