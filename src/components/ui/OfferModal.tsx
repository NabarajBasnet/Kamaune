'use client';

import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Gift, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { MerchantSelect } from "@/components/ui/MerchantSelect";
import { MerchantData } from "@/services/merchant/merchant.service";
import { toast } from "sonner";
import { CreateOfferData, OfferData } from "@/types/offers";
import { createOffer } from "@/services/offer/offer.service";
import { generateOfferSlug } from "@/utils/slugify";
import SearchableDropdown from "../common/SearchAndFilter";
interface OfferModalProps {
    showOfferModal: boolean;
    setShowOfferModal: () => void;
    onSubmit: (offerData: FormData) => void;
    offer?: OfferData | null;
    mode?: "create" | "edit";
    isLoading?: boolean;
}
import { getAllMerchants } from "@/services/store/merchants/merchants.service";

export function OfferModal({
    showOfferModal,
    setShowOfferModal,
    offer,
    mode = "create",
    isLoading = false,
}: OfferModalProps) {
    const [step, setStep] = useState(1);
    const [slugEditedManually, setSlugEditedManually] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState<number>(0);

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CreateOfferData>({
        defaultValues: {
            name: "",
            slug: "",
            merchant: 0,
            network_id: null,
            cashback_type: "",
            offer_type: null,
            payment_date: null,
            accept_ticket: false,
            tracking_speed: "72 hours",
            expected_confirmation_days: 15,
            cashback_button_text: "",
            unique_identifier: "",
            short_description: "",
            full_description: "",
            cashback_ribbon_text: null,
            calendar_cashback_rules_type: "30 days",
            report_store_categoryname: null,
            app_tracking_enabled_android: false,
            app_tracking_enabled_ios: false,
            is_custom_override_case: false,
            intermediate_page_text: "",
            seo_h1_tag: null,
            rating_value: null,
            rating_count: null,
            seo_description: "",
            app_orders: null,
            image: null,
            banner_image: null,
        }
    });

    // Watch form values for preview and conditional rendering
    const formValues = watch();

    const { data: merchants, isLoading: isMerchantsLoading } = useQuery({
        queryKey: ['merchants'],
        queryFn: () => getAllMerchants()
    });

    const merchantsOptions = merchants?.data?.results?.map((merchant: any) => ({
        value: merchant.id.toString(),
        label: merchant.name,
    })) ?? [];

    const handleMerchantSelect = (selected: { value: string; label: string } | { value: string; label: string }[]) => {
        const option = Array.isArray(selected) ? selected[0] : selected;
        setSelectedMerchant(option.value);
    };

    // Auto-generate slug from name and merchant unless manually edited
    useEffect(() => {
        const offerName = formValues.name?.trim() || "";
        if (!slugEditedManually) {
            const autoSlug = generateOfferSlug(offerName);
            setValue("slug", autoSlug, { shouldValidate: true, shouldDirty: true });
        }
        if (!formValues.slug) {
            setSlugEditedManually(false);
        }
    }, [formValues.name, formValues.merchant, slugEditedManually, setValue, formValues.slug]);


    // Handle image changes
    const handleImageChange = (field: "image" | "banner_image", value: string | null) => {
        setValue(field as keyof CreateOfferData, value as any);
    };

    // Prepare and submit form data
    const onSubmitForm = async (data: CreateOfferData) => {
        const formData = new FormData();

        // Append all fields to FormData
        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("merchant",  parseInt(selectedMerchant) || 0);
        if (data.network_id) formData.append("network_id", data.network_id.toString());
        formData.append("cashback_type", data.cashback_type);
        if (data.offer_type) formData.append("offer_type", data.offer_type);
        if (data.payment_date) formData.append("payment_date", data.payment_date);
        formData.append("accept_ticket", data.accept_ticket.toString());
        formData.append("tracking_speed", data.tracking_speed);
        formData.append("expected_confirmation_days", data.expected_confirmation_days.toString());
        formData.append("cashback_button_text", data.cashback_button_text);
        formData.append("unique_identifier", data.unique_identifier);
        formData.append("short_description", data.short_description);
        formData.append("full_description", data.full_description);
        if (data.cashback_ribbon_text) formData.append("cashback_ribbon_text", data.cashback_ribbon_text);
        formData.append("calendar_cashback_rules_type", data.calendar_cashback_rules_type);
        if (data.report_store_categoryname) formData.append("report_store_categoryname", data.report_store_categoryname);
        formData.append("app_tracking_enabled_android", data.app_tracking_enabled_android.toString());
        formData.append("app_tracking_enabled_ios", data.app_tracking_enabled_ios.toString());
        formData.append("is_custom_override_case", data.is_custom_override_case.toString());
        formData.append("intermediate_page_text", data.intermediate_page_text);
        if (data.seo_h1_tag) formData.append("seo_h1_tag", data.seo_h1_tag);
        if (data.rating_value) formData.append("rating_value", data.rating_value.toString());
        if (data.rating_count) formData.append("rating_count", data.rating_count.toString());
        formData.append("seo_description", data.seo_description);
        if (data.app_orders) formData.append("app_orders", data.app_orders);

        if (data.image) formData.append("image", data.image);
        if (data.banner_image) formData.append("banner_image", data.banner_image);

        const response = await createOffer(formData);
    };

    if (!showOfferModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {mode === "edit" ? "Edit Offer" : "Create New Offer"}
                    </h2>
                    <Button
                        onClick={() => setShowOfferModal(false)}
                        variant="ghost"
                        size="sm"
                        className="p-2 cursor-pointer hover:bg-accent rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((stepNumber) => (
                            <React.Fragment key={stepNumber}>
                                <div className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= stepNumber
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                            }`}
                                    >
                                        {stepNumber}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {stepNumber === 1 && "Basic Info"}
                                        {stepNumber === 2 && "Details & Settings"}
                                        {stepNumber === 3 && "SEO & Tracking"}
                                    </span>
                                </div>
                                {stepNumber < 3 && (
                                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                    Offer Information
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Set up the basic details for your offer
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Offer Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("name", { required: "Offer name is required" })}
                                        placeholder="Enter offer name"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("slug", {
                                            required: "Slug is required",
                                            onChange: () => setSlugEditedManually(true),
                                        })}
                                        placeholder="offer-slug"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                    {errors.slug && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.slug.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <SearchableDropdown
                                    options={merchantsOptions}
                                    onSelect={handleMerchantSelect}
                                    placeholder="Select Merchant"
                                    disabled={isMerchantsLoading}
                                />
                                {/* <MerchantSelect
                                    value={formValues.merchant}
                                    onChange={handleMerchantChange}
                                    placeholder="Select a merchant..."
                                    required={true}
                                    allowCreate={true}
                                    publisherId={1}
                                    className="w-full"
                                    disabled={isLoading}
                                /> */}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Short Description *
                                </label>
                                <input
                                    type="text"
                                    {...register("short_description", { required: "Short description is required" })}
                                    placeholder="Brief description of the offer"
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                />
                                {errors.short_description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.short_description.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Full Description
                                </label>
                                <textarea
                                    {...register("full_description")}
                                    rows={3}
                                    placeholder="Detailed description of the offer..."
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Cashback Type *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("cashback_type", { required: "Cashback type is required" })}
                                        placeholder="e.g., flat 2.3% profit"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                    {errors.cashback_type && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.cashback_type.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Cashback Button Text *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("cashback_button_text", { required: "Cashback button text is required" })}
                                        placeholder="e.g., 3% profit"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                    {errors.cashback_button_text && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.cashback_button_text.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Network ID
                                    </label>
                                    <input
                                        type="number"
                                        {...register("network_id", { valueAsNumber: true })}
                                        placeholder="Network ID (optional)"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Unique Identifier *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("unique_identifier", { required: "Unique identifier is required" })}
                                        placeholder="e.g., mrg123"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                    {errors.unique_identifier && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.unique_identifier.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details & Settings */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                    Offer Details & Settings
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Configure offer details and payment settings
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Merchant ID *
                                    </label>
                                    <input
                                        type="number"
                                        value={formValues.merchant?.id || 1}
                                        disabled
                                        placeholder="Merchant ID"
                                        className="w-full bg-gray-100 dark:bg-gray-600 rounded-lg px-4 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600"
                                        title="Merchant ID is automatically assigned"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Offer Type
                                    </label>
                                    <input
                                        type="text"
                                        {...register("offer_type")}
                                        placeholder="e.g., seasonal, flash_sale"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Tracking Speed *
                                    </label>
                                    <select
                                        {...register("tracking_speed", { required: "Tracking speed is required" })}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    >
                                        <option value="24 hours">24 hours</option>
                                        <option value="48 hours">48 hours</option>
                                        <option value="72 hours">72 hours</option>
                                        <option value="1 week">1 week</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Expected Confirmation Days *
                                    </label>
                                    <input
                                        type="number"
                                        {...register("expected_confirmation_days", {
                                            required: "Expected confirmation days is required",
                                            valueAsNumber: true
                                        })}
                                        placeholder="15"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                    {errors.expected_confirmation_days && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.expected_confirmation_days.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Payment Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register("payment_date")}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Cashback Rules Type *
                                    </label>
                                    <select
                                        {...register("calendar_cashback_rules_type", { required: "Cashback rules type is required" })}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    >
                                        <option value="30 days">30 days</option>
                                        <option value="45 days">45 days</option>
                                        <option value="60 days">60 days</option>
                                        <option value="90 days">90 days</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Store Category
                                    </label>
                                    <input
                                        type="text"
                                        {...register("report_store_categoryname")}
                                        placeholder="e.g., Fashion, Electronics"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Cashback Ribbon Text
                                    </label>
                                    <input
                                        type="text"
                                        {...register("cashback_ribbon_text")}
                                        placeholder="e.g., 3% Cashback"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="accept_ticket"
                                        {...register("accept_ticket")}
                                        className="w-4 h-4 text-orange-500 rounded"
                                    />
                                    <label
                                        htmlFor="accept_ticket"
                                        className="text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        Accept Ticket
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="custom_override"
                                        {...register("is_custom_override_case")}
                                        className="w-4 h-4 text-orange-500 rounded"
                                    />
                                    <label
                                        htmlFor="custom_override"
                                        className="text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        Custom Override Case
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="android_tracking"
                                        {...register("app_tracking_enabled_android")}
                                        className="w-4 h-4 text-orange-500 rounded"
                                    />
                                    <label
                                        htmlFor="android_tracking"
                                        className="text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        Android App Tracking
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="ios_tracking"
                                        {...register("app_tracking_enabled_ios")}
                                        className="w-4 h-4 text-orange-500 rounded"
                                    />
                                    <label
                                        htmlFor="ios_tracking"
                                        className="text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        iOS App Tracking
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    Intermediate Page Text
                                </label>
                                <textarea
                                    {...register("intermediate_page_text")}
                                    rows={2}
                                    placeholder="Text shown on intermediate page..."
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: SEO & Tracking */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                    SEO & Tracking
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Configure SEO settings and tracking information
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        SEO H1 Tag
                                    </label>
                                    <input
                                        type="text"
                                        {...register("seo_h1_tag")}
                                        placeholder="SEO friendly H1 tag"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        App Orders
                                    </label>
                                    <input
                                        type="text"
                                        {...register("app_orders")}
                                        placeholder="Number of app orders"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                    SEO Description
                                </label>
                                <textarea
                                    {...register("seo_description")}
                                    rows={3}
                                    placeholder="SEO meta description..."
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Rating Value
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        {...register("rating_value", { valueAsNumber: true })}
                                        placeholder="4.5"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                        Rating Count
                                    </label>
                                    <input
                                        type="number"
                                        {...register("rating_count", { valueAsNumber: true })}
                                        placeholder="120"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-6">
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                        Images
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                        Add images to make your offer more attractive to users
                                    </p>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <ImageUpload
                                            label="Offer Image"
                                            placeholder="Upload offer image or enter URL"
                                            value={formValues.image}
                                            onChange={(value) => handleImageChange("image", value)}
                                            maxSize={5}
                                            showPreview={true}
                                            allowUrl={true}
                                            allowUpload={true}
                                            disabled={isLoading}
                                        />

                                        <ImageUpload
                                            label="Banner Image"
                                            placeholder="Upload banner image or enter URL"
                                            value={formValues.banner_image}
                                            onChange={(value) => handleImageChange("banner_image", value)}
                                            maxSize={5}
                                            showPreview={true}
                                            allowUrl={true}
                                            allowUpload={true}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Offer Preview */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                <h4 className="font-medium mb-4 text-gray-900 dark:text-white">
                                    Offer Preview
                                </h4>
                                <Card className="max-w-md">
                                    <div className="p-6">
                                        {/* Banner Image */}
                                        {formValues.banner_image && (
                                            <div className="mb-4 -m-6 mt-0">
                                                <img
                                                    src={formValues.banner_image}
                                                    alt="Banner"
                                                    className="w-full h-24 object-cover rounded-t-xl"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                                <div className="p-6 pb-0">
                                                    <div className="w-full h-px bg-gray-200 dark:bg-gray-600"></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mb-4">
                                            {formValues.image ? (
                                                <img
                                                    src={formValues.image}
                                                    alt="Offer"
                                                    className="w-12 h-12 rounded-lg object-cover border-2 border-orange-500"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                                    <Gift className="w-6 h-6 text-white" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {formValues.name || "Your Offer Name"}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formValues.merchant?.name || "Merchant Name"}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {formValues.short_description ||
                                                "This is how your offer will appear to users"}
                                        </p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-orange-600 dark:text-orange-400 font-medium">
                                                {formValues.cashback_button_text || "Cashback"}
                                            </span>
                                            {formValues.rating_value && formValues.rating_value > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {formValues.rating_value} (
                                                        {formValues.rating_count || 0})
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Modal Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                        <div className="flex gap-3">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowOfferModal(false)}
                                type="button" variant="ghost">
                                Cancel
                            </Button>

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className="bg-orange-600 cursor-pointer text-white hover:bg-orange-700"
                                    disabled={isLoading}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="bg-orange-600 cursor-pointer text-white hover:bg-orange-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {mode === "edit" ? "Updating..." : "Creating..."}
                                        </>
                                    ) : mode === "edit" ? (
                                        "Update Offer"
                                    ) : (
                                        "Create Offer"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}