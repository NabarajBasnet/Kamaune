import { NextRequest, NextResponse } from "next/server";
import { PRODUCT_URLS } from "@/lib/urls/urls";
import { makeAuthenticatedApiRequest } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type');

        if (contentType?.includes('multipart/form-data')) {
            const formData = await req.formData();

            const response = await makeAuthenticatedApiRequest(`${PRODUCT_URLS.CREATE_PRODUCT}/`, {
                method: "POST",
                body: formData,
            });

            const resBody = await response.json();
            console.log('Backend response status:', response.status);
            console.log('Backend response body:', resBody);

            if (!response.ok) {
                console.error('Backend error details:', resBody);
                return NextResponse.json(
                    { error: "API returned an error", status: response.status, resBody },
                    { status: response.status }
                );
            }

            return NextResponse.json(resBody, { status: 200 });

        } else {
            const body = await req.json();

            const response = await makeAuthenticatedApiRequest(`${PRODUCT_URLS.CREATE_PRODUCT}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const resBody = await response.json();
            console.log("Res body:2: ", resBody)

            if (!response.ok) {
                return NextResponse.json(
                    { error: "API returned an error", status: response.status, resBody },
                    { status: response.status }
                );
            }

            return NextResponse.json(resBody, { status: 200 });
        }
    } catch (error) {
        console.error("Error in route:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
