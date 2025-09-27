import { CATEGORIES_URLS } from "@/lib/urls/urls";
import { makeAuthenticatedApiRequest } from "@/lib/auth-utils";

export async function GET() {
    return await makeAuthenticatedApiRequest(CATEGORIES_URLS.GET_ALL_SUBCATEGORIES, {
        method: "GET",
    });
}
