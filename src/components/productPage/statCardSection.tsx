import React from 'react';
import { Card } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { Product } from '@/types/products';

interface OverviewSectionProps {
    products: Product[];
    showStats?: boolean;
}

function StatCardSection({ products = [], showStats = true }: OverviewSectionProps) {
    // Calculate statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(product =>
        !product.product_end_datetime || new Date(product.product_end_datetime) > new Date()
    ).length;

    const heroProducts = products.filter(product => product.is_hero_product).length;

    // Calculate unique merchants
    const uniqueMerchants = new Set(products.map(product => product.merchant?.id)).size;

    // Calculate top category
    const categoryCounts = products.reduce((acc, product) => {
        const categoryName = product.category?.category_name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.keys(categoryCounts).reduce((a, b) =>
        categoryCounts[a] > categoryCounts[b] ? a : b, 'No categories'
    );

    // Calculate average price
    const validPrices = products.filter(p => p.price > 0).map(p => p.price);
    const averagePrice = validPrices.length > 0
        ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
        : 0;

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 transition-opacity duration-500 ${showStats ? "opacity-100" : "opacity-0"}`}>
            {/* Total Products Card */}
            <Card className="glass rounded-xl p-4 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Products
                    </h3>
                    <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                    {totalProducts.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    +15% from last month
                </p>
            </Card>

            {/* Active Products Card */}
            <Card className="glass rounded-xl p-4 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Active Products
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-emerald-600 dark:bg-emerald-400"></div>
                    </div>
                </div>
                <p className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                    {activeProducts.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Active campaigns
                </p>
            </Card>

            {/* Top Category Card */}
            <Card className="glass rounded-xl p-4 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Top Category
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                    </div>
                </div>
                <p className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                    {topCategory}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                    {categoryCounts[topCategory] || 0} products
                </p>
            </Card>

            {/* Hero Products Card */}
            <Card className="glass rounded-xl p-4 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Hero Products
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                    </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                    {heroProducts}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                    Featured products
                </p>
            </Card>

            {/* Merchants Card */}
            <Card className="glass rounded-xl p-4 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Merchants
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Package className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
                    </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                    {uniqueMerchants}
                </p>
                <p className="text-sm text-indigo-700 dark:text-indigo-400">
                    Active merchants
                </p>
            </Card>

            {/* Average Price Card */}
            <Card className="glass rounded-xl p-4 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Average Price
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="text-green-700 dark:text-green-400 font-bold text-sm">
                            ₹
                        </span>
                    </div>
                </div>
                <p className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                    ₹{averagePrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                    Across all products
                </p>
            </Card>
        </div>
    );
}

export default StatCardSection;