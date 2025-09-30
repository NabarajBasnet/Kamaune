'use client'

import { Button } from "../ui/button";
import { Plus, Search } from "lucide-react";

const statusOptions = [
    "All Status",
    "Active",
    "Inactive",
    "Pending",
    "Expired",
];

const categoryOptions = [
    "All Categories",
    "E-commerce",
    "Fashion",
    "Electronics",
    "General",
];

const OfferFilterAndSearch = ({ showOfferModal, setShowOfferModal }: any) => {

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                        Offer Management
                    </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={() => setShowOfferModal(!showOfferModal)}
                        className="bg-orange-600 cursor-pointer py-5.5 text-white hover:bg-orange-700 lg:hidden"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Offer
                    </Button>

                    <select
                        className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                        {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search offers..."
                            className="bg-white dark:bg-gray-800 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        />
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Create Offer Button for Desktop */}
            <div className="hidden lg:flex mt-4 justify-end">
                <Button
                    onClick={() => setShowOfferModal(!showOfferModal)}
                    className="bg-orange-600 cursor-pointer py-5.5 text-white hover:bg-orange-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Offer
                </Button>
            </div>
        </div>
    )
}
export default OfferFilterAndSearch;
