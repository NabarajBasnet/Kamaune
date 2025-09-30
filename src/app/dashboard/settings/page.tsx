import { Settings } from '@/components/settings/SettingsPage'

export async function generateMetadata() {
    return ({
        title: 'Settings - Kamaune Dashboard',
        description: "Settings page for kamaune dashboard"
    })

}

function SettingsPage() {
    return (
        <Settings />
    )
}

export default SettingsPage;
