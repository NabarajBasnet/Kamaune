import SearchableDropdown from "../common/SearchAndFilter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/products";
import { getAllCategories, getAllSubCategories } from "@/services/products/categories.service";
import { useEffect, useState } from "react";

interface ProductsProps {
    data: Product[];
    count?: number;
    isLoading?: boolean;
    error?: string | null;
}

const ProductFilterSection = ({ data }: ProductsProps) => {

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

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

    const handleCategorySelect = (selected: { value: string; label: string }) => {
        setSelectedCategory(selected.value);
    };

    // Get sub categories
    const { data: subcategories, isLoading: isSubCategoriesLoading } = useQuery({
        queryKey: ['subcategories'],
        queryFn: () => getAllSubCategories()
    })

    const subCategoryOptions = subcategories?.results?.map((cat: any) => ({
        value: cat.id.toString(),
        label: cat.sub_category_name,
    })) ?? [];

    const handleSubCategorySelect = (selected: { value: string; label: string }) => {
        setSelectedSubCategory(selected.value);
    };

    console.log('Sub categories: ', subcategories)

    return (
        <div className="grid grid-cols-1 md:gri-cols-4 lg:grid-cols-5">
            {/* Categories selector */}
            <SearchableDropdown
                options={categoryOptions}
                onSelect={handleCategorySelect}
                placeholder={isLoading ? "Loading categories..." : "All Categories"}
                className="w-52"
            />

            {/* Sub categories selector */}
            <SearchableDropdown
                options={subCategoryOptions}
                onSelect={handleSubCategorySelect}
                placeholder={isLoading ? "Loading sub categories..." : "All Sub Categories"}
                className="w-52"
            />
        </div>
    );
};

export default ProductFilterSection;
