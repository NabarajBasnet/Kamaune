import Offers from '@/components/offers/OfferComponent'

export async function generateMetadata() {
    return ({
        title: 'Offers - Kamaune Dashboard',
        description: "Offers page for kamaune dashboard"
    })

}

function OfferPage() {
    return (
        <Offers />
    )
}

export default OfferPage