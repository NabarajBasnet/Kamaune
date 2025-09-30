'use client';

import { useState } from "react";
import {
    Gift,
    Search,
    Plus,
    Edit,
    Trash2,
    Star,
    TrendingUp,
    Users,
    Target,
    ShoppingCart,
    CheckCircle,
    Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FirstStatCards from "./FirstStatCards";
import SecondStatCards from "./SecondStatCards";
import OfferFilterAndSearch from "./FilterAndSearch";
import OffersGrid from "./OffersGrid";
import { getOfferStatus } from "@/utils/offers";
import { OfferModal } from "../ui/OfferModal";
import { useQuery } from "@tanstack/react-query";
import { getOffers } from "@/services/offer/offer.service";

// Mock data for offers
const mockOffers = [
    {
        id: "1",
        name: "Summer Sale Discount",
        merchant: {
            name: "Fashion Store",
            slug: "fashion-store"
        },
        short_description: "Get up to 50% off on summer collection",
        banner_image: "/api/placeholder/400/100",
        image: "/api/placeholder/300/150",
        cashback_button_text: "10% Cashback",
        cashback_type: "Percentage",
        tracking_speed: "Instant",
        expected_confirmation_days: 3,
        rating_value: 4.5,
        rating_count: 124,
        app_orders: "256",
        app_tracking_enabled_android: true,
        app_tracking_enabled_ios: true,
        accept_ticket: true,
        report_store_categoryname: "Fashion",
        slug: "summer-sale-discount"
    },
    {
        id: "2",
        name: "Electronics Flash Sale",
        merchant: {
            name: "Tech World",
            slug: "tech-world"
        },
        short_description: "Latest gadgets with amazing discounts",
        banner_image: "/api/placeholder/400/100",
        image: "/api/placeholder/300/150",
        cashback_button_text: "₹200 Cashback",
        cashback_type: "Fixed",
        tracking_speed: "24 Hours",
        expected_confirmation_days: 2,
        rating_value: 4.2,
        rating_count: 89,
        app_orders: "189",
        app_tracking_enabled_android: true,
        app_tracking_enabled_ios: false,
        accept_ticket: false,
        report_store_categoryname: "Electronics",
        slug: "electronics-flash-sale"
    },
    {
        id: "3",
        name: "Weekend Grocery Offer",
        merchant: {
            name: "Super Mart",
            slug: "super-mart"
        },
        short_description: "Special discounts on grocery items",
        banner_image: "/api/placeholder/400/100",
        image: "/api/placeholder/300/150",
        cashback_button_text: "5% Cashback",
        cashback_type: "Percentage",
        tracking_speed: "48 Hours",
        expected_confirmation_days: 5,
        rating_value: 4.0,
        rating_count: 67,
        app_orders: "312",
        app_tracking_enabled_android: false,
        app_tracking_enabled_ios: true,
        accept_ticket: true,
        report_store_categoryname: "E-commerce",
        slug: "weekend-grocery-offer"
    }
];

const Offers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [offers, setOffers] = useState(mockOffers);
    const [showOfferModal, setShowOfferModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [deletingOffer, setDeletingOffer] = useState(null)

    const filteredOffers = offers.filter((offer) => {
        const matchesSearch =
            offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer.merchant.name.toLowerCase().includes(searchTerm.toLowerCase());

        const offerStatus = offer.accept_ticket ? "active" : "inactive";
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

    const handleCreateOffer = () => {
        setShowOfferModal(true);
    };


    const confirmDelete = () => {
        if (deletingOffer) {
            setOffers(offers.filter(offer => offer.id !== deletingOffer.id));
            setShowDeleteModal(false);
            setDeletingOffer(null);
        }
    };


    // Calculate stats from mock data
    const totalOffers = offers.length;
    const activeOffers = offers.filter(o => getOfferStatus(o) === "active").length;
    const totalAppOrders = offers.reduce((sum, o) => sum + (parseInt(o.app_orders || "0") || 0), 0);
    const avgRating = offers
        .filter((o) => o.rating_value)
        .reduce((sum, o) => sum + (o.rating_value || 0), 0) /
        offers.filter((o) => o.rating_value).length || 0;

    const { data, isLoading } = useQuery({
        queryKey: ['offers'],
        queryFn: () => getOffers(),
    })

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <FirstStatCards offers={mockOffers} />

            {/* Secondary Stats */}
            <SecondStatCards offers={mockOffers} />

            {/* Filter and Search */}
            <OfferFilterAndSearch showOfferModal={showOfferModal} setShowOfferModal={setShowOfferModal} />

            {showOfferModal && (
                <OfferModal offer={mockOffers} onSubmit={() => console.log('Submit')} mode="create" showOfferModal={showOfferModal} setShowOfferModal={setShowOfferModal} />
            )}

            {/* Offers Grid */}
            <OffersGrid data={data} isLoading={isLoading} />

            {filteredOffers.length === 0 && (
                <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {offers.length === 0
                            ? "No offers yet"
                            : "No offers match your filters"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {offers.length === 0
                            ? "Get started by creating your first offer"
                            : "Try adjusting your search or filter criteria"}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={handleCreateOffer}
                            className="bg-orange-600 text-white hover:bg-orange-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {offers.length === 0
                                ? "Create Your First Offer"
                                : "Create New Offer"}
                        </Button>
                        {offers.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedStatus("All Status");
                                    setSelectedCategory("All Categories");
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-2">Delete Offer</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to delete "{deletingOffer?.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Offers;
