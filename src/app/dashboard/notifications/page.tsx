import { Notifications } from "@/components/notifications/NotificationPage";

export async function generateMetadata() {
    return ({
        title: 'Notifications - Kamaune Dashboard',
        description: 'Notifications - Kamaune Dashboard'
    })
}

const NotificationPage = () => {
    return (
        <div>
            <Notifications />
        </div>
    )
}

export default NotificationPage;
