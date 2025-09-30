export const getOffers = async () => {
    try {
        const response = await fetch('/api/store/offers/getall');
        return await response.json();
    } catch (error) {
        console.log("Error");
        return error
    }
}

export const createOffer = async (formData: FormData) => {
    try {
        const response = await fetch('/api/store/offers/create', {
            method: 'POST',
            body: formData,
        });
        const resBody = await response.json();
        console.log("Resbody: ", resBody)
        return resBody
    } catch (error) {
        console.log("Error: ", error)
        return error;
    }
}
