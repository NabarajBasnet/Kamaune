'use client';

import { useState } from 'react'
import {
    Ticket,
    Search,
    Plus,
    Edit,
    Trash2,
    Copy,
    CheckCircle,
    AlertCircle,
    Pause,
    XCircle,
    Clock,
    TrendingUp,
    Users,
    Percent,
    BarChart3,
    ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CouponModal } from './CouponModal';
import { DeleteModal } from '@/components/ui/DeleteModal'

// Define TypeScript interfaces
interface Coupon {
    id: string;
    title: string;
    code: string;
    discount: string;
    minPurchase: string;
    expiryDate: string;
    status: 'Active' | 'Limited' | 'Expired' | 'Draft';
    category: string;
    company: string;
    merchantImage?: string;
    usesLeft: number;
    usedCount?: number;
    totalUses?: number;
}

const statusOptions = [
    'All Status',
    'Active',
    'Limited',
    'Expired',
    'Draft'
]

const categoryOptions = [
    'All Categories',
    'Fashion',
    'Electronics',
    'Beauty',
    'Health'
]

// Mock coupons data
const mockCoupons: Coupon[] = [
    {
        id: '1',
        title: 'Summer Sale Discount',
        code: 'SUMMER25',
        discount: '25% off',
        minPurchase: '$50',
        expiryDate: '2024-12-31',
        status: 'Active',
        category: 'Fashion',
        company: 'Fashion Store',
        usesLeft: 100,
        usedCount: 45,
        totalUses: 100
    },
    {
        id: '2',
        title: 'Electronics Special',
        code: 'TECH15',
        discount: '15% off',
        minPurchase: '$100',
        expiryDate: '2024-10-15',
        status: 'Limited',
        category: 'Electronics',
        company: 'Tech World',
        merchantImage: '/tech-store.jpg',
        usesLeft: 25,
        usedCount: 75,
        totalUses: 100
    },
    {
        id: '3',
        title: 'Beauty Bundle',
        code: 'BEAUTY30',
        discount: '30% off',
        minPurchase: '$75',
        expiryDate: '2024-08-20',
        status: 'Active',
        category: 'Beauty',
        company: 'Beauty Cosmetics',
        usesLeft: 50,
        usedCount: 20,
        totalUses: 70
    },
    {
        id: '4',
        title: 'Health & Wellness',
        code: 'HEALTH20',
        discount: '20% off',
        minPurchase: '$40',
        expiryDate: '2024-06-30',
        status: 'Expired',
        category: 'Health',
        company: 'Wellness Center',
        usesLeft: 0,
        usedCount: 60,
        totalUses: 60
    },
    {
        id: '5',
        title: 'Winter Collection',
        code: 'WINTER50',
        discount: '50% off',
        minPurchase: '$200',
        expiryDate: '2024-12-15',
        status: 'Draft',
        category: 'Fashion',
        company: 'Winter Fashion',
        usesLeft: 200,
        usedCount: 0,
        totalUses: 200
    },
    {
        id: '6',
        title: 'Gaming Accessories',
        code: 'GAME10',
        discount: '10% off',
        minPurchase: '$30',
        expiryDate: '2024-11-10',
        status: 'Active',
        category: 'Electronics',
        company: 'Game Zone',
        usesLeft: 150,
        usedCount: 50,
        totalUses: 200
    }
];

// Mock categories for stats
const categories = {
    Fashion: 'Fashion',
    Electronics: 'Electronics',
    Beauty: 'Beauty',
    Health: 'Health'
};

