export const getAllMerchants = async () => {
    try {
        const response = await fetch('/api/store/merchants/getall');
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
        return error;
    }
}