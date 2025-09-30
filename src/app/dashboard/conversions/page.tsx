import { Conversions } from "@/components/conversions/Conversions";

export async function generateMetadata() {
    return ({
        title: 'Conversions - Kamaune Dashboard',
        description: 'Conversions - Kamaune Dashboard'
    })
}

const ConversionsPage = () => {
    return (
        <div>
            <Conversions />
        </div>
    )
}

export default ConversionsPage;