export function Coupons() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('All Status')
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [showCouponModal, setShowCouponModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
    const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)

    // Filter coupons based on search, status, and category
    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.company.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = selectedStatus === 'All Status' || coupon.status === selectedStatus
        const matchesCategory = selectedCategory === 'All Categories' || coupon.category === selectedCategory

        return matchesSearch && matchesStatus && matchesCategory
    })

    const handleCreateCoupon = () => {
        setModalMode('create')
        setEditingCoupon(null)
        setShowCouponModal(true)
    }

    const handleEditCoupon = (coupon: Coupon) => {
        setModalMode('edit')
        setEditingCoupon(coupon)
        setShowCouponModal(true)
    }

    const handleDeleteCoupon = (coupon: Coupon) => {
        setDeletingCoupon(coupon)
        setShowDeleteModal(true)
    }

    const handleCouponSubmit = (couponData: any) => {
        if (modalMode === 'edit' && editingCoupon) {
            updateCoupon(editingCoupon.id, couponData)
        } else {
            addCoupon(couponData)
        }
        setShowCouponModal(false)
    }

    const addCoupon = (couponData: any) => {
        const newCoupon: Coupon = {
            id: Date.now().toString(),
            ...couponData,
            usesLeft: couponData.totalUses || 100,
            usedCount: 0
        }
        setCoupons(prev => [newCoupon, ...prev])
    }

    const updateCoupon = (id: string, updates: Partial<Coupon>) => {
        setCoupons(prev => prev.map(coupon =>
            coupon.id === id ? { ...coupon, ...updates } : coupon
        ))
    }

    const deleteCoupon = (id: string) => {
        setCoupons(prev => prev.filter(coupon => coupon.id !== id))
    }

    const confirmDelete = () => {
        if (deletingCoupon) {
            deleteCoupon(deletingCoupon.id)
            setDeletingCoupon(null)
            setShowDeleteModal(false)
        }
    }

    const toggleCouponStatus = (coupon: Coupon) => {
        const newStatus = coupon.status === 'Active' ? 'Draft' : 'Active'
        updateCoupon(coupon.id, { status: newStatus })
    }

    const copyCouponCode = (code: string) => {
        navigator.clipboard.writeText(code)
        // You can add a toast notification here
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
            case 'Limited':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
            case 'Draft':
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
            case 'Expired':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Active':
                return <CheckCircle className="w-4 h-4" />
            case 'Limited':
                return <AlertCircle className="w-4 h-4" />
            case 'Draft':
                return <Pause className="w-4 h-4" />
            case 'Expired':
                return <XCircle className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    const isExpiringSoon = (expiryDate: string) => {
        const today = new Date()
        const expiry = new Date(expiryDate)
        const diffTime = expiry.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 1 && diffDays >= 0
    }

    // Calculate stats
    const totalCoupons = coupons.length
    const activeCoupons = coupons.filter(c => c.status === 'Active').length
    const expiringToday = coupons.filter(c => isExpiringSoon(c.expiryDate)).length
    const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)

    const mostUsedCategory = Object.keys(categories).reduce((max, category) => {
        const categoryUses = coupons
            .filter(c => c.category === category)
            .reduce((sum, c) => sum + (c.usedCount || 0), 0)
        const maxUses = coupons
            .filter(c => c.category === max)
            .reduce((sum, c) => sum + (c.usedCount || 0), 0)
        return categoryUses > maxUses ? category : max
    }, 'Fashion')

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Coupons</h3>
                        <Ticket className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{totalCoupons}</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Available codes</p>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Coupons</h3>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{activeCoupons}</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">Currently valid</p>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiring Today</h3>
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{expiringToday}</p>
                    <p className="text-sm text-red-700 dark:text-red-400">Within 24 hours</p>
                </Card>

                <Card className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Used</h3>
                        <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{mostUsedCategory}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">{totalUses} total uses</p>
                </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Usage Rate</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {totalCoupons > 0 ? Math.round((totalUses / totalCoupons) * 100) / 100 : 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Merchants</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {new Set(coupons.map(c => c.company)).size}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Percent className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {activeCoupons > 0 ? Math.round((activeCoupons / totalCoupons) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Coupon Management</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={handleCreateCoupon}
                        className="bg-purple-600 text-white hover:bg-purple-700 lg:hidden"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Coupon
                    </Button>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                        {categoryOptions.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-gray-800 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        />
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Create Coupon Button for Desktop */}
            <div className="hidden lg:flex justify-end">
                <Button
                    onClick={handleCreateCoupon}
                    className="bg-purple-600 text-white hover:bg-purple-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Coupon
                </Button>
            </div>

            {/* Coupons Grid */}
            {filteredCoupons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCoupons.map((coupon) => (
                        <Card key={coupon.id} className="glass rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                        {coupon.merchantImage ? (
                                            <img
                                                src={coupon.merchantImage}
                                                alt={coupon.company}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none'
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(coupon.status)}`}>
                                        {getStatusIcon(coupon.status)}
                                        {coupon.status}
                                    </span>
                                </div>

                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{coupon.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{coupon.company}</p>

                                {/* Coupon Code */}
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-center">
                                    <p className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">{coupon.code}</p>
                                </div>

                                {/* Coupon Details */}
                                <div className="space-y-2 text-sm mb-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="text-gray-500 dark:text-gray-400">Discount:</span> {coupon.discount}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="text-gray-500 dark:text-gray-400">Min. Purchase:</span> {coupon.minPurchase}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="text-gray-500 dark:text-gray-400">Expires:</span> {new Date(coupon.expiryDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="text-gray-500 dark:text-gray-400">Uses Left:</span> {coupon.usesLeft}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="text-gray-500 dark:text-gray-400">Category:</span> {coupon.category}
                                    </p>
                                    {coupon.usedCount !== undefined && coupon.totalUses && (
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="text-gray-500 dark:text-gray-400">Usage:</span> {coupon.usedCount}/{coupon.totalUses}
                                        </p>
                                    )}
                                </div>

                                {/* Progress Bar for Limited Coupons */}
                                {coupon.status === 'Limited' && coupon.totalUses && coupon.totalUses > 0 && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>Usage Progress</span>
                                            <span>{coupon.totalUses > 0 ? Math.round(((coupon.usedCount || 0) / coupon.totalUses) * 100) : 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${coupon.totalUses > 0 ? Math.min(((coupon.usedCount || 0) / coupon.totalUses) * 100, 100) : 0}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Expiry Warning */}
                                {isExpiringSoon(coupon.expiryDate) && coupon.status === 'Active' && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            <p className="text-sm text-red-700 dark:text-red-300">Expires soon!</p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 mb-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditCoupon(coupon)}
                                        className="flex-1"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteCoupon(coupon)}
                                        className="p-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white"
                                        title="Delete Coupon"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Secondary Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyCouponCode(coupon.code)}
                                        className="flex-1"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Code
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleCouponStatus(coupon)}
                                        className="p-2"
                                        title={coupon.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    >
                                        {coupon.status === 'Active' ? (
                                            <Pause className="w-4 h-4" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No coupons found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                    <Button
                        onClick={handleCreateCoupon}
                        className="bg-purple-600 text-white hover:bg-purple-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Coupon
                    </Button>
                </div>
            )}

            {/* Coupon Modal */}
            <CouponModal
                isOpen={showCouponModal}
                onClose={() => setShowCouponModal(false)}
                onSubmit={handleCouponSubmit}
                coupon={editingCoupon}
                mode={modalMode}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Coupon"
                description="Are you sure you want to delete this coupon? This action cannot be undone."
                itemName={deletingCoupon?.title}
            />
        </div>
    )
}