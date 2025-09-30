import { Profile } from '@/components/profile/ProfilePage'

export async function generateMetadata() {
    return ({
        title: 'Profile - Kamaune Dashboard',
        description: "Profile page for kamaune dashboard"
    })

}

function ProfilePage() {
    return (
        <Profile />
    )
}

export default ProfilePage