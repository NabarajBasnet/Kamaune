import {
    Home,
    Link,
    Package,
    Megaphone,
    BarChart3,
    Gift,
    Ticket,
    TrendingUp,
    Bell,
    DollarSign,
    User,
    Settings,
    CreditCard,
} from "lucide-react";

export const menuItems = [
    {
        label: "Overview",
        path: "/dashboard/overview",
        icon: <Home className="text-lg" />,
        description: "General dashboard overview",
    },
    {
        label: "My Links",
        path: "/dashboard/links",
        icon: <Link className="text-lg" />,
        description: "Manage and share your links",
    },
    {
        label: "Products",
        path: "/dashboard/products",
        icon: <Package className="text-lg" />,
        description: "View and manage products",
    },
    {
        label: "Campaigns",
        path: "/dashboard/campaigns",
        icon: <Megaphone className="text-lg" />,
        description: "Create and track campaigns",
    },
    {
        label: "Analytics",
        path: "/dashboard/analytics",
        icon: <BarChart3 className="text-lg" />,
        description: "Insights and performance metrics",
    },
    {
        label: "Offers",
        path: "/dashboard/offers",
        icon: <Gift className="text-lg" />,
        description: "Special offers and promotions",
    },
    {
        label: "Coupons",
        path: "/dashboard/coupons",
        icon: <Ticket className="text-lg" />,
        description: "Create and manage coupons",
    },
    {
        label: "Conversions",
        path: "/dashboard/conversions",
        icon: <TrendingUp className="text-lg" />,
        description: "Track sales and conversions",
    },
    {
        label: "Notifications",
        path: "/dashboard/notifications",
        icon: <Bell className="text-lg" />,
        description: "Latest alerts and updates",
    },
    {
        label: "Payouts",
        path: "/dashboard/payouts",
        icon: <DollarSign className="text-lg" />,
        description: "View and manage payouts",
    },
];

export const accountMenuItems = [
    {
        label: "Profile",
        path: "/dashboard/profile",
        icon: <User className="text-lg" />,
        description: "Update personal information",
    },
    {
        label: "Settings",
        path: "/dashboard/settings",
        icon: <Settings className="text-lg" />,
        description: "Account preferences",
    },
    {
        label: "Billing",
        path: "/dashboard/billing",
        icon: <CreditCard className="text-lg" />,
        description: "Manage payment details",
    },
];
