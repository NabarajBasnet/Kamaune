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
    Plus,
    List,
    Edit,
    Eye,
    Target,
    PieChart,
    Calendar,
    Tags,
    Percent,
    History,
    CheckCircle,
    UserCheck,
    Shield,
    Wallet,
    Clock
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
        subItems: [
            {
                label: "All Products",
                path: "/dashboard/products/all",
                icon: <List className="text-sm" />,
                description: "View all products"
            },
            {
                label: "Add Product",
                path: "/dashboard/products/add",
                icon: <Plus className="text-sm" />,
                description: "Create new product"
            },
            {
                label: "Categories",
                path: "/dashboard/products/categories",
                icon: <Tags className="text-sm" />,
                description: "Manage product categories"
            },
            {
                label: "Inventory",
                path: "/dashboard/products/inventory",
                icon: <Package className="text-sm" />,
                description: "Track product inventory"
            }
        ]
    },
    {
        label: "Campaigns",
        path: "/dashboard/campaigns",
        icon: <Megaphone className="text-lg" />,
        description: "Create and track campaigns",
        subItems: [
            {
                label: "All Campaigns",
                path: "/dashboard/campaigns/all",
                icon: <List className="text-sm" />,
                description: "View all campaigns"
            },
            {
                label: "Create Campaign",
                path: "/dashboard/campaigns/create",
                icon: <Plus className="text-sm" />,
                description: "Create new campaign"
            },
            {
                label: "Active Campaigns",
                path: "/dashboard/campaigns/active",
                icon: <Target className="text-sm" />,
                description: "Currently running campaigns"
            },
            {
                label: "Campaign Reports",
                path: "/dashboard/campaigns/reports",
                icon: <BarChart3 className="text-sm" />,
                description: "Campaign performance reports"
            }
        ]
    },
    {
        label: "Analytics",
        path: "/dashboard/analytics",
        icon: <BarChart3 className="text-lg" />,
        description: "Insights and performance metrics",
        subItems: [
            {
                label: "Overview",
                path: "/dashboard/analytics/overview",
                icon: <PieChart className="text-sm" />,
                description: "Analytics overview"
            },
            {
                label: "Traffic Analytics",
                path: "/dashboard/analytics/traffic",
                icon: <TrendingUp className="text-sm" />,
                description: "Website traffic analysis"
            },
            {
                label: "Sales Analytics",
                path: "/dashboard/analytics/sales",
                icon: <DollarSign className="text-sm" />,
                description: "Sales performance metrics"
            },
            {
                label: "Custom Reports",
                path: "/dashboard/analytics/reports",
                icon: <Calendar className="text-sm" />,
                description: "Create custom reports"
            }
        ]
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
        subItems: [
            {
                label: "All Coupons",
                path: "/dashboard/coupons/all",
                icon: <List className="text-sm" />,
                description: "View all coupons"
            },
            {
                label: "Create Coupon",
                path: "/dashboard/coupons/create",
                icon: <Plus className="text-sm" />,
                description: "Create new coupon"
            },
            {
                label: "Active Coupons",
                path: "/dashboard/coupons/active",
                icon: <Percent className="text-sm" />,
                description: "Currently active coupons"
            },
            {
                label: "Usage History",
                path: "/dashboard/coupons/history",
                icon: <History className="text-sm" />,
                description: "Coupon usage history"
            }
        ]
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
        subItems: [
            {
                label: "Pending Payouts",
                path: "/dashboard/payouts/pending",
                icon: <Clock className="text-sm" />,
                description: "Payouts awaiting processing"
            },
            {
                label: "Completed Payouts",
                path: "/dashboard/payouts/completed",
                icon: <CheckCircle className="text-sm" />,
                description: "Successfully processed payouts"
            },
            {
                label: "Payout History",
                path: "/dashboard/payouts/history",
                icon: <History className="text-sm" />,
                description: "Complete payout history"
            },
            {
                label: "Payment Methods",
                path: "/dashboard/payouts/methods",
                icon: <Wallet className="text-sm" />,
                description: "Manage payment methods"
            }
        ]
    },
];

export const accountMenuItems = [
    {
        label: "Profile",
        path: "/dashboard/profile",
        icon: <User className="text-lg" />,
        description: "Update personal information",
        subItems: [
            {
                label: "Personal Info",
                path: "/dashboard/profile/personal",
                icon: <UserCheck className="text-sm" />,
                description: "Update personal details"
            },
            {
                label: "Security",
                path: "/dashboard/profile/security",
                icon: <Shield className="text-sm" />,
                description: "Security settings"
            },
            {
                label: "Preferences",
                path: "/dashboard/profile/preferences",
                icon: <Settings className="text-sm" />,
                description: "Account preferences"
            }
        ]
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
        subItems: [
            {
                label: "Payment Methods",
                path: "/dashboard/billing/methods",
                icon: <CreditCard className="text-sm" />,
                description: "Manage payment methods"
            },
            {
                label: "Invoices",
                path: "/dashboard/billing/invoices",
                icon: <List className="text-sm" />,
                description: "View billing history"
            },
            {
                label: "Subscription",
                path: "/dashboard/billing/subscription",
                icon: <Calendar className="text-sm" />,
                description: "Manage subscription"
            }
        ]
    },
];