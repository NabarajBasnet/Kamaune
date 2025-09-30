import React, { useState, useEffect } from 'react'
import { X, Package, Gift, Ticket, Search, Megaphone } from 'lucide-react'
import { Button } from './button'
import { Card } from './card'
import { Campaign, CampaignItem } from '@/contexts/CampaignContext'

interface CampaignModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (campaignData: CampaignFormData) => void
    campaign?: Campaign | null
    mode?: 'create' | 'edit'
}

interface CampaignFormData {
    name: string
    type: 'product' | 'offer' | 'coupon' | 'mixed'
    description: string
    budget: number
    commission: string
    commissionType: 'percentage' | 'fixed' | 'tiered'
    startDate: string
    endDate: string
    visibility: 'public' | 'private' | 'invite-only'
    geographicTargeting: 'all-regions' | 'india' | 'specific-states'
    landingPageUrl: string
    selectedItems: CampaignItem[]
}

// Sample items for selection
const sampleItems: CampaignItem[] = [
    {
        id: 'p1',
        type: 'product',
        name: 'Premium Headphones',
        category: 'Electronics',
        commission: '₹150',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    },
    {
        id: 'p2',
        type: 'product',
        name: 'Summer Fashion Collection',
        category: 'Fashion',
        commission: '18%',
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop'
    },
    {
        id: 'o1',
        type: 'offer',
        name: 'Summer Fashion Sale',
        category: 'Fashion',
        commission: '50% Off'
    },
    {
        id: 'c1',
        type: 'coupon',
        name: 'FASHION20',
        category: 'Fashion',
        commission: '₹50 per use'
    }
]

export function CampaignModal({ isOpen, onClose, onSubmit, campaign, mode = 'create' }: CampaignModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<CampaignFormData>({
        name: '',
        type: 'product',
        description: '',
        budget: 0,
        commission: '',
        commissionType: 'percentage',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        visibility: 'public',
        geographicTargeting: 'all-regions',
        landingPageUrl: '',
        selectedItems: []
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        if (campaign && mode === 'edit') {
            setFormData({
                name: campaign.name,
                type: campaign.type,
                description: campaign.description,
                budget: campaign.budget,
                commission: campaign.commission,
                commissionType: campaign.commissionType,
                startDate: campaign.startDate,
                endDate: campaign.endDate,
                visibility: campaign.visibility,
                geographicTargeting: campaign.geographicTargeting,
                landingPageUrl: campaign.landingPageUrl,
                selectedItems: campaign.selectedItems
            })
        } else {
            setFormData({
                name: '',
                type: 'product',
                description: '',
                budget: 0,
                commission: '',
                commissionType: 'percentage',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                visibility: 'public',
                geographicTargeting: 'all-regions',
                landingPageUrl: '',
                selectedItems: []
            })
        }
        setStep(1)
    }, [campaign, mode, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        onClose()
    }

    const handleInputChange = (field: keyof CampaignFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const toggleItemSelection = (item: CampaignItem) => {
        setFormData(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.find(i => i.id === item.id)
                ? prev.selectedItems.filter(i => i.id !== item.id)
                : [...prev.selectedItems, item]
        }))
    }

    const filteredItems = sampleItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase()
        const matchesType = formData.type === 'mixed' || item.type === formData.type
        return matchesSearch && matchesCategory && matchesType
    })

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {mode === 'edit' ? 'Edit Campaign' : 'Create New Campaign'}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((stepNumber) => (
                            <React.Fragment key={stepNumber}>
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= stepNumber
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {stepNumber}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {stepNumber === 1 && 'Basic Info'}
                                        {stepNumber === 2 && 'Content Selection'}
                                        {stepNumber === 3 && 'Settings'}
                                    </span>
                                </div>
                                {stepNumber < 3 && <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Campaign Information</h3>
                                <p className="text-gray-600 dark:text-gray-400">Set up the basic details for your campaign</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Campaign Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Enter campaign name"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Campaign Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => handleInputChange('type', e.target.value as any)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    >
                                        <option value="product">Product Promotion</option>
                                        <option value="offer">Offer Campaign</option>
                                        <option value="coupon">Coupon Distribution</option>
                                        <option value="mixed">Mixed Campaign</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                    placeholder="Describe your campaign..."
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Start Date *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">End Date *</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Budget (₹) *</label>
                                    <input
                                        type="number"
                                        value={formData.budget}
                                        onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Commission Structure *</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.commissionType}
                                            onChange={(e) => handleInputChange('commissionType', e.target.value as any)}
                                            className="bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Rate</option>
                                            <option value="tiered">Tiered</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={formData.commission}
                                            onChange={(e) => handleInputChange('commission', e.target.value)}
                                            placeholder={formData.commissionType === 'percentage' ? '10%' : '₹100'}
                                            className="flex-1 bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Content Selection */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Select Content</h3>
                                <p className="text-gray-600 dark:text-gray-400">Choose products, offers, or coupons for your campaign</p>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex gap-4 mb-6">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search content..."
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                    <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="health & beauty">Health & Beauty</option>
                                </select>
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                {filteredItems.map((item) => {
                                    const isSelected = formData.selectedItems.find(i => i.id === item.id)
                                    return (
                                        <Card
                                            key={item.id}
                                            className={`p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'hover:shadow-md'
                                                }`}
                                            onClick={() => toggleItemSelection(item)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={!!isSelected}
                                                    onChange={() => toggleItemSelection(item)}
                                                    className="w-4 h-4 text-emerald-500 rounded"
                                                />
                                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            {item.type === 'product' && <Package className="w-6 h-6 text-gray-400" />}
                                                            {item.type === 'offer' && <Gift className="w-6 h-6 text-gray-400" />}
                                                            {item.type === 'coupon' && <Ticket className="w-6 h-6 text-gray-400" />}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {item.category} • {item.commission}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>

                            {formData.selectedItems.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                                        Selected Items ({formData.selectedItems.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.selectedItems.map((item) => (
                                            <span
                                                key={item.id}
                                                className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm"
                                            >
                                                {item.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Settings */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Campaign Settings</h3>
                                <p className="text-gray-600 dark:text-gray-400">Configure visibility and targeting options</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Visibility</label>
                                    <select
                                        value={formData.visibility}
                                        onChange={(e) => handleInputChange('visibility', e.target.value as any)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="invite-only">Invite-only</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Geographic Targeting</label>
                                    <select
                                        value={formData.geographicTargeting}
                                        onChange={(e) => handleInputChange('geographicTargeting', e.target.value as any)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    >
                                        <option value="all-regions">All Regions</option>
                                        <option value="india">India</option>
                                        <option value="specific-states">Specific States</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Landing Page URL</label>
                                <input
                                    type="url"
                                    value={formData.landingPageUrl}
                                    onChange={(e) => handleInputChange('landingPageUrl', e.target.value)}
                                    placeholder="https://example.com/campaign"
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                />
                            </div>

                            {/* Campaign Preview */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Campaign Preview</h4>
                                <Card className="max-w-md">
                                    <div className="p-6 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                            <Megaphone className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                            {formData.name || 'Your Campaign Name'}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {formData.description || 'This is how your campaign will appear to users'}
                                        </p>
                                        <div className="flex justify-center gap-4 text-sm">
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                {formData.selectedItems.length} items
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {formData.commission} commission
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Modal Footer */}
                    <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
                        <div className="flex gap-3">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    {mode === 'edit' ? 'Update Campaign' : 'Create Campaign'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}