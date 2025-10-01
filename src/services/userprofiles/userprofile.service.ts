export const getProfileData = async () => {
    try {
        const response = await fetch(`/api/profile/userprofile`);
        return await response.json();
    } catch (error) {
        console.log("Error: ", error)
        return error
    }
}
