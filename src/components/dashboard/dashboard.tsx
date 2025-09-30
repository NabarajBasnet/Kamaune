'use client';

import { ChartCard } from "../ui/ChartCard";
import React, { useState, useEffect } from "react";
import {
    MousePointer,
    BarChart3,
    Link,
    Shield,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PromotionalCarousel } from "./PromotionalCarousel";
import { Doughnut } from "react-chartjs-2";
import {
    DashboardPageSkeleton,
    DashboardStatsSkeleton,
    ChartSkeleton,
    RecentActivitySkeleton,
    TopProductsSkeleton,
} from "../ui/skeletons/DashboardSkeletons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from "chart.js";
import { useRouter } from "next/navigation";

// Mock useAuth hook for Next.js (you'll need to implement this based on your auth system)
const useAuth = () => {
    return {
        user: null,
        isAuthenticated: true,
        checkAuth: () => { },
        validateToken: async () => true,
        isLoading: false
    };
};

// Mock useNavigate replacement for Next.js
const useNavigate = () => {
    const router = useRouter();
    return router.push;
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const earningsData = {
    daily: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [650, 890, 750, 1200, 980, 1450, 1100],
    },
    weekly: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [4500, 5200, 4800, 6100],
    },
    monthly: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [12000, 15000, 13500, 17000, 19000, 21000],
    },
};

const categoryConversionData = {
    labels: ["Fashion", "Electronics", "Beauty", "Sports", "Home & Garden"],
    datasets: [
        {
            data: [28, 22, 18, 16, 16],
            backgroundColor: [
                "#10b981", // emerald-500
                "#3b82f6", // blue-500
                "#ec4899", // pink-500
                "#f59e0b", // amber-500
                "#8b5cf6", // violet-500
            ],
            borderColor: [
                "#059669", // emerald-600
                "#2563eb", // blue-600
                "#db2777", // pink-600
                "#d97706", // amber-600
                "#7c3aed", // violet-600
            ],
            borderWidth: 2,
            hoverBackgroundColor: [
                "#059669",
                "#2563eb",
                "#db2777",
                "#d97706",
                "#7c3aed",
            ],
        },
    ],
};

const stats = [
    {
        title: "Total Earnings",
        value: "₹45,678",
        description: "+12.5% from last month",
        icon: () => (
            <svg
                className="w-8 h-8 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
        ),
        trend: "up",
        color: "emerald",
    },
    {
        title: "Total Clicks",
        value: "12,456",
        description: "+8.2% from last month",
        icon: MousePointer,
        trend: "up",
        color: "blue",
    },
    {
        title: "Conversion Rate",
        value: "3.2%",
        description: "+0.5% from last month",
        icon: BarChart3,
        trend: "up",
        color: "purple",
    },
    {
        title: "Active Links",
        value: "48",
        description: "12 created this week",
        icon: Link,
        trend: "up",
        color: "yellow",
    },
];

