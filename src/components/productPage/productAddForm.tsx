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
import { CreateProduct } from "@/services/store/products/product.service";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

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
    id?: string;
    url?: string;
    alt: string;
    isPrimary: boolean;
    image: string;
}

export default function ProductAddForm({
    onClose,
    mode = "create",
    loadingOptions,
}: ProductModalProps) {

    const router = useRouter();
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
    const [isCompared, setIsCompared] = useState<boolean>(false);
    const [cardType, setCardType] = useState<boolean>(false);
    const accessToken = useSelector((state: any) => state.auth.accessToken);

    const [productImage, setProductImage] = useState<string>("");

    const [productGallery, setProductGallery] = useState<Photo[]>([]);
    const [imageUrls, setImageUrls] = useState<Photo[]>([]);

    const [isSlugCustomized, setIsSlugCustomized] = useState<boolean>(false);

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors },
        reset
    } = useForm();

    const productName = watch('name');
    const productPrice = watch('price');
    const productSlug = watch('slug');

    const handlePhotosChange = (photos: Photo[]) => {
        setProductGallery(photos);
        setImageUrls(photos);
    };

    // Convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Handle main product image selection
    const handleMainImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        if (file.type.startsWith('image/')) {
            try {
                const base64String = await fileToBase64(file);
                setProductImage(base64String);
            } catch (error) {
                console.error('Error converting main image to base64:', error);
                toast.error('Error processing image');
            }
        }
    };

    const [mount, setMount] = useState(false);
    useEffect(() => {
        setMount(true);
    }, []);

    useEffect(() => {
        if (productName && !isSlugCustomized) {
            const generatedSlug = generateSlug(productName);
            setValue('slug', generatedSlug);
        }
    }, [productName, setValue, isSlugCustomized]);

    useEffect(() => {
        if (productPrice) {
            setValue('categoryPrice', productPrice);
        }
    }, [productPrice, setValue]);

    useEffect(() => {
        if (productName && productSlug) {
            const generatedSlug = generateSlug(productName);
            if (productSlug !== generatedSlug) {
                setIsSlugCustomized(true);
            }
        }
    }, [productSlug, productName]);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim();
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue('slug', value);

        if (productName) {
            const generatedSlug = generateSlug(productName);
            if (value !== generatedSlug) {
                setIsSlugCustomized(true);
            } else {
                setIsSlugCustomized(false);
            }
        }
    };

    const resetSlugToAutoGenerated = () => {
        if (productName) {
            const generatedSlug = generateSlug(productName);
            setValue('slug', generatedSlug);
            setIsSlugCustomized(false);
        }
    };

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
        const option = Array.isArray(selected) ? selected[0] : selected;
        setSelectedStatus(option.value);
    };

    const handleOnSubmit = async (data: any) => {
        try {
            const requestData = {
                slug: String(data.slug || ''),
                is_compared: Boolean(isCompared),
                name: String(data.name || ''),
                category: String(selectedCategory || ''),
                sub_category: String(selectedSubCategory || ''),
                brand: selectedBrand ? String(selectedBrand) : null,
                product_url: String(data.productUrl || ''),
                cashback_url: String(data.productUrl || ''),
                card_type: Boolean(cardType),
                product_label: String(data.productDescription || ''),
                category_price_starting_from: Number(data.categoryPrice) || 0,
                category_earn_text: commissionType === 'percentage'
                    ? `${data.commissionValue}%`
                    : commissionType === 'fixed'
                        ? `₹${data.commissionValue}`
                        : String(data.commissionValue || ''),
                category_detail: String(data.productDescription || ''),
                popularity: 0,
                product_button_text: 'Buy Now',
                product_start_datetime: `${data.productStartDate}T00:00:00.000Z`,
                product_end_datetime: `${data.productEndDate}T23:59:59.000Z`,
                price: Number(data.price) || 0,
                is_hero_product: Boolean(heroProduct),
                status: String(selectedStatus || ''),
                cashback_type: String(cashbackType || ''),
                has_coupon: Boolean(hasCoupon),
                image_url: String(productImage || ''),
                product_galary: productGallery
                    .filter((photo: Photo) => photo && photo.image && photo.alt)
                    .map((photo: Photo) => ({
                        alt: String(photo.alt || ''),
                        is_primary: Boolean(photo.isPrimary),
                        image: String(photo.image || '')
                    })),
                image_urls: []
            };

            const response = await CreateProduct(requestData, accessToken);
            if (!response.ok) {
                toast.error("Failed to create product")
            } else {
                toast.success('Product created successfully');
                router.push('/dashboard/products/')
            }
        } catch (error: any) {
            console.error('Error creating product:', error);
            toast.error(`Error: ${error.message || 'Unknown error'}`);
        }
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

                        <div className="relative">
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                Product Slug *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register('slug', { required: 'Product slug is required' })}
                                    onChange={handleSlugChange}
                                    placeholder="Auto-generated from name"
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 pr-20 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                    required
                                />
                                {isSlugCustomized && (
                                    <button
                                        type="button"
                                        onClick={resetSlugToAutoGenerated}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white px-3 py-1 rounded-md text-xs hover:bg-emerald-700 transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            {isSlugCustomized && (
                                <p className="text-xs text-blue-600 mt-1">
                                    Slug has been customized. Click "Reset" to revert to auto-generated.
                                </p>
                            )}
                            {errors.slug && (
                                <span className="text-xs font-semibold text-red-600">{`${errors.slug.message}`}</span>
                            )}
                        </div>

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
                                Product Price (₹) *
                            </label>
                            <input
                                type="number"
                                {...register('price', {
                                    required: "Product price is required",
                                    min: { value: 0, message: "Price must be positive" }
                                })}
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
                                {...register('categoryPrice')}
                                placeholder="Auto-filled from price"
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                readOnly
                            />
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
                                    <option value="">Select Type</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    {commissionType === "percentage"
                                        ? "Commission Rate (%)"
                                        : commissionType === "fixed"
                                            ? "Commission Amount (₹)"
                                            : "Commission Value"}
                                </label>
                                <input
                                    type="number"
                                    {...register('commissionValue', {
                                        required: "Commission value is required",
                                        min: { value: 0, message: "Commission must be positive" }
                                    })}
                                    step='0.01'
                                    placeholder={
                                        commissionType === "percentage"
                                            ? "10.0"
                                            : commissionType === "fixed"
                                                ? "100.00"
                                                : "Enter commission value"
                                    }
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                />
                                {errors.commissionValue && (
                                    <span className="text-xs font-semibold text-red-600">{`${errors.commissionValue.message}`}</span>
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
                                Main Product Image *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageSelect}
                                className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                required
                            />
                            {productImage && (
                                <div className="mt-2">
                                    <p className="text-xs text-green-600">Selected Image</p>
                                    <img
                                        src={productImage}
                                        alt="Main product preview"
                                        className="w-16 h-16 object-cover rounded-md border border-gray-300 mt-2"
                                    />
                                </div>
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
                                    <option value="">Select Cashback Type</option>
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
                                Status *
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
                            <Button type="button" variant="ghost" className="cursor-pointer" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : mode === "edit" ? "Update Product" : "Create Product"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
