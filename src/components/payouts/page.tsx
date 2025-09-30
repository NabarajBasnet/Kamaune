'use client';

import { useState, useEffect } from "react";
import {
    Wallet,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Download,
    Eye,
    Check,
    X,
    DollarSign,
    TrendingUp,
    Users,
    Building,
    Timer,
    IndianRupee,
    Activity,
    ArrowUpDown,
    Filter,
    Plus,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PayoutRequest {
    id: string;
    affiliateId: string;
    affiliateName: string;
    affiliateEmail: string;
    amount: number;
    requestDate: string;
    status: "pending" | "approved" | "processing" | "completed" | "rejected";
    method: "bank" | "upi" | "paypal" | "crypto";
    accountDetails: string;
    earnings: number;
    previousPayouts: number;
    joinDate: string;
    priority: "high" | "medium" | "low";
}

// Dummy data
const payoutRequests: PayoutRequest[] = [
    {
        id: "PAY001",
        affiliateId: "AFF123",
        affiliateName: "Rajesh Kumar",
        affiliateEmail: "rajesh@example.com",
        amount: 15000,
        requestDate: "2024-01-20",
        status: "pending",
        method: "bank",
        accountDetails: "HDFC ****4567",
        earnings: 45000,
        previousPayouts: 120000,
        joinDate: "2023-06-15",
        priority: "high",
    },
    {
        id: "PAY002",
        affiliateId: "AFF456",
        affiliateName: "Priya Sharma",
        affiliateEmail: "priya@example.com",
        amount: 8500,
        requestDate: "2024-01-19",
        status: "approved",
        method: "upi",
        accountDetails: "priya@paytm",
        earnings: 28000,
        previousPayouts: 65000,
        joinDate: "2023-08-20",
        priority: "medium",
    },
    {
        id: "PAY003",
        affiliateId: "AFF789",
        affiliateName: "Amit Patel",
        affiliateEmail: "amit@example.com",
        amount: 22000,
        requestDate: "2024-01-18",
        status: "processing",
        method: "bank",
        accountDetails: "SBI ****8901",
        earnings: 67000,
        previousPayouts: 180000,
        joinDate: "2023-03-10",
        priority: "high",
    },
    {
        id: "PAY004",
        affiliateId: "AFF321",
        affiliateName: "Neha Singh",
        affiliateEmail: "neha@example.com",
        amount: 5000,
        requestDate: "2024-01-17",
        status: "completed",
        method: "paypal",
        accountDetails: "neha@paypal.com",
        earnings: 18000,
        previousPayouts: 35000,
        joinDate: "2023-11-05",
        priority: "low",
    },
    {
        id: "PAY005",
        affiliateId: "AFF654",
        affiliateName: "Vikram Desai",
        affiliateEmail: "vikram@example.com",
        amount: 12000,
        requestDate: "2024-01-16",
        status: "pending",
        method: "crypto",
        accountDetails: "0x742d...3456",
        earnings: 38000,
        previousPayouts: 95000,
        joinDate: "2023-07-22",
        priority: "medium",
    },
    {
        id: "PAY006",
        affiliateId: "AFF777",
        affiliateName: "Anita Roy",
        affiliateEmail: "anita@example.com",
        amount: 18000,
        requestDate: "2024-01-15",
        status: "approved",
        method: "bank",
        accountDetails: "ICICI ****2345",
        earnings: 52000,
        previousPayouts: 145000,
        joinDate: "2023-04-12",
        priority: "high",
    },
    {
        id: "PAY007",
        affiliateId: "AFF888",
        affiliateName: "Rohit Gupta",
        affiliateEmail: "rohit@example.com",
        amount: 7500,
        requestDate: "2024-01-14",
        status: "completed",
        method: "upi",
        accountDetails: "rohit@gpay",
        earnings: 25000,
        previousPayouts: 48000,
        joinDate: "2023-09-08",
        priority: "low",
    },
    {
        id: "PAY008",
        affiliateId: "AFF999",
        affiliateName: "Kavya Menon",
        affiliateEmail: "kavya@example.com",
        amount: 20000,
        requestDate: "2024-01-13",
        status: "pending",
        method: "paypal",
        accountDetails: "kavya@paypal.com",
        earnings: 68000,
        previousPayouts: 155000,
        joinDate: "2023-02-20",
        priority: "high",
    },
    {
        id: "PAY009",
        affiliateId: "AFF111",
        affiliateName: "Suresh Nair",
        affiliateEmail: "suresh@example.com",
        amount: 9500,
        requestDate: "2024-01-12",
        status: "processing",
        method: "bank",
        accountDetails: "Axis ****6789",
        earnings: 32000,
        previousPayouts: 78000,
        joinDate: "2023-08-15",
        priority: "medium",
    },
    {
        id: "PAY010",
        affiliateId: "AFF222",
        affiliateName: "Deepika Joshi",
        affiliateEmail: "deepika@example.com",
        amount: 13500,
        requestDate: "2024-01-11",
        status: "rejected",
        method: "crypto",
        accountDetails: "0x892a...7890",
        earnings: 41000,
        previousPayouts: 89000,
        joinDate: "2023-06-30",
        priority: "low",
    },
    {
        id: "PAY011",
        affiliateId: "AFF333",
        affiliateName: "Arjun Singh",
        affiliateEmail: "arjun@example.com",
        amount: 16000,
        requestDate: "2024-01-10",
        status: "completed",
        method: "upi",
        accountDetails: "arjun@phonepe",
        earnings: 48000,
        previousPayouts: 112000,
        joinDate: "2023-05-18",
        priority: "medium",
    },
    {
        id: "PAY012",
        affiliateId: "AFF444",
        affiliateName: "Meera Patel",
        affiliateEmail: "meera@example.com",
        amount: 11000,
        requestDate: "2024-01-09",
        status: "pending",
        method: "bank",
        accountDetails: "SBI ****1234",
        earnings: 35000,
        previousPayouts: 67000,
        joinDate: "2023-10-25",
        priority: "high",
    },
];

export function Payouts() {
    const [requests, setRequests] = useState<PayoutRequest[]>(payoutRequests);
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterMethod, setFilterMethod] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showDetails, setShowDetails] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"date" | "amount" | "priority">("date");
    const [showRejectConfirm, setShowRejectConfirm] = useState<string | null>(
        null
    );
    const [showApproveConfirm, setShowApproveConfirm] = useState<string | null>(
        null
    );
    const [showBulkApproveConfirm, setShowBulkApproveConfirm] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">(
        "csv"
    );
    const [exportFilename, setExportFilename] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const ITEMS_PER_PAGE = 5;

    // Calculate stats
    const stats = {
        totalPending: requests
            .filter((r) => r.status === "pending")
            .reduce((acc, r) => acc + r.amount, 0),
        totalProcessing: requests
            .filter((r) => r.status === "processing")
            .reduce((acc, r) => acc + r.amount, 0),
        totalCompleted: requests
            .filter((r) => r.status === "completed")
            .reduce((acc, r) => acc + r.amount, 0),
        pendingCount: requests.filter((r) => r.status === "pending").length,
        todayRequests: requests.filter((r) => r.requestDate === "2024-01-20")
            .length,
        avgPayout: Math.round(
            requests.reduce((acc, r) => acc + r.amount, 0) / requests.length
        ),
        totalAffiliates: new Set(requests.map((r) => r.affiliateId)).size,
    };

    // Filter requests
    const filteredRequests = requests.filter((request) => {
        const matchesSearch =
            request.affiliateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.affiliateEmail
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            request.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || request.status === filterStatus;
        const matchesMethod =
            filterMethod === "all" || request.method === filterMethod;
        return matchesSearch && matchesStatus && matchesMethod;
    });

    // Sort requests
    const sortedRequests = [...filteredRequests].sort((a, b) => {
        if (sortBy === "date")
            return (
                new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
            );
        if (sortBy === "amount") return b.amount - a.amount;
        if (sortBy === "priority") {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
    });

    // Paginated requests
    const paginatedRequests = sortedRequests.slice(
        0,
        currentPage * ITEMS_PER_PAGE
    );
    const hasMoreItems = sortedRequests.length > currentPage * ITEMS_PER_PAGE;
    const totalPages = Math.ceil(sortedRequests.length / ITEMS_PER_PAGE);

    const handleApprove = (id: string) => {
        setRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
        );
        setShowApproveConfirm(null);
    };

    const handleApproveClick = (id: string) => {
        setShowApproveConfirm(id);
    };

    const handleReject = (id: string) => {
        setRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
        );
        setShowRejectConfirm(null);
    };

    const handleRejectClick = (id: string) => {
        setShowRejectConfirm(id);
    };

    const handleBatchApprove = () => {
        setRequests((prev) =>
            prev.map((r) =>
                selectedRequests.includes(r.id)
                    ? { ...r, status: "approved" as const }
                    : r
            )
        );
        setSelectedRequests([]);
        setShowBulkApproveConfirm(false);
    };

    const handleBulkApproveClick = () => {
        setShowBulkApproveConfirm(true);
    };

    const handleSelectRequest = (id: string) => {
        setSelectedRequests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        // Simulate API call delay
        setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setIsLoadingMore(false);
        }, 800);
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, filterMethod, searchQuery, sortBy]);

    // Set default export filename when modal opens
    useEffect(() => {
        if (showExportModal && !exportFilename) {
            const today = new Date().toISOString().split("T")[0];
            setExportFilename(`payout-requests-${today}`);
        }
    }, [showExportModal, exportFilename]);

    const handleExportClick = () => {
        setShowExportModal(true);
    };

    const handleExport = () => {
        // Simulate export functionality
        const filename = exportFilename || "payout-requests";
        const extension = exportFormat === "excel" ? "xlsx" : exportFormat;

        // In a real app, this would trigger the actual export

        // Show success message (you could add a toast notification here)
        alert(`Export initiated: ${filename}.${extension}`);

        setShowExportModal(false);
        setExportFilename("");
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "approved":
                return <CheckCircle className="w-4 h-4" />;
            case "processing":
                return <Timer className="w-4 h-4" />;
            case "completed":
                return <Check className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "approved":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "processing":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "completed":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "rejected":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case "bank":
                return <Building className="w-4 h-4" />;
            case "upi":
                return <IndianRupee className="w-4 h-4" />;
            case "paypal":
                return <DollarSign className="w-4 h-4" />;
            case "crypto":
                return <Wallet className="w-4 h-4" />;
            default:
                return <Wallet className="w-4 h-4" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "text-red-500";
            case "medium":
                return "text-yellow-500";
            case "low":
                return "text-green-500";
            default:
                return "text-gray-400";
        }
    };

    return (
        <div className="min-h-screen p-4">
            <div className="w-full mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Payout Management
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                            Review and process affiliate withdrawal requests
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleExportClick}
                            className="glass border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Export</span>
                            <span className="sm:hidden">Export Data</span>
                        </Button>
                        {selectedRequests.length > 0 && (
                            <Button
                                onClick={handleBulkApproveClick}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg text-sm"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">
                                    Approve Selected ({selectedRequests.length})
                                </span>
                                <span className="sm:hidden">
                                    Approve ({selectedRequests.length})
                                </span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Pending Amount */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <span className="text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-medium">
                                    {stats.pendingCount} requests
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Pending Payouts
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{stats.totalPending.toLocaleString()}
                            </p>
                            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 rounded-full"
                                    style={{ width: "60%" }}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Processing */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
                                    <Timer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full font-medium">
                                    Processing
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                In Progress
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{stats.totalProcessing.toLocaleString()}
                            </p>
                            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 rounded-full"
                                    style={{ width: "40%" }}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Completed */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full font-medium">
                                    This Month
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Completed
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{stats.totalCompleted.toLocaleString()}
                            </p>
                            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: "80%" }}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Average */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                                    {stats.totalAffiliates} affiliates
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Average Payout
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{stats.avgPayout.toLocaleString()}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-medium">
                                    +12% from last month
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4">
                            {/* Search with Select All */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                    />
                                </div>

                                {/* Select All Options */}
                                {selectedRequests.length > 0 && (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const allRequests = sortedRequests.map((r) => r.id);
                                                setSelectedRequests(allRequests);
                                            }}
                                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm whitespace-nowrap"
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Select All ({sortedRequests.length})
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedRequests([])}
                                            className="bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm whitespace-nowrap"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Clear ({selectedRequests.length})
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                <select
                                    value={filterMethod}
                                    onChange={(e) => setFilterMethod(e.target.value)}
                                    className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                >
                                    <option value="all">All Methods</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="upi">UPI</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="crypto">Crypto</option>
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="amount">Sort by Amount</option>
                                    <option value="priority">Sort by Priority</option>
                                </select>
                            </div>

                            {/* Active Filters Count */}
                            {(filterStatus !== "all" ||
                                filterMethod !== "all" ||
                                searchQuery) && (
                                    <div className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg w-full sm:w-auto">
                                        <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                                            {
                                                [
                                                    filterStatus !== "all",
                                                    filterMethod !== "all",
                                                    searchQuery,
                                                ].filter(Boolean).length
                                            }{" "}
                                            active filter
                                            {[
                                                filterStatus !== "all",
                                                filterMethod !== "all",
                                                searchQuery,
                                            ].filter(Boolean).length !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>
                                )}
                        </div>
                    </div>
                </Card>

                {/* Requests List */}
                <div className="space-y-4">
                    {paginatedRequests.map((request) => (
                        <Card
                            key={request.id}
                            className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 group backdrop-blur-sm"
                        >
                            <div className="p-2 sm:p-3">
                                {/* Mobile Compact View */}
                                <div className="block lg:hidden">
                                    <div className="space-y-2">
                                        {/* Header Row */}
                                        <div className="flex items-center gap-3">
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={selectedRequests.includes(request.id)}
                                                onChange={() => handleSelectRequest(request.id)}
                                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-1"
                                            />

                                            {/* Avatar */}
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                                                {request.affiliateName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>

                                            {/* Name and Status */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate pr-2">
                                                        {request.affiliateName}
                                                    </h3>
                                                    <div
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                                            request.status
                                                        )} flex-shrink-0`}
                                                    >
                                                        {getStatusIcon(request.status)}
                                                        <span className="capitalize">{request.status}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {request.affiliateEmail}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Details Row */}
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    {getMethodIcon(request.method)}
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                        Payment
                                                    </span>
                                                </div>
                                                <p className="text-gray-900 dark:text-white font-medium capitalize text-xs">
                                                    {request.method}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {request.accountDetails}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                                                    Request
                                                </p>
                                                <p className="text-gray-900 dark:text-white font-medium text-xs">
                                                    {request.id}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(request.requestDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Amount and Actions Row */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Amount
                                                </p>
                                                <p className="text-lg font-bold text-emerald-500">
                                                    ₹{request.amount.toLocaleString()}
                                                </p>
                                                <span
                                                    className={`text-xs font-medium ${getPriorityColor(
                                                        request.priority
                                                    )}`}
                                                >
                                                    {request.priority}
                                                </span>
                                            </div>

                                            {/* Mobile Actions */}
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowDetails(
                                                            showDetails === request.id ? null : request.id
                                                        )
                                                    }
                                                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </Button>

                                                {request.status === "pending" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApproveClick(request.id)}
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md px-2 py-1"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRejectClick(request.id)}
                                                            className="bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-1"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </>
                                                )}

                                                {request.status === "approved" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-purple-500 hover:bg-purple-600 text-white shadow-md px-3 py-2"
                                                    >
                                                        <Timer className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                {request.status === "processing" && (
                                                    <div className="flex items-center gap-2 text-purple-500 text-sm px-3 py-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
                                                        <span className="text-xs">Processing...</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Full View */}
                                <div className="hidden lg:block">
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Left Section - Affiliate Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Checkbox */}
                                            <div className="pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRequests.includes(request.id)}
                                                    onChange={() => handleSelectRequest(request.id)}
                                                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-2"
                                                />
                                            </div>

                                            {/* Avatar */}
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                {request.affiliateName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        {request.affiliateName}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                                        {request.id}
                                                    </span>
                                                    <span
                                                        className={`text-xs font-medium ${getPriorityColor(
                                                            request.priority
                                                        )}`}
                                                    >
                                                        • {request.priority}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                    {request.affiliateEmail}
                                                </p>

                                                {/* Details Grid */}
                                                <div className="grid grid-cols-4 gap-2 text-xs">
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                                                        <p className="text-gray-500 dark:text-gray-400 mb-0.5 text-xs font-medium">
                                                            Method
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            {getMethodIcon(request.method)}
                                                            <span className="text-gray-900 dark:text-white font-medium capitalize text-xs">
                                                                {request.method}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                                                        <p className="text-gray-500 dark:text-gray-400 mb-0.5 text-xs font-medium">
                                                            Account
                                                        </p>
                                                        <p className="text-gray-900 dark:text-white font-medium text-xs truncate">
                                                            {request.accountDetails}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                                                        <p className="text-gray-500 dark:text-gray-400 mb-0.5 text-xs font-medium">
                                                            Earnings
                                                        </p>
                                                        <p className="text-gray-900 dark:text-white font-medium text-xs">
                                                            ₹{request.earnings.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                                                        <p className="text-gray-500 dark:text-gray-400 mb-0.5 text-xs font-medium">
                                                            Previous
                                                        </p>
                                                        <p className="text-gray-900 dark:text-white font-medium text-xs">
                                                            ₹{request.previousPayouts.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section - Amount & Actions */}
                                        <div className="text-right">
                                            <div className="mb-2">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Amount
                                                </p>
                                                <p className="text-xl font-bold text-emerald-500">
                                                    ₹{request.amount.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(request.requestDate).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex justify-end mb-2">
                                                <div
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                        request.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(request.status)}
                                                    <span className="capitalize">{request.status}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowDetails(
                                                            showDetails === request.id ? null : request.id
                                                        )
                                                    }
                                                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>

                                                {request.status === "pending" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApproveClick(request.id)}
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                                                        >
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRejectClick(request.id)}
                                                            className="bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}

                                                {request.status === "approved" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-purple-500 hover:bg-purple-600 text-white shadow-md"
                                                    >
                                                        <Timer className="w-4 h-4 mr-1" />
                                                        Process
                                                    </Button>
                                                )}

                                                {request.status === "processing" && (
                                                    <div className="flex items-center gap-2 text-purple-500 text-sm font-medium">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
                                                        Processing...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Details */}
                                {showDetails === request.id && (
                                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm font-medium">
                                                    Affiliate Details
                                                </p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            ID:
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white font-medium">
                                                            {request.affiliateId}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Member Since:
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white font-medium">
                                                            {new Date(request.joinDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm font-medium">
                                                    Payout Analysis
                                                </p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Payout Ratio:
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white font-medium">
                                                            {Math.round(
                                                                (request.amount / request.earnings) * 100
                                                            )}
                                                            % of earnings
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Total Lifetime:
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white font-medium">
                                                            ₹
                                                            {(
                                                                request.previousPayouts + request.amount
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm font-medium">
                                                    Risk Assessment
                                                </p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-gray-900 dark:text-white">
                                                            Account Verified
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-gray-900 dark:text-white">
                                                            Low Risk Profile
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Load More Options */}
                {hasMoreItems && paginatedRequests.length > 0 && (
                    <div className="flex flex-col items-center gap-4 py-6 sm:py-8">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Showing {paginatedRequests.length} of {sortedRequests.length}{" "}
                                requests
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Page {currentPage} of {totalPages}
                            </p>
                        </div>

                        {/* Load More Buttons with Options */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <Button
                                onClick={() => {
                                    setIsLoadingMore(true);
                                    setTimeout(() => {
                                        setCurrentPage((prev) => prev + 1);
                                        setIsLoadingMore(false);
                                    }, 800);
                                }}
                                disabled={isLoadingMore}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        <span>Load 5 More</span>
                                    </>
                                )}
                            </Button>

                            {sortedRequests.length - paginatedRequests.length >= 10 && (
                                <Button
                                    onClick={() => {
                                        setIsLoadingMore(true);
                                        setTimeout(() => {
                                            setCurrentPage((prev) => prev + 2);
                                            setIsLoadingMore(false);
                                        }, 800);
                                    }}
                                    disabled={isLoadingMore}
                                    variant="outline"
                                    className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-4 py-2 rounded-lg transition-all duration-200"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    <span>Load 10 More</span>
                                </Button>
                            )}

                            {sortedRequests.length - paginatedRequests.length >= 20 && (
                                <Button
                                    onClick={() => {
                                        setIsLoadingMore(true);
                                        setTimeout(() => {
                                            setCurrentPage((prev) => prev + 4);
                                            setIsLoadingMore(false);
                                        }, 800);
                                    }}
                                    disabled={isLoadingMore}
                                    variant="outline"
                                    className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-4 py-2 rounded-lg transition-all duration-200"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    <span>Load 20 More</span>
                                </Button>
                            )}

                            <Button
                                onClick={() => {
                                    setIsLoadingMore(true);
                                    setTimeout(() => {
                                        setCurrentPage(totalPages);
                                        setIsLoadingMore(false);
                                    }, 800);
                                }}
                                disabled={isLoadingMore}
                                variant="ghost"
                                className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <span>
                                    Load All ({sortedRequests.length - paginatedRequests.length}{" "}
                                    remaining)
                                </span>
                            </Button>
                        </div>

                        {/* Quick Stats */}
                        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                            <span>
                                {sortedRequests.length - paginatedRequests.length} more items
                                available
                            </span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {sortedRequests.length === 0 && (
                    <Card className="bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                        <div className="p-12 text-center">
                            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No payout requests found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Adjust your filters or wait for new requests to appear
                            </p>
                        </div>
                    </Card>
                )}

                {/* Reject Confirmation Modal */}
                {showRejectConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Reject Payout Request
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    Are you sure you want to reject this payout request? The
                                    affiliate will be notified of this decision.
                                </p>

                                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowRejectConfirm(null)}
                                        className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 order-2 sm:order-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(showRejectConfirm)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white order-1 sm:order-2"
                                    >
                                        Yes, Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Approve Confirmation Modal */}
                {showApproveConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Approve Payout Request
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Confirm the approval
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    Are you sure you want to approve this payout request? The
                                    affiliate will be notified and the payment will be queued for
                                    processing.
                                </p>

                                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowApproveConfirm(null)}
                                        className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 order-2 sm:order-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => handleApprove(showApproveConfirm)}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white order-1 sm:order-2"
                                    >
                                        Yes, Approve
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Approve Confirmation Modal */}
                {showBulkApproveConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Bulk Approve Requests
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Confirm bulk approval
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                                        Are you sure you want to approve{" "}
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                            {selectedRequests.length} payout requests
                                        </span>
                                        ?
                                    </p>
                                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-3">
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                            • All selected affiliates will be notified
                                            <br />
                                            • Payments will be queued for processing
                                            <br />• This action cannot be undone
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowBulkApproveConfirm(false)}
                                        className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 order-2 sm:order-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleBatchApprove}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white order-1 sm:order-2"
                                    >
                                        Yes, Approve All ({selectedRequests.length})
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Export Modal */}
                {showExportModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Export Payout Data
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Choose format and filename
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {/* File Format Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            File Format
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                {
                                                    value: "csv",
                                                    label: "CSV",
                                                    desc: "Excel compatible",
                                                },
                                                {
                                                    value: "excel",
                                                    label: "Excel",
                                                    desc: "Native .xlsx",
                                                },
                                                { value: "pdf", label: "PDF", desc: "Print friendly" },
                                            ].map((format) => (
                                                <button
                                                    key={format.value}
                                                    onClick={() => setExportFormat(format.value as any)}
                                                    className={`p-3 rounded-lg border-2 transition-all text-center ${exportFormat === format.value
                                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                                                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                                                        }`}
                                                >
                                                    <div className="font-medium text-sm">
                                                        {format.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {format.desc}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Filename Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Filename
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={exportFilename}
                                                onChange={(e) => setExportFilename(e.target.value)}
                                                placeholder="Enter filename"
                                                className="w-full px-3 py-2 pr-16 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                                                .{exportFormat === "excel" ? "xlsx" : exportFormat}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Export Info */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <FileText className="w-4 h-4" />
                                            <span>
                                                Will export {sortedRequests.length} payout requests
                                            </span>
                                        </div>
                                        {(filterStatus !== "all" ||
                                            filterMethod !== "all" ||
                                            searchQuery) && (
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                    * Filtered data will be exported
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowExportModal(false);
                                            setExportFilename("");
                                        }}
                                        className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 order-2 sm:order-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleExport}
                                        disabled={!exportFilename.trim()}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white order-1 sm:order-2"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Export File
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