export function Dashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated, checkAuth, validateToken, isLoading } = useAuth();
    const [authStatus, setAuthStatus] = React.useState<string>("checking");
    const [dataLoading, setDataLoading] = useState(true);

    // Simulate data loading for demo purposes
    useEffect(() => {
        const timer = setTimeout(() => {
            setDataLoading(false);
        }, 1500); // Show skeleton for 1.5 seconds

        return () => clearTimeout(timer);
    }, []);

    const debugAuth = async () => {
        // Check localStorage
        if (typeof window !== 'undefined') {
            const keys = [
                "authToken",
                "access_token",
                "accessToken",
                "token",
                "userData",
                "refreshToken",
                "refresh_token",
                "refresh",
            ];
            keys.forEach((key) => {
                const value = localStorage.getItem(key);
                if (value) {
                    console.log(`Found ${key} in localStorage`);
                }
            });
        }

        // Try token validation
        try {
            const isValid = await validateToken();
            setAuthStatus(isValid ? "valid" : "invalid");
        } catch (error) {
            setAuthStatus("error");
        }
    };

    React.useEffect(() => {
        // Auto-run debug on mount
        debugAuth();
    }, []);

    // Show skeleton loading while data is loading
    if (isLoading || dataLoading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Minimal Promotional Carousel Section */}
            <PromotionalCarousel
                className="mb-4"
                height="h-[150px] md:h-[180px]"
                autoPlay={true}
                autoPlayInterval={5000}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card
                        key={stat.title}
                        className="p-6 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </h3>
                            {React.createElement(stat.icon, {
                                className: `w-8 h-8 text-${stat.color}-500`,
                            })}
                        </div>
                        <p className="text-2xl lg:text-3xl font-bold mb-1 text-foreground">
                            {stat.value}
                        </p>
                        <p className={`text-sm text-${stat.color}-500`}>
                            {stat.description}
                        </p>
                    </Card>
                ))}
            </div>

            {/* Top Row: Earnings Overview (2/3) + Category Conversions Pie Chart (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard
                        title="Earnings Overview"
                        data={earningsData}
                        defaultPeriod="daily"
                    />
                </div>

                <Card className="p-6 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                        Category Conversions
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        <Doughnut
                            data={categoryConversionData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                        labels: {
                                            padding: 15,
                                            usePointStyle: true,
                                            font: {
                                                size: 11,
                                            },
                                        },
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return `${context.label}: ${context.parsed}%`;
                                            },
                                        },
                                    },
                                },
                                cutout: "60%",
                            }}
                        />
                    </div>
                </Card>
            </div>

            {/* Bottom Row: Conversion Data (2/3) + Leaderboard (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm lg:col-span-2 relative">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                        Recent Conversions
                    </h3>
                    <div className="overflow-x-auto max-h-64 relative">
                        <table className="w-full min-w-[500px]">
                            <thead className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Product</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Commission</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-border">
                                    <td className="py-3 text-foreground">Jan 22</td>
                                    <td className="py-3 text-foreground">Wireless Headphones</td>
                                    <td className="py-3 text-foreground">John D.</td>
                                    <td className="py-3 text-foreground">₹850</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs">
                                            Confirmed
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 text-foreground">Jan 22</td>
                                    <td className="py-3 text-foreground">Fashion Dress</td>
                                    <td className="py-3 text-foreground">Sarah M.</td>
                                    <td className="py-3 text-foreground">₹640</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">
                                            Processing
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 text-foreground">Jan 21</td>
                                    <td className="py-3 text-foreground">Skincare Set</td>
                                    <td className="py-3 text-foreground">Emma W.</td>
                                    <td className="py-3 text-foreground">₹450</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs">
                                            Confirmed
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 text-foreground">Jan 21</td>
                                    <td className="py-3 text-foreground">Sports Shoes</td>
                                    <td className="py-3 text-foreground">Mike R.</td>
                                    <td className="py-3 text-foreground">₹1,200</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs">
                                            Confirmed
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 text-foreground">Jan 20</td>
                                    <td className="py-3 text-foreground">Home Decor</td>
                                    <td className="py-3 text-foreground">Lisa K.</td>
                                    <td className="py-3 text-foreground">₹320</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 text-foreground">Jan 19</td>
                                    <td className="py-3 text-foreground">Gaming Mouse</td>
                                    <td className="py-3 text-foreground">Alex P.</td>
                                    <td className="py-3 text-foreground">₹450</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs">
                                            Confirmed
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-foreground">Jan 19</td>
                                    <td className="py-3 text-foreground">Watch Collection</td>
                                    <td className="py-3 text-foreground">Nina S.</td>
                                    <td className="py-3 text-foreground">₹1,850</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">
                                            Processing
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Gradient Overlay with View More Button */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 dark:from-gray-800/90 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/conversions")}
                            className="text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 hover:bg-white/90 dark:hover:bg-gray-800/90"
                        >
                            View More
                        </Button>
                    </div>
                </Card>

                <Card className="p-6 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                        Top Performers
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-200/20">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                                1
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">Alex Johnson</p>
                                <p className="text-xs text-muted-foreground">
                                    ₹28,450 this month
                                </p>
                            </div>
                            <div className="text-yellow-500">🏆</div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-400/10 to-gray-500/10 border border-gray-200/20">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-sm">
                                2
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">Maria Garcia</p>
                                <p className="text-xs text-muted-foreground">
                                    ₹22,340 this month
                                </p>
                            </div>
                            <div className="text-gray-400">🥈</div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-600/10 to-orange-700/10 border border-orange-200/20">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white font-bold text-sm">
                                3
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">David Chen</p>
                                <p className="text-xs text-muted-foreground">
                                    ₹19,680 this month
                                </p>
                            </div>
                            <div className="text-orange-600">🥉</div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                4
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">You</p>
                                <p className="text-xs text-muted-foreground">
                                    ₹16,890 this month
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                5
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">Sophie Lee</p>
                                <p className="text-xs text-muted-foreground">
                                    ₹14,250 this month
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity Table */}
            <Card className="p-6 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm relative">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                    Recent Activity
                </h3>
                <div className="overflow-x-auto max-h-64 relative">
                    <table className="w-full min-w-[600px]">
                        <thead className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <tr className="text-left text-sm text-muted-foreground border-b border-border">
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Product</th>
                                <th className="pb-3">Clicks</th>
                                <th className="pb-3">Conv.</th>
                                <th className="pb-3">Earnings</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-border">
                                <td className="py-3 text-foreground">Jan 20</td>
                                <td className="py-3 text-foreground">Summer Fashion</td>
                                <td className="py-3 text-foreground">45</td>
                                <td className="py-3 text-foreground">3</td>
                                <td className="py-3 text-foreground">₹450</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs">
                                        Done
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-3 text-foreground">Jan 19</td>
                                <td className="py-3 text-foreground">Wireless Earbuds</td>
                                <td className="py-3 text-foreground">67</td>
                                <td className="py-3 text-foreground">5</td>
                                <td className="py-3 text-foreground">₹750</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs">
                                        Done
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-3 text-foreground">Jan 18</td>
                                <td className="py-3 text-foreground">Skincare Bundle</td>
                                <td className="py-3 text-foreground">32</td>
                                <td className="py-3 text-foreground">2</td>
                                <td className="py-3 text-foreground">₹300</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">
                                        Pending
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-3 text-foreground">Jan 17</td>
                                <td className="py-3 text-foreground">Smart Watch</td>
                                <td className="py-3 text-foreground">89</td>
                                <td className="py-3 text-foreground">7</td>
                                <td className="py-3 text-foreground">₹1,400</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs">
                                        Done
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-b border-border">
                                <td className="py-3 text-foreground">Jan 16</td>
                                <td className="py-3 text-foreground">Fitness Tracker</td>
                                <td className="py-3 text-foreground">23</td>
                                <td className="py-3 text-foreground">1</td>
                                <td className="py-3 text-foreground">₹180</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">
                                        Processing
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 text-foreground">Jan 15</td>
                                <td className="py-3 text-foreground">Gaming Headset</td>
                                <td className="py-3 text-foreground">54</td>
                                <td className="py-3 text-foreground">4</td>
                                <td className="py-3 text-foreground">₹680</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs">
                                        Done
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bottom Gradient Overlay with View More Button */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 dark:from-gray-800/90 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/analytics")}
                        className="text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 hover:bg-white/90 dark:hover:bg-gray-800/90"
                    >
                        View More
                    </Button>
                </div>
            </Card>
        </div>
    );
}
