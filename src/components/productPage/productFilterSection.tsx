import SearchableDropdown from "../common/SearchAndFilter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/products";
import { getAllCategories, getAllSubCategories } from "@/services/store/products/categories.service";
import { useEffect, useState } from "react";
import { getAllMerchants } from "@/services/store/merchants/merchants.service";
import { getAllBrands } from "@/services/store/brands/brands.service";
import SearchField from "../common/SearchField";

interface ProductsProps {
    data: Product[];
    count?: number;
    isLoading?: boolean;
    error?: string | null;
}

interface ProductFilterSectionProps {
    data: ProductsProps[];
    hasSearchField?: boolean;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    selectedCategory?: string;
    setSelectedCategory?: (category: string) => void;
    selectedSubCategory?: string;
    setSelectedSubCategory?: (subCategory: string) => void;
    selectedBrand?: string;
    setSelectedBrand?: (brand: string) => void;
    selectedStatus?: string;
    setSelectedStatus?: (status: string) => void;
    selectedMerchant?: string;
    setSelectedMerchant?: (merchant: string) => void;
}

const ProductFilterSection = ({
    data,
    hasSearchField,
    searchQuery,
    setSearchQuery,
    selectedCategory = "",
    setSelectedCategory,
    selectedSubCategory = "",
    setSelectedSubCategory,
    selectedBrand = "",
    setSelectedBrand,
    selectedStatus = "",
    setSelectedStatus,
}: ProductFilterSectionProps) => {

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

    const handleCategorySelect = (selected: { value: string; label: string } | { value: string; label: string }[]) => {
        if (Array.isArray(selected)) {
            return;
        }
        setSelectedCategory?.(selected.value);
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

    const handleSubCategorySelect = (selected: { value: string; label: string } | { value: string; label: string }[]) => {
        if (Array.isArray(selected)) {
            return;
        }
        setSelectedSubCategory?.(selected.value);
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

    const handleBrandSelect = (selected: { value: string; label: string } | { value: string; label: string }[]) => {
        if (Array.isArray(selected)) {
            return;
        }
        setSelectedBrand?.(selected.value);
    };

    // Status options
    const status = [
        { name: 'Active', value: 'active' },
        { name: 'Inactive', value: 'inactive' },
        { name: 'Pending', value: 'pending' },
    ];
    const statusOptions = status.map((stat: any) => ({
        value: stat.value,
        label: stat.name,
    })) ?? [];

    const handleStatusSelect = (selected: { value: string; label: string } | { value: string; label: string }[]) => {
        if (Array.isArray(selected)) {
            return;
        }
        setSelectedStatus?.(selected.value);
    };

    return (
        <div className="w-full space-y-4">
            <div className="grid grid-cols-1 md:gri-cols-4 gap-4 lg:grid-cols-4">
                {/* Categories selector */}
                <SearchableDropdown
                    options={categoryOptions}
                    onSelect={handleCategorySelect}
                    placeholder={isLoading ? "Loading..." : "All Categories"}
                    className="w-full"
                    selected={selectedCategory}
                />

                {/* Sub categories selector */}
                <SearchableDropdown
                    options={subCategoryOptions}
                    onSelect={handleSubCategorySelect}
                    placeholder={isLoading ? "Loading..." : "All Sub Categories"}
                    className="w-full"
                    selected={selectedSubCategory}
                />

                {/* Brand selector */}
                <SearchableDropdown
                    options={barndsOptions}
                    onSelect={handleBrandSelect}
                    placeholder={isLoading ? "Loading..." : "All Brands"}
                    className="w-full"
                    selected={selectedBrand}
                />

                {/* Status selector */}
                <SearchableDropdown
                    options={statusOptions}
                    onSelect={handleStatusSelect}
                    placeholder={isLoading ? "Loading..." : "All Status"}
                    className="w-full"
                    selected={selectedStatus}
                />
            </div>

            {hasSearchField && (
                <SearchField
                    value={searchQuery}
                    onSearch={setSearchQuery}
                />
            )}
        </div>
    );
};

export default ProductFilterSection;
