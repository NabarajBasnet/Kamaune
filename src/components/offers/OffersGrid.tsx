import { useState } from "react";
import { Card } from "../ui/card";
import { getOfferStatus, getStatusColor, getStatusIcon, toggleOfferStatus } from "@/utils/offers";
import { Star, ShoppingCart, Trash2, Pause, CheckCircle, Edit, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { GridProps } from "@/types/offers";

const OffersGrid = ({ data, isLoading }: GridProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [deletingOffer, setDeletingOffer] = useState(null);

    // Use actual data from API
    const offers = data?.data?.results || [];

    const filteredOffers = offers.filter((offer) => {
        const matchesSearch =
            offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer.merchant.name.toLowerCase().includes(searchTerm.toLowerCase());

        const offerStatus = getOfferStatus(offer);
        const matchesStatus =
            selectedStatus === "All Status" ||
            offerStatus === selectedStatus.toLowerCase();

        const matchesCategory =
            selectedCategory === "All Categories" ||
            (offer.report_store_categoryname &&
                offer.report_store_categoryname
                    .toLowerCase()
                    .includes(selectedCategory.toLowerCase()));

        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="rounded-xl overflow-hidden animate-pulse">
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!offers.length) {
        return (
            <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No offers found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    There are no offers available at the moment.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOffers.map((offer) => {
                    const status = getOfferStatus(offer);
                    const isActive = status === "active";

                    return (
                        <Card
                            key={offer.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800"
                        >
                            <div className="p-6">
                                {/* Header with Status and Category */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(
                                                    status
                                                )}`}
                                            >
                                                {getStatusIcon(status)}
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                            {offer.report_store_categoryname && (
                                                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                                                    <Tag className="w-3 h-3" />
                                                    {offer.report_store_categoryname}
                                                </span>
                                            )}
                                        </div>

                                        {/* Merchant Info */}
                                        <div className="flex items-center gap-3 mb-3">
                                            {offer.merchant.image && (
                                                <img
                                                    src={offer.merchant.image}
                                                    alt={offer.merchant.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                    {offer.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {offer.merchant.name}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {offer.short_description}
                                        </p>
                                    </div>
                                </div>

                                {/* Banner Image */}
                                {offer.banner_image && (
                                    <div className="mb-4 -mx-6 mt-2">
                                        <img
                                            src={offer.banner_image}
                                            alt={`${offer.name} banner`}
                                            className="w-full h-20 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Offer Image */}
                                {offer.image && (
                                    <div className="mb-4">
                                        <img
                                            src={offer.image}
                                            alt={offer.name}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Cashback Highlight */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Cashback Offer
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {offer.cashback_button_text}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                {offer.cashback_type.toLowerCase()} • {offer.tracking_speed}
                                            </p>
                                        </div>
                                        {offer.is_exclusive && (
                                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                                Exclusive
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Offer Details Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-400">Confirmation</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {offer.expected_confirmation_days} days
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-400">Valid Until</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {new Date(offer.end_date_time).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating and Orders */}
                                <div className="flex items-center justify-between mb-4">
                                    {offer.rating_value > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(offer.rating_value)
                                                            ? "text-yellow-400 fill-current"
                                                            : "text-gray-300 dark:text-gray-600"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {offer.rating_value} ({offer.rating_count})
                                            </span>
                                        </div>
                                    )}

                                    {offer.app_orders && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>{offer.app_orders} orders</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tracking Features */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {offer.app_tracking_enabled_android && (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                                            Android
                                        </span>
                                    )}
                                    {offer.app_tracking_enabled_ios && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                                            iOS
                                        </span>
                                    )}
                                    {offer.accept_ticket && (
                                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                            Ticket Support
                                        </span>
                                    )}
                                    {offer.is_custom_override_case && (
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded text-xs font-medium">
                                            Custom Rules
                                        </span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        variant={isActive ? "outline" : "default"}
                                        size="sm"
                                        onClick={() => toggleOfferStatus(offer)}
                                        className="flex-1"
                                    >
                                        {isActive ? (
                                            <>
                                                <Pause className="w-4 h-4 mr-2" />
                                                Deactivate
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Activate
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="p-2 border-gray-300 dark:border-gray-600"
                                        title="Edit Offer"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="p-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white"
                                        title="Delete Offer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default OffersGrid;
