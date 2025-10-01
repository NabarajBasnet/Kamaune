'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "@/services/userprofiles/userprofile.service";
import { UserProfileApiItem } from "@/types/profile";
import {
    User,
    Briefcase,
    Share2,
    Loader2,
    Edit,
    MapPin,
    Mail,
    Globe,
    ExternalLink,
    Facebook,
    Instagram
} from "lucide-react";
import ProfileForm from "./ProfileForm";

type ActiveTab = "profile" | "business" | "social";

// Business Type mapping
const businessTypes: Record<number, string> = {
    1: "E-commerce",
    2: "Blog/Content",
    3: "Travel & Tourism",
    4: "Fashion & Lifestyle",
    5: "Technology",
    6: "Health & Wellness",
};

export function Profile() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState<UserProfileApiItem | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data, isLoading: isProfileLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfileData()
    });

    // Simulate loading state
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Initialize profile data from API
    useEffect(() => {
        const apiItem: UserProfileApiItem | undefined = data?.data?.results?.[0];
        if (apiItem) {
            setProfileData(apiItem);
        }
    }, [data]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    const getBusinessTypeName = (typeId: number) => {
        return businessTypes[typeId] || "Other";
    };

    // Get social links from profile data
    const getSocialLink = (platform: string) => {
        return profileData?.social?.find(s =>
            (s.platform || '').toLowerCase() === platform.toLowerCase() ||
            (s.url || '').includes(platform.toLowerCase())
        )?.url || "";
    };

    // Show loading state
    if (isLoading || isProfileLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-600" />
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Loading profile...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full min-h-screen dark:bg-slate-950">
                <div className="w-full">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                        <div className="flex-1">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                Profile Management
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Manage your personal and business profiles in one place
                            </p>
                        </div>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Edit className="w-5 h-5" />
                            Edit Profile
                        </button>
                    </div>

                    {/* Simplified Tab Navigation */}
                    <div className="flex justify-center sm:justify-start mb-8">
                        <div className="flex gap-1 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <button
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

                    {/* Display-only content */}
                    <div className="w-full">
                        <div className="transition-all duration-300 ease-in-out">
                            {activeTab === "profile" && (
                                <div className="animate-fadeIn">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                            Profile Information
                                        </h2>

                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Profile Picture */}
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="relative">
                                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-4xl font-bold text-white overflow-hidden border-4 border-emerald-500">
                                                        {profileData?.profile_picture ? (
                                                            <img
                                                                src={profileData.profile_picture}
                                                                alt="Profile Picture"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = "none";
                                                                }}
                                                            />
                                                        ) : (
                                                            <>
                                                                {profileData?.user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {`${profileData?.user?.first_name || ''} ${profileData?.user?.last_name || ''}`.trim() || 'No Name'}
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        {profileData?.user?.email || 'No email'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Profile Details */}
                                            <div className="flex-1">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            First Name
                                                        </label>
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData?.user?.first_name || 'Not provided'}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Last Name
                                                        </label>
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData?.user?.last_name || 'Not provided'}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            City
                                                        </label>
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData?.city || 'Not provided'}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Province/State
                                                        </label>
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData?.province || 'Not provided'}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Country
                                                        </label>
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData?.country || 'Not provided'}
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Address Line 1
                                                        </label>
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData?.address_line_1 || 'Not provided'}
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Address Line 2
                                                        </label>
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData?.address_line_2 || 'Not provided'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Location Summary */}
                                                {(profileData?.city || profileData?.province || profileData?.country) && (
                                                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                            <span className="font-medium text-blue-900 dark:text-blue-100">Location</span>
                                                        </div>
                                                        <p className="text-blue-700 dark:text-blue-300 mt-1">
                                                            {[profileData?.city, profileData?.province, profileData?.country]
                                                                .filter(Boolean)
                                                                .join(', ') || 'No location information'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "business" && (
                                <div className="animate-fadeIn">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                            Business Details
                                        </h2>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4" />
                                                            Email
                                                        </div>
                                                    </label>
                                                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                        {profileData?.user?.email || 'Not provided'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Username
                                                    </label>
                                                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                        {profileData?.user?.username || 'Not provided'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Full Name
                                                    </label>
                                                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                        {`${profileData?.user?.first_name || ''} ${profileData?.user?.last_name || ''}`.trim() || 'Not provided'}
                                                    </div>
                                                </div>

                                                {profileData?.business_type && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Business Type
                                                        </label>
                                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {getBusinessTypeName(profileData.business_type)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-6">
                                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                                                        <Briefcase className="w-5 h-5" />
                                                        Account Information
                                                    </h4>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-blue-700 dark:text-blue-300">
                                                                Profile ID:
                                                            </span>
                                                            <span className="font-medium text-blue-900 dark:text-blue-100">
                                                                {profileData?.id || 'Not available'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-blue-700 dark:text-blue-300">
                                                                Email Verified:
                                                            </span>
                                                            <span className={`font-medium ${profileData?.user?.email_verified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                {profileData?.user?.email_verified ? 'Verified' : 'Not Verified'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-blue-700 dark:text-blue-300">
                                                                Account Status:
                                                            </span>
                                                            <span className="font-medium text-blue-900 dark:text-blue-100">
                                                                Active
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                    <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                                                        <Globe className="w-5 h-5" />
                                                        Quick Actions
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <button
                                                            onClick={() => setIsFormOpen(true)}
                                                            className="w-full text-left px-3 py-2 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 rounded transition-colors"
                                                        >
                                                            Update Business Information
                                                        </button>
                                                        <button className="w-full text-left px-3 py-2 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 rounded transition-colors">
                                                            View Account Settings
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "social" && (
                                <div className="animate-fadeIn">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                            Social Media Links
                                        </h2>

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
                                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    {getSocialLink('facebook') ? (
                                                        <a
                                                            href={getSocialLink('facebook')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            View Facebook Page
                                                        </a>
                                                    ) : (
                                                        <p className="text-gray-500">
                                                            No Facebook page connected
                                                        </p>
                                                    )}
                                                </div>
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
                                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    {getSocialLink('instagram') ? (
                                                        <a
                                                            href={getSocialLink('instagram')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            View Instagram Profile
                                                        </a>
                                                    ) : (
                                                        <p className="text-gray-500">
                                                            No Instagram profile connected
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Social Platforms */}
                                        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                                                Other Social Platforms
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {profileData?.social?.filter(social =>
                                                    !social.platform?.toLowerCase().includes('facebook') &&
                                                    !social.platform?.toLowerCase().includes('instagram')
                                                ).map((social, index) => (
                                                    <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Globe className="w-4 h-4 text-gray-500" />
                                                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                                                                {social.platform || 'Other'}
                                                            </span>
                                                        </div>
                                                        <a
                                                            href={social.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            Visit Link
                                                        </a>
                                                    </div>
                                                )) || (
                                                        <p className="text-gray-500 col-span-full text-center py-4">
                                                            No additional social platforms connected
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form Dialog */}
            <ProfileForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={profileData}
            />
        </>
    );
}