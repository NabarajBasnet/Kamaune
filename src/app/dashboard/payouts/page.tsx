import { Payouts } from '@/components/payouts/page'

export async function generateMetadata() {
    return ({
        title: 'Payouts - Kamaune Dashboard',
        description: "Payouts page for kamaune dashboard"
    })

}

function PayoutPage() {
    return (
        <Payouts />
    )
}

export default PayoutPage