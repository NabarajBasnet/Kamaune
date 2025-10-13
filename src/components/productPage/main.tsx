'use client';

import ProductActionSection from '@/components/productPage/actionSection'
import { GetAllProducts } from '@/services/store/products/product.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ProductsGridList from '@/components/productPage/productGridAndList';
import StatCardSection from '@/components/productPage/statCardSection';
import ProductFilterSection from '@/components/productPage/productFilterSection';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const MainProductPage = () => {

    const [category, setCategory] = useState<string>("");
    const [subCategory, setSubCategory] = useState<string>("");
    const [brands, setBrands] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [merchant, setMerchant] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState<string>('');

    const accessToken = useSelector((state: any) => state.auth.accessToken);
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['products', searchQuery, category, subCategory, brands, status, merchant],
        queryFn: () => GetAllProducts(accessToken, {
            search: searchQuery,
            category,
            subCategory,
            brand: brands,
            status,
            merchant
        }),
        enabled: !!accessToken
    })

    // Function to handle refresh
    const handleRefresh = () => {
        refetch();
    };

    // Function to reset all filters
    const handleResetFilters = () => {
        setCategory("");
        setSubCategory("");
        setBrands("");
        setStatus("");
        setMerchant("");
        setSearchQuery("");
    };

    return (
        <div className='space-y-4'>
            <StatCardSection
                products={data?.data?.results}
                showStats={true}
            />

            <ProductActionSection
                products={data?.data?.results || []}
                filters={{
                    search: searchQuery,
                    category,
                    subCategory,
                    brand: brands,
                    status,
                    merchant
                }}
                onRefresh={handleRefresh}
                onResetFilters={handleResetFilters}
            />
            <ProductFilterSection
                data={data?.data?.results}
                hasSearchField={true}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={category}
                setSelectedCategory={setCategory}
                selectedSubCategory={subCategory}
                setSelectedSubCategory={setSubCategory}
                selectedBrand={brands}
                setSelectedBrand={setBrands}
                selectedStatus={status}
                setSelectedStatus={setStatus}
            />

            <ProductsGridList
                products={data?.data?.results || []}
                count={data?.data?.count || 0}
                isLoading={isLoading}
            />
        </div>
    )
}

export default MainProductPage;

