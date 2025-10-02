'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    User,
    Edit,
    Camera,
    Briefcase,
    Loader2,
    Share2,
    ExternalLink,
    Instagram,
    Facebook,
    X,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileData, updateUserProfile } from "@/services/userprofiles/userprofile.service";
import { UserProfileApiItem } from "@/types/profile";

type ActiveTab = "profile" | "business" | "social";

interface ProfileFormData {
    address_line_1: string;
    address_line_2: string;
    city: string;
    province: string;
    country: string;
    facebook: string;
    instagram: string;
    profile_picture_base64?: string;
}

interface ProfileFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: UserProfileApiItem | null;
}

const ProfileForm = ({ isOpen, onClose, initialData }: ProfileFormProps) => {

    // console.log("Initial data: ", initialData);

    const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ProfileFormData>();

    // Initialize form data when component opens or initialData changes
    useEffect(() => {
        if (isOpen && initialData) {
            const facebookLink = initialData.social?.find(s => (s.platform || '').toLowerCase() === 'facebook' || (s.url || '').includes('facebook'))?.url || "";
            const instagramLink = initialData.social?.find(s => (s.platform || '').toLowerCase() === 'instagram' || (s.url || '').includes('instagram'))?.url || "";

            reset({
                address_line_1: initialData.address_line_1 || "",
                address_line_2: initialData.address_line_2 || "",
                city: initialData.city || "",
                province: initialData.province || "",
                country: initialData.country || "",
                facebook: facebookLink,
                instagram: instagramLink,
            });

            if (initialData.profile_picture) {
                setImagePreview(initialData.profile_picture);
            } else {
                setImagePreview(null);
            }

            setSelectedImageFile(null);
            setActiveTab("profile");
        }
    }, [isOpen, initialData, reset]);

    // Convert image to base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Handle image selection
    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedImageFile(file);

        try {
            const base64 = await convertToBase64(file);
            setImagePreview(base64);
            setValue('profile_picture_base64', base64);
        } catch (error) {
            console.error("Error converting image to base64:", error);
        }
    };

    // Handle save profile
    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            // console.log("Data: ", data)
            const { address_line_1, address_line_2, city, province, country, facebook, instagram, profile_picture_base64 } = data;

            const payload = {
                address_line_1: address_line_1,
                address_line_2: address_line_2,
                city: city,
                province: province,
                country: country,
                facebook: facebook,
                instagram: instagram,
                profile_picture: profile_picture_base64
            };

            const response = await updateUserProfile(initialData?.id, payload);
            console.log("Response: ", response)

        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle cancel editing
    const handleCancel = () => {
        setSelectedImageFile(null);

        // Reset image preview to original profile picture
        if (initialData?.profile_picture) {
            setImagePreview(initialData.profile_picture);
        } else {
            setImagePreview(null);
        }

        // Reset form to original values
        if (initialData) {
            const facebookLink = initialData.social?.find(s => (s.platform || '').toLowerCase() === 'facebook' || (s.url || '').includes('facebook'))?.url || "";
            const instagramLink = initialData.social?.find(s => (s.platform || '').toLowerCase() === 'instagram' || (s.url || '').includes('instagram'))?.url || "";

            reset({
                address_line_1: initialData.address_line_1 || "",
                address_line_2: initialData.address_line_2 || "",
                city: initialData.city || "",
                province: initialData.province || "",
                country: initialData.country || "",
                facebook: facebookLink,
                instagram: instagramLink,
            });
        }

        onClose();
    };

    // Don't render if not open
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Profile
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage your personal and business profiles
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="px-6 pt-6">
                    <div className="flex justify-center">
                        <div className="flex gap-1 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setActiveTab("profile")}
                                className={`relative cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "profile"
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                <span>Profile Info</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("business")}
                                className={`relative cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "business"
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <Briefcase className="w-5 h-5" />
                                <span>Business Details</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("social")}
                                className={`relative cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "social"
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <Share2 className="w-5 h-5" />
                                <span>Social Links</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {activeTab === "profile" && (
                            <div className="animate-fadeIn">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Profile Picture */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-4xl font-bold text-white overflow-hidden border-4 border-emerald-500">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Profile Picture"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <>
                                                        {initialData?.user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </>
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 p-2 rounded-full transition-colors cursor-pointer">
                                                <Camera className="w-4 h-4 text-white" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageSelect}
                                                />
                                            </label>
                                        </div>
                                        {selectedImageFile && (
                                            <span className="text-emerald-600 text-sm font-medium">
                                                {selectedImageFile.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Profile Form */}
                                    <div className="flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    First Name
                                                </label>
                                                <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                    {initialData?.user?.first_name || '-'}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Last Name
                                                </label>
                                                <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                    {initialData?.user?.last_name || '-'}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register("city")}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Province/State
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register("province")}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register("country")}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Address Line 1
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register("address_line_1")}
                                                    placeholder="Street address, P.O. box"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Address Line 2
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register("address_line_2")}
                                                    placeholder="Apartment, suite, unit, building, floor, etc."
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "business" && (
                            <div className="animate-fadeIn">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                            <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                {initialData?.user?.email || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                                            <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                {initialData?.user?.username || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                            <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                {`${initialData?.user?.first_name || ''} ${initialData?.user?.last_name || ''}`.trim() || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                                Account Information
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-blue-700 dark:text-blue-300">
                                                        Profile ID:
                                                    </span>
                                                    <span className="font-medium text-blue-900 dark:text-blue-100">
                                                        {initialData?.id || '-'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-blue-700 dark:text-blue-300">
                                                        Email:
                                                    </span>
                                                    <span className="font-medium text-blue-900 dark:text-blue-100">
                                                        {initialData?.user?.email || '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "social" && (
                            <div className="animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-500 rounded-lg">
                                                <Facebook className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    Facebook
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Connect your Facebook page
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="url"
                                            {...register("facebook")}
                                            placeholder="https://facebook.com/yourpage"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-pink-500 rounded-lg">
                                                <Instagram className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    Instagram
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Link your Instagram profile
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="url"
                                            {...register("instagram")}
                                            placeholder="https://instagram.com/yourusername"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
