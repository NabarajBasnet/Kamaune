import MainProductPage from "@/components/productPage/main";

export async function generateMetadata() {
    return ({
        title: "Products - Kamaune Dashboard",
        description: "Products add form of kamaune affiliate dashboard"
    })
}

const Products = () => {
    return (
        <div>
            <MainProductPage />
        </div>
    )
}

export default Products;
