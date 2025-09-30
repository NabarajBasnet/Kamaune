import Campaigns from "@/components/campaings/CampaignPage";

export async function generateMetadata() {
    return ({
        title: 'Campaings - Kamaune Dashboard',
        description: 'Campaings - Kamaune Dashboard'
    })
}

const CampaingsPage = () => {
    return (
        <div>
            <Campaigns />
        </div>
    )
}

export default CampaingsPage;
