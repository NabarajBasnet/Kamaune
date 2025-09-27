
export const getAllCategories = async () => {
    try {
        const response = await fetch(`/api/store/categories/allcategories`);
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
        return error
    }
};

export const getAllSubCategories = async () => {
    try {
        const response = await fetch('/api/store/categories/subcategories')
        return await response.json();
    } catch (error) {
        console.log("Error: ", error)
        return error
    }
};
