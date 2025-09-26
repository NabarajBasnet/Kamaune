'use client';

import SearchAndFilter from '@/components/common/SearchAndFilter'
import ProductActionSection from '@/components/productPage/actionSection'
import OverviewSection from '@/components/productPage/overviewSection'
import ProductsTab from '@/components/productPage/productGridAndList'
import { GetAllProducts } from '@/services/products/product.service'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import ProductsGridList from '@/components/productPage/productGridAndList';

const Products = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => GetAllProducts()
    })

    return (
        <div className=''>
            {/* <OverviewSection /> */}
            {/* <ProductActionSection /> */}
            {/* <SearchAndFilter /> */}

            <ProductsGridList
                products={data?.data?.results || []}
                count={data?.data?.count || 0}
                isLoading={isLoading}
            />
        </div>
    )
}

export default Products