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

export const CreateProduct = async (data: any, token: string) => {
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
    } catch (error) {
        console.error('Network error:', error);
        throw error;
    }
};

export async function deleteProduct(slug: string) {
    try {
        const response = await fetch(`/api/products/delete?slug=${slug}`, {
            method: "DELETE"
        });
        return await response.json()
    } catch (error) {
        console.log("Error: ", error)
        throw error;
    }
}
