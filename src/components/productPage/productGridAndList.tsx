import React, { useState } from 'react';
import { Grid, List, Copy, Edit3, Trash2 } from 'lucide-react';
import { Product } from '@/types/products';

interface ProductsGridListProps {
    products: Product[];
    count: number;
    isLoading?: boolean;
    error?: string | null;
}

function ProductsGridList({
    products,
    count,
}: ProductsGridListProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Handle case when products is undefined or null
    if (!products) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-yellow-500 text-xl mb-2">No products data</div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Products data is not available
                    </p>
                </div>
            </div>
        );
    }

    // Handle empty products array
    if (products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-xl mb-2 text-gray-900 dark:text-white">No products found</div>
                    <p className="text-gray-600 dark:text-gray-400">
                        No products match your search criteria
                    </p>
                </div>
            </div>
        );
    }

    const ProductCard = ({ product }: { product: Product }) => {
        // Safe value getters with fallbacks
        const getCategoryName = () => product?.category?.category_name || 'Uncategorized';
        const getMerchantName = () => product?.features?.merchant || product?.merchant?.name || 'Unknown Merchant';
        const getBrandName = () => product?.features?.brand || product?.brand || 'Unknown Brand';
        const getImageUrl = () => product?.image_url || '';
        const isActive = !product.product_end_datetime || new Date(product.product_end_datetime) > new Date();

        return (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                    <div className="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {getImageUrl() ? (
                            <img
                                src={getImageUrl()}
                                alt={product.name || 'Product image'}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const nextElement = target.nextElementSibling as HTMLElement;
                                    if (nextElement) {
                                        nextElement.classList.remove('hidden');
                                    }
                                }}
                            />
                        ) : null}
                        <div className={`${getImageUrl() ? 'hidden' : ''} flex flex-col items-center justify-center text-gray-400`}>
                            <div className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-2">
                                <div className="w-8 h-8 bg-gray-400 rounded"></div>
                            </div>
                            <span className="text-sm">No Image</span>
                        </div>
                    </div>
                    <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs rounded ${isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                            }`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-1 text-xs rounded bg-blue-500 text-white">
                            {getCategoryName()}
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-semibold mb-2 truncate text-gray-900 dark:text-white">
                        {product.name || 'Unnamed Product'}
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div>{getMerchantName()} • {getBrandName()}</div>
                        {product.sub_category?.sub_category_name && (
                            <div>Subcategory: {product.sub_category.sub_category_name}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Starting from
                        </span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-500">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {typeof product.merchant === "object" &&
                                product.merchant.cashback_type && (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                        {product.merchant.cashback_type}
                                    </span>
                                )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1 transition-colors">
                            <Copy className="h-3 w-3" />
                            Copy Link
                        </button>
                        <div className="flex gap-1">
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                                <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ProductListItem = ({ product }: { product: Product }) => {
        // Safe value getters with fallbacks
        const getCategoryName = () => product?.category?.category_name || 'Uncategorized';
        const getMerchantName = () => product?.features?.merchant || product?.merchant?.name || 'Unknown Merchant';
        const getBrandName = () => product?.features?.brand || product?.brand || 'Unknown Brand';
        const getImageUrl = () => product?.image_url || '';
        const isActive = !product.product_end_datetime || new Date(product.product_end_datetime) > new Date();

        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        {getImageUrl() ? (
                            <img
                                src={getImageUrl()}
                                alt={product.name || 'Product image'}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const nextElement = target.nextElementSibling as HTMLElement;
                                    if (nextElement) {
                                        nextElement.classList.remove('hidden');
                                    }
                                }}
                            />
                        ) : null}
                        <div className={`${getImageUrl() ? 'hidden' : ''} flex flex-col items-center justify-center text-gray-400`}>
                            <div className="w-8 h-8 border border-dashed border-gray-400 rounded flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate text-gray-900 dark:text-white">
                                {product.name || 'Unnamed Product'}
                            </h3>
                            <div className="flex gap-1 flex-shrink-0">
                                <span className="px-2 py-1 text-xs rounded bg-blue-500 text-white">
                                    {getCategoryName()}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded ${isActive
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                    }`}>
                                    {isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {getMerchantName()} • {getBrandName()}
                            {product.sub_category?.sub_category_name && (
                                <span> • {product.sub_category.sub_category_name}</span>
                            )}
                        </div>
                        {product.description && (
                            <p className="text-sm mt-1 truncate text-gray-500 dark:text-gray-500">
                                {product.description}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Starting from
                        </span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-500">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {typeof product.merchant === "object" &&
                                product.merchant.cashback_type && (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                        {product.merchant.cashback_type}
                                    </span>
                                )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1 transition-colors">
                            <Copy className="h-3 w-3" />
                            Copy Link
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                            <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Product Catalog {count > 0 && `(${count})`}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded border transition-colors ${viewMode === 'grid'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        <Grid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded border transition-colors ${viewMode === 'list'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Products Display */}
            <div className={
                viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
            }>
                {products.map((product) => (
                    viewMode === 'grid' ? (
                        <ProductCard key={product.id} product={product} />
                    ) : (
                        <ProductListItem key={product.id} product={product} />
                    )
                ))}
            </div>

            {/* Footer Message */}
            <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-emerald-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Showing {products.length} of {count} products
                </div>
            </div>
        </div>
    );
}

export default ProductsGridList;
