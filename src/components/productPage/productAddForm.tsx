'use client';

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import SearchableDropdown from "../common/SearchAndFilter";
import { getAllCategories, getAllSubCategories } from "@/services/store/products/categories.service";
import { getAllBrands } from "@/services/store/brands/brands.service";
import { getAllMerchants } from "@/services/store/merchants/merchants.service";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ProductPhotoManagement from "./productPhotoManagement";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (productData: any) => void;
    product?: any;
    mode?: "create" | "edit";
    apiOptions?: {
        categories: any[];
        subCategories: any[];
        merchants: any[];
        brands: any[];
    };
    loadingOptions?: {
        categories: boolean;
        subCategories: boolean;
        merchants: boolean;
        brands: boolean;
    };
}

interface Photo {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
}

export default function ProductAddForm({
    onClose,
    onSubmit,
    mode = "create",
    loadingOptions,
}: ProductModalProps) {

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [selectedMerchant, setSelectedMerchant] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [commissionType, setCommisionType] = useState<string>('');
    const [cashbackType, setCashbackType] = useState<string>('');
    const [hasCoupon, setHasCoupon] = useState<boolean>(false);
    const [heroProduct, setHeroProduct] = useState<boolean>(false);

    const [productPhotos, setProductPhotos] = useState<Photo[]>([]);

    const {
        register,
        watch,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset
    } = useForm();


    const handlePhotosChange = (photos: Photo[]) => {
        setProductPhotos(photos);
    };

    // Handle mounting state
    const [mount, setMount] = useState(false);
    useEffect(() => {
        setMount(true);
    }, []);

    // Get categories
    const { data: categories, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getAllCategories(),
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

    const handleStatusSelect = (selected: { value: string; label: string }) => {
        setSelectedStatus(selected.value);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .trim();
    };

    const handleOnSubmit = (data) => {
        console.log('Data to submit: ', data)
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full border border-gray-200 dark:border-gray-700">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {mode === "edit" ? "Edit Product" : "Create New Product"}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="p-6 cursor-pointer hover:bg-accent rounded-lg flex items-center gap-1"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit(handleOnSubmit)} className="p-8 space-y-8">
                    {/* Basic Product Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                {...register('name', { required: 'Product name is required' })}
                                placeholder="Enter product name"
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                required
                            />
                            {errors.name && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.name.message}`}</span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Product Slug *
                            </label>
                            <input
                                type="text"
                                {...register('slug', { required: 'Product slug is required' })}
                                placeholder="Auto-generated from name"
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                required
                            />
                            {errors.slug && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.slug.message}`}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Category *
                            </label>
                            <SearchableDropdown
                                options={categoryOptions}
                                onSelect={handleCategorySelect}
                                placeholder="Select Category"
                                disabled={isCategoriesLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Sub Category *
                            </label>
                            <SearchableDropdown
                                options={subCategoryOptions}
                                onSelect={handleSubCategorySelect}
                                placeholder="Select Sub Category"
                                disabled={isSubCategoriesLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            Product Description *
                        </label>
                        <textarea
                            {...register('productDescription', { required: "Product description is required" })}
                            rows={4}
                            placeholder="Describe your product in detail..."
                            className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            required
                        />
                        {errors.productDescription && (
                            <span className="text-xs font-semibold text-red-600">{`${errors.productDescription.message}`}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Merchant *
                            </label>
                            <SearchableDropdown
                                options={merchantsOptions}
                                onSelect={handleMerchantSelect}
                                placeholder="Select Merchant"
                                disabled={loadingOptions?.merchants}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Brand *
                            </label>
                            <SearchableDropdown
                                options={barndsOptions}
                                onSelect={handleBrandSelect}
                                placeholder="Select Brand"
                                disabled={loadingOptions?.brands}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Product Price (₹) *
                            </label>
                            <input
                                type="number"
                                {...register('price', { required: "Product price is required" })}
                                step="0.01"
                                placeholder="0.00"
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                required
                            />
                            {errors.price && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.price.message}`}</span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Category Price From (₹)
                            </label>
                            <input
                                type="text"
                                {...register('categoryPrice', { required: "Category price is required" })}
                                placeholder="Auto-filled from price"
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            {errors.categoryPrice && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.categoryPrice.message}`}</span>
                            )}
                        </div>
                    </div>

                    {/* Commission Structure */}
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Commission Structure
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Commission Type *
                                </label>
                                <select
                                    value={commissionType}
                                    onChange={(e) => setCommisionType(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    {commissionType === "percentage"
                                        ? "Commission Rate (%)"
                                        : "Commission Amount (₹)"}
                                </label>
                                <input
                                    type="number"
                                    {...register('commissionType', { required: "Commission type price is required" })}
                                    step='0.01'
                                    placeholder={
                                        commissionType === "percentage"
                                            ? "10.0"
                                            : "100.00"
                                    }
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                                {errors.commissionType && (
                                    <span className="text-xs font-semibold text-red-600">{`${errors.commissionType.message}`}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product URL and Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Product URL
                            </label>
                            <input
                                type="url"
                                {...register('productUrl', { required: "Product URL is required" })}
                                placeholder="https://example.com/product"
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            {errors.productUrl && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.productUrl.message}`}</span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Image URL
                            </label>
                            <input
                                type="url"
                                {...register('imageUrl', { required: "Image URL is required" })}
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            {errors.imageUrl && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.imageUrl.message}`}</span>
                            )}
                        </div>
                    </div>

                    {/* Product Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Product Start Date *
                            </label>
                            <input
                                type="date"
                                {...register('productStartDate', { required: "Product start date is required" })}
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                required
                            />
                            {errors.productStartDate && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.productStartDate.message}`}</span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Product End Date *
                            </label>
                            <input
                                type="date"
                                {...register('productEndDate', { required: "Product start date is required" })}
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                required
                            />
                            {errors.productEndDate && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.productEndDate.message}`}</span>
                            )}
                        </div>
                    </div>

                    {/* Merchant Settings */}
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Merchant Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Cashback Type
                                </label>
                                <select
                                    value={cashbackType}
                                    onChange={(e) => setCashbackType(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="Cashback">Cashback</option>
                                    <option value="Reward Points">Reward Points</option>
                                    <option value="Discount">Discount</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={hasCoupon}
                                            onChange={(e) => setHasCoupon(e.target.checked)}
                                            className="w-4 h-4 text-emerald-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-gray-900 dark:text-white">
                                            Has Coupons
                                        </span>
                                    </label>
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={heroProduct}
                                            onChange={(e) => setHeroProduct(e.target.checked)}
                                            className="w-4 h-4 text-emerald-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-gray-900 dark:text-white">
                                            Hero Product
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Photos Management */}
                    <ProductPhotoManagement onPhotosChange={handlePhotosChange} />

                    {/* Status */}
                    <div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Category *
                            </label>
                            <SearchableDropdown
                                options={statusOptions}
                                onSelect={handleStatusSelect}
                                placeholder="Select Status"
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="text-red-500">*</span> Required fields
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                {mode === "edit" ? "Update Product" : "Create Product"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
