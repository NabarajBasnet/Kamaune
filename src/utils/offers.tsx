import { CheckCircle, Pause } from "lucide-react";

export const getOfferStatus = (offer: any) => {
    if (offer.accept_ticket && offer.expected_confirmation_days > 0) return "active";
    if (!offer.accept_ticket) return "inactive";
    if (offer.expected_confirmation_days <= 0) return "expired";
    return "pending";
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
        case "inactive":
            return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
        case "pending":
            return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
        case "expired":
            return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
        default:
            return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
};

export const getStatusIcon = (status: string) => {
    switch (status) {
        case "active":
            return <CheckCircle className="w-4 h-4" />;
        case "inactive":
            return <Pause className="w-4 h-4" />;
        default:
            return <CheckCircle className="w-4 h-4" />;
    }
};


export const toggleOfferStatus = (offers: any) => {
    return (offers.map((o: any) =>
        o.id === offers.id
            ? { ...o, accept_ticket: !o.accept_ticket }
            : o
    ));
};
