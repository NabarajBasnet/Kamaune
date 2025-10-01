export const getProfileData = async () => {
    try {
        const response = await fetch(`/api/profile/userprofile`, { cache: 'no-store' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error: ", error)
        return error
    }
}

export const updateUserProfile = async (id: number, payload: FormData) => {
    try {

        console.log('Payload: ', payload);

        const response = await fetch(`/api/profile/userprofile?id=${id}`, {
            method: 'PUT',
            body: payload,
        });
        return await response.json();
    } catch (error) {
        console.log("Error: ", error)
        return error
    }
}
