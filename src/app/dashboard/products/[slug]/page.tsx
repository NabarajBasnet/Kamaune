import ProductEditForm from "@/components/productPage/productEditPage"

export default async function ProductEdit({ params }: { params: { slug: string } }) {
    const { slug } = await params
    return (
        <ProductEditForm slug={slug} />
    )
}