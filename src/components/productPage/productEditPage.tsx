'use client';

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import SearchableDropdown from "../common/SearchAndFilter";
import { getAllCategories, getAllSubCategories } from "@/services/store/products/categories.service";
import { getAllBrands } from "@/services/store/brands/brands.service";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ProductPhotoManagement from "./productPhotoManagement";
import { getProductBySlug, updateProduct } from "@/services/store/products/product.service";
import { toast } from "sonner";
import { useSelector } from "react-redux";

interface Photo {
    id?: string;
    url?: string;
    alt: string;
    isPrimary: boolean;
    image: string;
}

export default function ProductEditForm({ slug }: any) {

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [selectedMerchant, setSelectedMerchant] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const [heroProduct, setHeroProduct] = useState<boolean>(false);
    const [isCompared, setIsCompared] = useState<boolean>(false);
    const [cardType, setCardType] = useState<boolean>(false);
    const accessToken = useSelector((state: any) => state.auth.accessToken);


    const [productGallery, setProductGallery] = useState<Photo[]>([]);

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors },
        reset
    } = useForm();


    const handlePhotosChange = (photos: Photo[]) => {
        setProductGallery(photos);
    };


    const [mount, setMount] = useState(false);
    useEffect(() => {
        setMount(true);
    }, []);


    // Get current product
    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => getProductBySlug(slug, accessToken),
        enabled: !!accessToken && !!slug
    });

    // Populate form with product data when it's loaded
    useEffect(() => {
        if (product?.data) {
            const p = product.data;

            // Set form values
            setValue('name', p.name || '');
            setValue('slug', p.slug || '');
            setValue('categoryPrice', p.category_price_starting_from || '');
            setValue('productStartDate', p.product_start_datetime ? new Date(p.product_start_datetime).toISOString().split('T')[0] : '');
            setValue('productEndDate', p.product_end_datetime ? new Date(p.product_end_datetime).toISOString().split('T')[0] : '');

            // Set state values
            setSelectedCategory(p.category?.id?.toString() || '');
            setSelectedSubCategory(p.sub_category?.id?.toString() || '');
            setSelectedMerchant(p.merchant?.id?.toString() || '');
            setSelectedBrand(p.brand?.id?.toString() || '');
            setSelectedStatus(p.is_active ? 'active' : 'inactive');

            setIsCompared(p.is_compared || false);
            setCardType(p.card_type || false);
            setHeroProduct(p.is_hero_product || false);

            // Set gallery if exists
            if (p.product_gallery && p.product_gallery.length > 0) {
                const gallery = p.product_gallery.map((item: any) => ({
                    id: item.id,
                    url: item.image,
                    alt: item.alt || '',
                    isPrimary: item.is_primary || false,
                    image: item.image || ''
                }));
                setProductGallery(gallery);
            }
        }
    }, [product, setValue]);

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

    const handleCategorySelect = (selected: { value: string; label: string } | { value: string; label: string }[]) => {
        const option = Array.isArray(selected) ? selected[0] : selected;
        setSelectedCategory(option.value);
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
        const option = Array.isArray(selected) ? selected[0] : selected;
        setSelectedSubCategory(option.value);
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
        const option = Array.isArray(selected) ? selected[0] : selected;
        setSelectedBrand(option.value);
    };

    const handleOnSubmit = async (data: any) => {
        try {
            // Format the data to match the API expectations
            const requestData = {
                is_compared: Boolean(isCompared),
                category: Number(selectedCategory) || null,
                sub_category: Number(selectedSubCategory) || null,
                // merchant: Number(selectedMerchant) || null,
                brand: Number(selectedBrand) || null,
                card_type: Boolean(cardType),
                category_price_starting_from: String(data.categoryPrice || "0.00"),
                // image_urls: [],
                // product_gallery: productGallery
                //     .filter((photo: Photo) => photo && photo.image && photo.alt)
                //     .map((photo: Photo) => ({
                //         alt: String(photo.alt || ''),
                //         is_primary: Boolean(photo.isPrimary),
                //         image: String(photo.image || '')
                //     })),
                product_start_datetime: data.productStartDate ?
                    new Date(data.productStartDate).toISOString() :
                    new Date().toISOString(),
                product_end_datetime: data.productEndDate ?
                    new Date(data.productEndDate).toISOString() :
                    new Date().toISOString(),
                is_hero_product: Boolean(heroProduct)
            };

            const response = await updateProduct(requestData, slug, accessToken);

            if (response.ok) {
                toast.success("Product updated successfully");
                window.location.href = '/dashboard/products';
            } else {
                const errorData = await response.json();
                console.log('Error data: ', errorData);
                throw new Error(`Update failed: ${JSON.stringify(errorData)}`);
            }
        } catch (error: any) {
            console.error('Error updating product:', error);
            toast.error(`Error: ${error.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full border border-gray-200 dark:border-gray-700">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Edit Product
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
                        <div className="flex items-center space-x-4 mt-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isCompared}
                                    onChange={(e) => setIsCompared(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
                                />
                                <span className="text-sm text-gray-900 dark:text-white">
                                    Is Compared
                                </span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={cardType}
                                    onChange={(e) => setCardType(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
                                />
                                <span className="text-sm text-gray-900 dark:text-white">
                                    Card Type
                                </span>
                            </label>
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
                                selected={selectedCategory}
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
                                selected={selectedSubCategory}
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
                                selected={selectedBrand}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Category Price From (₹)
                            </label>
                            <input
                                type="text"
                                {...register('categoryPrice')}
                                placeholder="Auto-filled from price"
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
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
                                {...register('productEndDate', { required: "Product end date is required" })}
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
                        <div className="flex items-center space-x-4">
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

                    {/* Product Photos Management */}
                    <ProductPhotoManagement
                        onPhotosChange={handlePhotosChange}
                        initialPhotos={productGallery}
                    />


                    {/* Modal Footer */}
                    <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="text-red-500">*</span> Required fields
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" variant="ghost" className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Update Product"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
