'use client';

import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Edit,
    Package,
    Tag,
    Calendar,
    DollarSign,
    TrendingUp,
    Store,
    Layers,
    Award,
    Clock,
    CheckCircle2,
    XCircle,
    Percent,
    ShoppingBag,
    Image as ImageIcon,
    Star,
    Info,
    AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { getProductBySlug } from "@/services/store/products/product.service";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";

export default function ProductDetails({ slug }: any) {
    const accessToken = useSelector((state: any) => state.auth.accessToken);

    // Get current product
    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => getProductBySlug(slug, accessToken),
        enabled: !!accessToken && !!slug
    });

    if (isProductLoading) {
        return (
            <div className="w-full flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm w-full max-w-7xl border border-gray-200 dark:border-gray-800 p-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 dark:border-gray-700 border-t-emerald-600"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Loading product details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product?.data) {
        return (
            <div className="w-full flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm w-full max-w-7xl border border-gray-200 dark:border-gray-800 p-12">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Product Not Found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm">
                            The product you're looking for doesn't exist or has been removed.
                        </p>
                        <Button
                            variant="default"
                            onClick={() => window.history.back()}
                            className="cursor-pointer flex items-center gap-2 mx-auto mt-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Go Back</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const p = product.data;

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="w-full mx-auto">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                                    <Package className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Product Details
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        View and manage product information
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = `/dashboard/products/${slug}`}
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => window.history.back()}
                                    className="cursor-pointer flex items-center gap-2 rounded-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-6">
                        {/* Hero Section - Image and Key Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Product Image */}
                            <div>
                                {p.image_url ? (
                                    <img
                                        src={p.image_url}
                                        alt={p.name}
                                        className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
                                    />
                                ) : (
                                    <div className="w-full h-96 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700">
                                        <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-3" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">No image available</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                {/* Title and Slug */}
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {p.name}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Tag className="w-4 h-4" />
                                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{p.slug}</code>
                                    </div>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {p.is_active ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                                            <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800">
                                            <XCircle className="w-3 h-3 mr-1.5" />
                                            Inactive
                                        </Badge>
                                    )}
                                    {p.is_hero_product && (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                                            <Star className="w-3 h-3 mr-1.5" />
                                            Hero Product
                                        </Badge>
                                    )}
                                    {p.is_compared && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                                            <TrendingUp className="w-3 h-3 mr-1.5" />
                                            Compared
                                        </Badge>
                                    )}
                                    {p.card_type && (
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800">
                                            Card Type
                                        </Badge>
                                    )}
                                </div>

                                {/* Price Information */}
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded">
                                            <DollarSign className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
                                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(p.price)}
                                            </p>
                                            {p.discount_percentage && (
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Percent className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                                                    <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">
                                                        {p.discount_percentage}% discount
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                                            <Tag className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Category Price From</p>
                                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(parseFloat(p.category_price_starting_from || "0"))}
                                            </p>
                                            {p.category_earn_text && (
                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                    {p.category_earn_text}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
                                        <ShoppingBag className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Availability Status</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {p.availability_status || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Description */}
                        {p.product_label && (
                            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                        Description
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {p.product_label}
                                </p>
                            </div>
                        )}

                        {/* Product Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="p-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Start Date</h4>
                                </div>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {formatDate(p.product_start_datetime)}
                                </p>
                            </div>

                            <div className="p-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">End Date</h4>
                                </div>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {formatDate(p.product_end_datetime)}
                                </p>
                            </div>
                        </div>

                        {/* Categories and Brand */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {/* Category */}
                            <div className="p-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Layers className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Category</h4>
                                </div>
                                {p.category ? (
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                                            {p.category.category_name}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {p.category.description || "No description"}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No category assigned</p>
                                )}
                            </div>

                            {/* Sub Category */}
                            <div className="p-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Sub Category</h4>
                                </div>
                                {p.sub_category ? (
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                                            {p.sub_category.sub_category_name}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {p.sub_category.description || "No description"}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No sub-category assigned</p>
                                )}
                            </div>

                            {/* Brand */}
                            <div className="p-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Award className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Brand</h4>
                                </div>
                                {p.brand ? (
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                                            {p.brand.name}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {p.brand.description || "No description"}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No brand assigned</p>
                                )}
                            </div>
                        </div>

                        {/* Merchant Information */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Store className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                    Merchant Information
                                </h3>
                            </div>
                            {p.merchant ? (
                                <div className="flex items-center gap-4">
                                    {p.merchant.image && (
                                        <img
                                            src={p.merchant.image}
                                            alt={p.merchant.name}
                                            className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-700"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                                            {p.merchant.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {p.merchant.cashback_ribbon_text || "No cashback information"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No merchant assigned</p>
                            )}
                        </div>

                        {/* Product Gallery */}
                        {p.product_gallery && p.product_gallery.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                            Product Gallery
                                        </h3>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {p.product_gallery.length} {p.product_gallery.length === 1 ? 'Image' : 'Images'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {p.product_gallery.map((image: any, index: number) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.image}
                                                alt={image.alt || `Gallery image ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                            />
                                            {image.is_primary && (
                                                <Badge className="absolute top-2 left-2 text-xs bg-amber-500 hover:bg-amber-600">
                                                    <Star className="w-3 h-3 mr-1" />
                                                    Primary
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}