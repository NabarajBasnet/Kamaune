export const getAllBrands = async () => {
    try {
        const response = await fetch('/api/store/brands/getall');
        return await response.json();
    } catch (error) {
        console.log("Error: ", error)
        return error
    }
}