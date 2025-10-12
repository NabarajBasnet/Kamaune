import { PRODUCT_URLS } from "@/lib/urls/urls";

export async function GetAllProducts() {
    try {
        const response = await fetch('/api/products/all');
        if (!response.ok) {
            return new Error("Internal server error");
        }

        return await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Unexpected error occured')
        }
    }
}

export async function getProductBySlug(slug: string, token: string) {
    try {
        const response = await fetch(`${PRODUCT_URLS.GET_BY_SLUG}${slug}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
        return error
    }
}

export const CreateProduct = async (data: any, token: string): Promise<Response> => {
    try {
        const response = await fetch(PRODUCT_URLS.CREATE_PRODUCT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        return response;
    } catch (error: any) {
        console.error("Network Error in CreateProduct:", error);
        throw new Error("Failed to create product");
    }
};

export const updateProduct = async (data: any, slug: string, token: string): Promise<Response> => {
    try {
        console.log("Data being update: ", data);
        console.log("Token: ", token);

        if (!token) {
            throw new Error("Authentication token error");
        }

        const response = await fetch(`${PRODUCT_URLS.UPDATE_PRODUCT}${slug}/`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        return response;
    } catch (error) {
        console.error("Network Error in updateProduct:", error);
        throw new Error("Failed to update product");
    }
}

export async function deleteProduct(slug: string, token: string) {
    try {
        const response = await fetch(`${PRODUCT_URLS.DELETE_PRODUCT}${slug}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log("Error: ", error)
        throw error;
    }
}
