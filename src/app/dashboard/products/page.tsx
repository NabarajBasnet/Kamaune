'use client';

import SearchAndFilter from '@/components/common/SearchAndFilter'
import ProductActionSection from '@/components/productPage/actionSection'
import OverviewSection from '@/components/productPage/overviewSection'
import ProductsTab from '@/components/productPage/productsTab'
import { GetAllProducts } from '@/services/products/product.service'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const Products = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => GetAllProducts()
    })

    console.log("Data: ", data);

    return (
        <div>
            <OverviewSection />
            <ProductActionSection />
            <SearchAndFilter />
            <ProductsTab />
        </div>
    )
}

export default Products
