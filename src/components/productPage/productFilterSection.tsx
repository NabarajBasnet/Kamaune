import SearchableDropdown from "../common/SearchAndFilter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/products";
import { getAllCategories, getAllSubCategories } from "@/services/store/products/categories.service";
import { useEffect, useState } from "react";
import { getAllMerchants } from "@/services/store/merchants/merchants.service";
import { getAllBrands } from "@/services/store/brands/brands.service";

interface ProductsProps {
    data: Product[];
    count?: number;
    isLoading?: boolean;
    error?: string | null;
}

const ProductFilterSection = ({ data }: ProductsProps) => {

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [selectedMerchant, setSelectedMerchant] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");

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
    });

    const subCategoryOptions = subcategories?.results?.map((cat: any) => ({
        value: cat.id.toString(),
        label: cat.sub_category_name,
    })) ?? [];

    const handleSubCategorySelect = (selected: { value: string; label: string }) => {
        setSelectedSubCategory(selected.value);
    };

    // Get merchants
    const { data: merchants, isLoading: isMerchantsLoading } = useQuery({
        queryKey: ['merchants'],
        queryFn: () => getAllMerchants()
    });


    const merchantsOptions = merchants?.data?.results?.map((merchant: any) => ({
        value: merchant.id.toString(),
        label: merchant.name,
    })) ?? [];

    const handleMerchantSelect = (selected: { value: string; label: string }) => {
        setSelectedMerchant(selected.value);
    };

    // Get all brands
    const { data: brands, isLoading: isBrandsLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: () => getAllBrands()
    })

    const barndsOptions = brands?.data?.results?.map((brand: any) => ({
        value: brand.id.toString(),
        label: brand.name,
    })) ?? [];

    const handleBrandSelect = (selected: { value: string; label: string }) => {
        setSelectedBrand(selected.value);
    };

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

            {/* Merchant selector */}
            <SearchableDropdown
                options={merchantsOptions}
                onSelect={handleMerchantSelect}
                placeholder={isLoading ? "Loading merchants..." : "All Merchants"}
                className="w-52"
            />

            {/* Brand selector */}
            <SearchableDropdown
                options={barndsOptions}
                onSelect={handleBrandSelect}
                placeholder={isLoading ? "Loading brands..." : "All Brands"}
                className="w-52"
            />
        </div>
    );
};

export default ProductFilterSection;
