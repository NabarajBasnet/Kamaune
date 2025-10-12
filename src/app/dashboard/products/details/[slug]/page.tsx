import ProductDetails from "@/components/productPage/productDetails"


export default async function ViewProductDetail({ params }: { params: { slug: string } }) {
    const { slug } = await params
    return (
        <ProductDetails slug={slug} />
    )
}