import SearchableDropdown from "../common/SearchAndFilter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/products";
import { getAllCategories } from "@/services/products/categories.service";
import { useEffect, useState } from "react";

interface ProductsProps {
    data: Product[];
    count?: number;
    isLoading?: boolean;
    error?: string | null;
}

const ProductFilterSection = ({ data }: ProductsProps) => {

    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // Handle mounting state
    const [mount, setMount] = useState(false);
    useEffect(() => {
        setMount(true);
    }, []);

    // Get categories
    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        enabled: !!mount
    });

    const categoryOptions =
        categories?.data?.results?.map((cat: any) => ({
            value: cat.id.toString(),
            label: cat.category_name,
        })) ?? [];

    const handleSelect = (selected: { value: string; label: string }) => {
        setSelectedCategory(selected.value);
        console.log("Selected category:", selected);
    };

    // Get sub categories



    return (
        <div>
            {/* Categories selector */}
            <SearchableDropdown
                options={categoryOptions}
                onSelect={handleSelect}
                placeholder={isLoading ? "Loading categories..." : "Select category"}
                className="w-52"
            />

            {/* Sub categories selector */}
        </div>
    );
};

export default ProductFilterSection;
