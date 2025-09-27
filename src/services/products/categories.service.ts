
export const getAllCategories = async () => {
    try {
        const response = await fetch(`/api/categories`);
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
        return error
    }
}