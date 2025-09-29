'use client';

import ProductActionSection from '@/components/productPage/actionSection'
import { GetAllProducts } from '@/services/store/products/product.service'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import ProductsGridList from '@/components/productPage/productGridAndList';
import StatCardSection from '@/components/productPage/statCardSection';
import ProductFilterSection from '@/components/productPage/productFilterSection';

const Products = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => GetAllProducts()
    })

    return (
        <div className='space-y-4'>
            <StatCardSection
                products={data?.data?.results}
                showStats={true}
            />

            <ProductActionSection />
            <ProductFilterSection data={data?.data?.results} hasSearchField={true} />

            <ProductsGridList
                products={data?.data?.results || []}
                count={data?.data?.count || 0}
                isLoading={isLoading}
            />
        </div>
    )
}

export default Products;
