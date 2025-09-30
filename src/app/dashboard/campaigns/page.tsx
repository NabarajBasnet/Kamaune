'use client'

import { useState, useEffect } from 'react'
import {
    Megaphone,
    Search,
    Plus,
    Edit,
    Trash2,
    Play,
    Pause,
    BarChart3,
    Calendar,
    DollarSign,
    Target,
    Users,
    TrendingUp,
    Eye,
    MousePointer,
    ShoppingCart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CampaignModal } from '@/components/ui/CampaignModal'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { MerchantGuard } from '@/components/ui/MerchantGauard'
import { Campaign } from '../../../contexts/CampaignContext'
import { useCampaigns } from '../../../contexts/CampaignContext'
import {
    DashboardStatsSkeleton,
    CampaignOverviewSkeleton
} from '@/components/ui/skeletons/DashboardSkeletons'
import { TableSkeleton, Skeleton } from '@/components/ui/skeletons'

const statusOptions = [
    'All Status',
    'Active',
    'Paused',
    'Completed',
    'Draft'
] as const

const typeOptions = [
    'All Types',
    'Product',
    'Offer',
    'Coupon',
    'Mixed'
] as const

type StatusOption = typeof statusOptions[number]
type TypeOption = typeof typeOptions[number]

const Campaigns = () => {
    const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useCampaigns()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStatus, setSelectedStatus] = useState<StatusOption>('All Status')
    const [selectedType, setSelectedType] = useState<TypeOption>('All Types')
    const [showCampaignModal, setShowCampaignModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
    const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [isLoading, setIsLoading] = useState(true)

    // Simulate loading for demo purposes
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1200)

        return () => clearTimeout(timer)
    }, [])

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = selectedStatus === 'All Status' || campaign.status === selectedStatus.toLowerCase()
        const matchesType = selectedType === 'All Types' || campaign.type === selectedType.toLowerCase()

        return matchesSearch && matchesStatus && matchesType
    })

    const handleCreateCampaign = () => {
        setModalMode('create')
        setEditingCampaign(null)
        setShowCampaignModal(true)
    }

    const handleEditCampaign = (campaign: Campaign) => {
        setModalMode('edit')
        setEditingCampaign(campaign)
        setShowCampaignModal(true)
    }

    const handleDeleteCampaign = (campaign: Campaign) => {
        setDeletingCampaign(campaign)
        setShowDeleteModal(true)
    }

    const handleCampaignSubmit = (campaignData: any) => {
        if (modalMode === 'edit' && editingCampaign) {
            updateCampaign(editingCampaign.id, campaignData)
        } else {
            addCampaign(campaignData)
        }
    }

    const confirmDelete = () => {
        if (deletingCampaign) {
            deleteCampaign(deletingCampaign.id)
            setDeletingCampaign(null)
            setShowDeleteModal(false)
        }
    }

    const toggleCampaignStatus = (campaign: Campaign) => {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active'
        updateCampaign(campaign.id, { status: newStatus })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
            case 'paused':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
            case 'completed':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            case 'draft':
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'product':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
            case 'offer':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
            case 'coupon':
                return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
            case 'mixed':
                return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
        }
    }

    // Calculate stats
    const totalCampaigns = campaigns.length
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0)

    // Show skeleton loading while data is loading
    if (isLoading) {
        return (
            <MerchantGuard feature="campaigns">
                <div className="space-y-6">
                    {/* Header skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>

                    {/* Stats skeleton */}
                    <DashboardStatsSkeleton />

                    {/* Campaign overview skeleton */}
                    <CampaignOverviewSkeleton />

                    {/* Table skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <TableSkeleton rows={6} columns={6} />
                    </div>
                </div>
            </MerchantGuard>
        )
    }

    return (
        <MerchantGuard feature="campaigns">
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <Card className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Campaigns</h3>
                            <Megaphone className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{totalCampaigns}</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">+12% from last month</p>
                    </Card>

                    <Card className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Campaigns</h3>
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-emerald-600 dark:bg-emerald-400"></div>
                            </div>
                        </div>
                        <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{activeCampaigns}</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">Currently running</p>
                    </Card>

                    <Card className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Budget</h3>
                            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">₹{totalBudget.toLocaleString()}</p>
                        <p className="text-sm text-blue-700 dark:text-blue-400">₹{totalSpent.toLocaleString()} spent</p>
                    </Card>

                    <Card className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance</h3>
                            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{totalConversions}</p>
                        <p className="text-sm text-purple-700 dark:text-purple-400">conversions</p>
                    </Card>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="glass rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Clicks</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{totalClicks.toLocaleString()}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="glass rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <MousePointer className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Click Rate</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="glass rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Campaign Management</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={handleCreateCampaign}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 lg:hidden"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Campaign
                        </Button>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as TypeOption)}
                            className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                            {typeOptions.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as StatusOption)}
                            className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white dark:bg-gray-800 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Create Campaign Button for Desktop */}
                <div className="hidden lg:flex justify-end">
                    <Button
                        onClick={handleCreateCampaign}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                    </Button>
                </div>

                {/* Campaigns Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <Card key={campaign.id} className="glass rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(campaign.type)}`}>
                                                {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">{campaign.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {campaign.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Campaign Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{campaign.budget.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">₹{campaign.spent.toLocaleString()} spent</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Performance</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{campaign.conversions} conversions</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{campaign.clicks} clicks</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        <span>Budget Usage</span>
                                        <span>{campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${campaign.budget > 0 ? Math.min((campaign.spent / campaign.budget) * 100, 100) : 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Campaign Dates */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <span>-</span>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Selected Items */}
                                {campaign.selectedItems.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            {campaign.selectedItems.length} item{campaign.selectedItems.length !== 1 ? 's' : ''} selected
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {campaign.selectedItems.slice(0, 3).map((item) => (
                                                <span
                                                    key={item.id}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                                                >
                                                    {item.name}
                                                </span>
                                            ))}
                                            {campaign.selectedItems.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                                    +{campaign.selectedItems.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleCampaignStatus(campaign)}
                                        className="flex-1"
                                    >
                                        {campaign.status === 'active' ? (
                                            <>
                                                <Pause className="w-4 h-4 mr-2" />
                                                Pause
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Activate
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditCampaign(campaign)}
                                        className="p-2"
                                        title="Edit Campaign"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteCampaign(campaign)}
                                        className="p-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white"
                                        title="Delete Campaign"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredCampaigns.length === 0 && (
                    <div className="text-center py-12">
                        <Megaphone className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No campaigns found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                        <Button
                            onClick={handleCreateCampaign}
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Campaign
                        </Button>
                    </div>
                )}

                {/* Campaign Modal */}
                <CampaignModal
                    isOpen={showCampaignModal}
                    onClose={() => setShowCampaignModal(false)}
                    onSubmit={handleCampaignSubmit}
                    campaign={editingCampaign}
                    mode={modalMode}
                />

                {/* Delete Confirmation Modal */}
                <DeleteModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Campaign"
                    description="Are you sure you want to delete this campaign? This action cannot be undone."
                    itemName={deletingCampaign?.name}
                />
            </div>
        </MerchantGuard>
    )
}

export default Campaigns;
