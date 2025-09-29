
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

export const CreateProduct = async (formData: FormData) => {
    try {
        const response = await fetch('/api/products/create', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to create product');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating product:', error);
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
