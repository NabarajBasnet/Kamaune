import ProductAddForm from "@/components/productPage/productAddForm";

export async function generateMetadata() {
    return ({
        title: "Add Product - Kamaune Dashboard",
        description: "Product add form of kamaune affiliate dashboard"
    })
}

const ProductAdd = () => {
    return (
        <div className="">
            <ProductAddForm />
        </div>
    )
}

export default ProductAdd;
