import { Coupons } from "@/components/coupon/CouponPage";

export async function generateMetadata() {
    return ({
        title: 'Offers - Kamaune Dashboard',
        description: 'Offers - Kamaune Dashboard'
    })
}

const CouponPage = () => {
    return (
        <div>
            <Coupons />
        </div>
    )
}

export default CouponPage;
