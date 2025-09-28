
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

export const CreateProduct = async (productData: any) => {
    try {
        const response = await fetch('/api/products/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
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

export const CreateProductWithFormData = async (formData: FormData) => {
    try {
        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await fetch('/api/products/create', {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();
        console.log('Service response status:', response.status);
        console.log('Service response data:', responseData);

        if (!response.ok) {
            console.error('Service error response:', responseData);
            throw new Error(`Failed to create product: ${responseData.error || responseData.message || 'Unknown error'}`);
        }

        return responseData;
    } catch (error) {
        console.error('Error creating product with images:', error);
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
