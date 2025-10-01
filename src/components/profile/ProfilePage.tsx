'use client';

import { useState, useEffect } from "react";
import {
    User,
    Edit,
    Camera,
    Briefcase,
    AlertCircle,
    Loader2,
    Share2,
    ExternalLink,
    Instagram,
    Facebook,
    X,
} from "lucide-react";

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

// Mock data
const mockProfileData = {
    id: 68,
    user: 68,
    Business_name: "Tech Innovations Ltd",
    Phone_number: "+1 (555) 123-4567",
    city: "Kathmandu",
    State_Province: 4,
    address: "123 Main Street, Thamel",
    Business_Type: 5,
    url: "https://techinnovations.com",
    affiliate_data: "Premium technology partner with 5+ years of experience in software development and IT solutions.",
    facebook: "https://facebook.com/techinnovations",
    instagram: "https://instagram.com/techinnovations",
    Commission_payment: 15,
    profile_picture: null,
};

const mockMerchantsData = [
    {
        id: 1,
        name: "Tech Store",
        slug: "tech-store",
        status: "active",
        description: "Your one-stop shop for all tech gadgets"
    },
    {
        id: 2,
        name: "Software Solutions",
        slug: "software-solutions",
        status: "active",
        description: "Custom software development services"
    }
];

export function Profile() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Business_name: "",
        Phone_number: "",
        city: "",
        State_Province: 4,
        address: "",
        Business_Type: 4,
        url: "",
        affiliate_data: "",
        facebook: "",
        instagram: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState(mockProfileData);
    const [merchantsData, setMerchantsData] = useState(mockMerchantsData);

    // Simulate loading state
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Initialize form data when component mounts
    useEffect(() => {
        setFormData({
            Business_name: profileData.Business_name,
            Phone_number: profileData.Phone_number,
            city: profileData.city,
            State_Province: profileData.State_Province,
            address: profileData.address || "",
            Business_Type: profileData.Business_Type,
            url: profileData.url || "",
            affiliate_data: profileData.affiliate_data,
            facebook: profileData.facebook || "",
            instagram: profileData.instagram || "",
        });
    }, [profileData]);

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

    // Handle form input changes
    const handleInputChange = (
        field: keyof typeof formData,
        value: string | number
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Handle save profile
    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Update mock data with form data
            setProfileData(prev => ({
                ...prev,
                ...formData
            }));

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Show loading state
    if (isLoading) {
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
        <div className="min-h-screen dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
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
                </div>

                {/* Simplified Tab Navigation */}
                <div className="flex justify-center sm:justify-start mb-8">
                    <div className="flex gap-1 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "profile"
                                ? "bg-emerald-600 text-white shadow-md"
                                : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span>Profile Info</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("business")}
                            className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "business"
                                ? "bg-emerald-600 text-white shadow-md"
                                : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            <Briefcase className="w-5 h-5" />
                            <span>Business Details</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("social")}
                            className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === "social"
                                ? "bg-emerald-600 text-white shadow-md"
                                : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            <Share2 className="w-5 h-5" />
                            <span>Social Links</span>
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="w-full">
                    <div className="transition-all duration-300 ease-in-out">
                        {activeTab === "profile" && (
                            <div className="animate-fadeIn">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Profile Information
                                        </h2>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                                                ? "bg-gray-500 hover:bg-gray-600 text-white"
                                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                }`}
                                        >
                                            {isEditing ? (
                                                <>
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </>
                                            ) : (
                                                <>
                                                    <Edit className="w-4 h-4" />
                                                    Edit Profile
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Profile Picture */}
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="relative">
                                                {profileData.profile_picture ? (
                                                    <img
                                                        src={profileData.profile_picture}
                                                        alt="Profile Picture"
                                                        className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-4xl font-bold text-white">
                                                        {profileData.Business_name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                {isEditing && (
                                                    <button className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 p-2 rounded-full transition-colors">
                                                        <Camera className="w-4 h-4 text-white" />
                                                    </button>
                                                )}
                                            </div>
                                            {isEditing && (
                                                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                                    Change Photo
                                                </button>
                                            )}
                                        </div>

                                        {/* Profile Form */}
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Business Name
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={formData.Business_name}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "Business_name",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData.Business_name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Phone Number
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="tel"
                                                            value={formData.Phone_number}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "Phone_number",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData.Phone_number}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        City
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={formData.city}
                                                            onChange={(e) =>
                                                                handleInputChange("city", e.target.value)
                                                            }
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData.city}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        State/Province
                                                    </label>
                                                    {isEditing ? (
                                                        <select
                                                            value={formData.State_Province}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "State_Province",
                                                                    parseInt(e.target.value)
                                                                )
                                                            }
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                        >
                                                            <option value={1}>Province 1</option>
                                                            <option value={2}>Province 2</option>
                                                            <option value={3}>Bagmati Province</option>
                                                            <option value={4}>Gandaki Province</option>
                                                            <option value={5}>Lumbini Province</option>
                                                            <option value={6}>Karnali Province</option>
                                                            <option value={7}>Sudurpashchim Province</option>
                                                        </select>
                                                    ) : (
                                                        <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {profileData.State_Province === 4
                                                                ? "Gandaki Province"
                                                                : `Province ${profileData.State_Province}`}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Address
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={formData.address}
                                                            onChange={(e) =>
                                                                handleInputChange("address", e.target.value)
                                                            }
                                                            placeholder="Enter your address"
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                        />
                                                    ) : (
                                                        <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                            {formData.address || "No address provided"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className="flex gap-4 mt-8">
                                                    <button
                                                        onClick={handleSaveProfile}
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
                                                        onClick={() => setIsEditing(false)}
                                                        disabled={isSaving}
                                                        className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
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
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Business Details
                                        </h2>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                                                ? "bg-gray-500 hover:bg-gray-600 text-white"
                                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                }`}
                                        >
                                            {isEditing ? (
                                                <>
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </>
                                            ) : (
                                                <>
                                                    <Edit className="w-4 h-4" />
                                                    Edit Business
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Business Type
                                                </label>
                                                {isEditing ? (
                                                    <select
                                                        value={formData.Business_Type}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "Business_Type",
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                    >
                                                        {Object.entries(businessTypes).map(([id, name]) => (
                                                            <option key={id} value={id}>
                                                                {name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                        {businessTypes[profileData.Business_Type] ||
                                                            "Other"}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Commission Rate (%)
                                                </label>
                                                <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                        {profileData.Commission_payment}%
                                                    </p>
                                                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                                        Current rate
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Website URL
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="url"
                                                        value={formData.url}
                                                        onChange={(e) =>
                                                            handleInputChange("url", e.target.value)
                                                        }
                                                        placeholder="https://yourwebsite.com"
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium">
                                                        {profileData.url || "No website provided"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Affiliate Data
                                                </label>
                                                {isEditing ? (
                                                    <textarea
                                                        value={formData.affiliate_data}
                                                        onChange={(e) =>
                                                            handleInputChange("affiliate_data", e.target.value)
                                                        }
                                                        rows={4}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white font-medium min-h-[120px] flex items-start">
                                                        {profileData.affiliate_data}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                                    Account Information
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-blue-700 dark:text-blue-300">
                                                            Publisher ID:
                                                        </span>
                                                        <span className="font-medium text-blue-900 dark:text-blue-100">
                                                            {profileData.id}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-blue-700 dark:text-blue-300">
                                                            User ID:
                                                        </span>
                                                        <span className="font-medium text-blue-900 dark:text-blue-100">
                                                            {profileData.user}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-4 mt-8">
                                            <button
                                                onClick={handleSaveProfile}
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
                                                onClick={() => setIsEditing(false)}
                                                disabled={isSaving}
                                                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "social" && (
                            <div className="animate-fadeIn">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Social Media Links
                                        </h2>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                                                ? "bg-gray-500 hover:bg-gray-600 text-white"
                                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                }`}
                                        >
                                            {isEditing ? (
                                                <>
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </>
                                            ) : (
                                                <>
                                                    <Edit className="w-4 h-4" />
                                                    Edit Links
                                                </>
                                            )}
                                        </button>
                                    </div>

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
                                            {isEditing ? (
                                                <input
                                                    type="url"
                                                    value={formData.facebook}
                                                    onChange={(e) =>
                                                        handleInputChange("facebook", e.target.value)
                                                    }
                                                    placeholder="https://facebook.com/yourpage"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    {formData.facebook ? (
                                                        <a
                                                            href={formData.facebook}
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
                                            )}
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
                                            {isEditing ? (
                                                <input
                                                    type="url"
                                                    value={formData.instagram}
                                                    onChange={(e) =>
                                                        handleInputChange("instagram", e.target.value)
                                                    }
                                                    placeholder="https://instagram.com/yourusername"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    {formData.instagram ? (
                                                        <a
                                                            href={formData.instagram}
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
                                            )}
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-4 mt-8">
                                            <button
                                                onClick={handleSaveProfile}
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
                                                onClick={() => setIsEditing(false)}
                                                disabled={isSaving}
                                                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}