import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Search,
    ChevronDown,
    Check,
    Plus,
    Building,
    Loader2,
    AlertCircle,
    X,
} from "lucide-react";
import { Button } from "./button";
import { merchantService, merchantKeys, type MerchantData } from "@/services/merchant/merchant.service";

interface MerchantSelectProps {
    value?: MerchantData | null;
    onChange: (merchant: MerchantData | null) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    allowCreate?: boolean;
    publisherId?: number;
    className?: string;
}

interface MerchantOption {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    cashback_type?: string | null;
}

export function MerchantSelect({
    value,
    onChange,
    placeholder = "Select a merchant...",
    error,
    disabled = false,
    required = false,
    allowCreate = false,
    publisherId,
    className = "",
}: MerchantSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMerchantName, setNewMerchantName] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Fetch merchants
    const {
        data: merchants = [],
        isLoading: isFetchingMerchants,
        error: fetchError,
        refetch: refetchMerchants,
    } = useQuery({
        queryKey: publisherId
            ? merchantKeys.byPublisher(publisherId)
            : merchantKeys.lists(),
        queryFn: () =>
            publisherId
                ? merchantService.getMerchantsByPublisher(publisherId)
                : merchantService.getMerchants(),
        staleTime: 0,
        retry: 1,
    });

    // Search merchants
    const {
        data: searchResults = [],
        isLoading: isSearching,
        refetch: performSearch,
    } = useQuery({
        queryKey: merchantKeys.search(searchQuery),
        queryFn: () => merchantService.searchMerchants(searchQuery),
        enabled: false, // Manual trigger
        staleTime: 0, // 1 minute for search results
    });

    // Filter merchants based on search
    const filteredMerchants = searchQuery.trim() ? searchResults : merchants;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setShowCreateForm(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.addEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Perform search when query changes
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch();
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchQuery, performSearch]);

    const handleSelect = (merchant: MerchantData) => {
        onChange(merchant);
        setIsOpen(false);
        setSearchQuery("");
        setShowCreateForm(false);
    };

    const handleClear = () => {
        onChange(null);
        setSearchQuery("");
    };

    const handleCreateNew = () => {
        setShowCreateForm(true);
        setNewMerchantName(searchQuery);
    };

    const handleCreateSubmit = async () => {
        if (!newMerchantName.trim()) {
            toast.error("Merchant name is required");
            return;
        }

        try {
            // Auto-generate slug from name
            const slug = newMerchantName
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");

            const newMerchant = await merchantService.createMerchant({
                name: newMerchantName.trim(),
                slug: slug,
                publisher: publisherId || 1,
                terms_and_conditions: "Standard terms and conditions",
                is_coupon: false,
                app_tracking_enabled_android: false,
                app_tracking_enabled_ios: false,
                is_custom_override_case: false,
            });

            // Refresh merchants list
            refetchMerchants();

            // Select the new merchant
            handleSelect(newMerchant);

            toast.success(
                `"${newMerchant.name}" has been created successfully.`
            );

            setNewMerchantName("");
            setShowCreateForm(false);
        } catch (error) {
            console.error("Failed to create merchant:", error);
            toast.error("Failed to create merchant. Please try again."
            );
        }
    };

    const renderMerchantOption = (merchant: MerchantData) => (
        <div
            key={merchant.id}
            onClick={() => handleSelect(merchant)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        >
            {merchant.image ? (
                <img
                    src={merchant.image}
                    alt={merchant.name}
                    className="w-8 h-8 rounded-lg object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
            ) : (
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                    {merchant.name}
                </p>
                {merchant.cashback_type && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {merchant.cashback_type}
                    </p>
                )}
            </div>

            {value?.id === merchant.id && (
                <Check className="w-5 h-5 text-orange-600" />
            )}
        </div>
    );

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Selected Value Display */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 border cursor-pointer transition-colors ${error
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <div className="flex items-center justify-between">
                    {value ? (
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {value.image ? (
                                <img
                                    src={value.image}
                                    alt={value.name}
                                    className="w-6 h-6 rounded object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <Building className="w-6 h-6 text-gray-400" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {value.name}
                                </p>
                                {value.cashback_type && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {value.cashback_type}
                                    </p>
                                )}
                            </div>
                            {!disabled && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClear();
                                    }}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                >
                                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                            {placeholder}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                    )}

                    <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""
                            }`}
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search merchants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-sm"
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-48 overflow-y-auto">
                        {isFetchingMerchants ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500 dark:text-gray-400">
                                    Loading merchants...
                                </span>
                            </div>
                        ) : fetchError ? (
                            <div className="p-4 text-center">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Failed to load merchants
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetchMerchants()}
                                    className="text-xs"
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredMerchants.length === 0 ? (
                            <div className="p-4 text-center">
                                <Building className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {searchQuery
                                        ? "No merchants found"
                                        : "No merchants available"}
                                </p>
                                {allowCreate && searchQuery && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCreateNew}
                                        className="text-xs"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Create "{searchQuery}"
                                    </Button>
                                )}
                            </div>
                        ) : (
                            filteredMerchants.map(renderMerchantOption)
                        )}

                        {/* Create New Option */}
                        {allowCreate && searchQuery && filteredMerchants.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-600">
                                <div
                                    onClick={handleCreateNew}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-orange-600 dark:text-orange-400"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="font-medium">Create "{searchQuery}"</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Create Form */}
                    {showCreateForm && (
                        <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                Create New Merchant
                            </h4>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Merchant name"
                                    value={newMerchantName}
                                    onChange={(e) => setNewMerchantName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleCreateSubmit();
                                        }
                                    }}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCreateSubmit}
                                        disabled={!newMerchantName.trim()}
                                        className="flex-1 bg-orange-600 text-white hover:bg-orange-700 text-sm py-2"
                                    >
                                        Create
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCreateForm(false)}
                                        className="text-sm py-2"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
