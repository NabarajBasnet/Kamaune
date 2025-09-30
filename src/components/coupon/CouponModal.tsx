import React, { useState, useEffect } from 'react'
import { X, Ticket, Calendar, Percent, ShoppingBag, Users, Globe, Copy } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface CouponModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (couponData: CouponFormData) => void
    coupon?: any
    mode?: 'create' | 'edit'
}

interface CouponFormData {
    title: string
    company: string
    code: string
    discount: string
    minPurchase: string
    expiryDate: string
    usesLeft: string
    status: 'Active' | 'Limited' | 'Expired' | 'Draft'
    category: string
    subcategory: string
    product: string
    description?: string
    termsAndConditions?: string
    maxDiscount?: string
    validFrom: string
    totalUses?: number
    usedCount?: number
    isPublic: boolean
    merchantImage?: string
}

export function CouponModal({ isOpen, onClose, onSubmit, coupon, mode = 'create' }: CouponModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<CouponFormData>({
        title: '',
        company: '',
        code: '',
        discount: '',
        minPurchase: '',
        expiryDate: '',
        usesLeft: 'Unlimited',
        status: 'Active',
        category: '',
        subcategory: '',
        product: '',
        description: '',
        termsAndConditions: '',
        maxDiscount: '',
        validFrom: new Date().toISOString().split('T')[0],
        totalUses: 0,
        usedCount: 0,
        isPublic: true,
        merchantImage: ''
    })

    useEffect(() => {
        if (coupon && mode === 'edit') {
            setFormData({
                title: coupon.title,
                company: coupon.company,
                code: coupon.code,
                discount: coupon.discount,
                minPurchase: coupon.minPurchase,
                expiryDate: coupon.expiryDate,
                usesLeft: coupon.usesLeft,
                status: coupon.status,
                category: coupon.category,
                subcategory: coupon.subcategory,
                product: coupon.product,
                description: coupon.description || '',
                termsAndConditions: coupon.termsAndConditions || '',
                maxDiscount: coupon.maxDiscount || '',
                validFrom: coupon.validFrom,
                totalUses: coupon.totalUses || 0,
                usedCount: coupon.usedCount || 0,
                isPublic: coupon.isPublic,
                merchantImage: coupon.merchantImage || ''
            })
        } else {
            setFormData({
                title: '',
                company: '',
                code: '',
                discount: '',
                minPurchase: '',
                expiryDate: '',
                usesLeft: 'Unlimited',
                status: 'Active',
                category: '',
                subcategory: '',
                product: '',
                description: '',
                termsAndConditions: '',
                maxDiscount: '',
                validFrom: new Date().toISOString().split('T')[0],
                totalUses: 0,
                usedCount: 0,
                isPublic: true,
                merchantImage: ''
            })
        }
        setStep(1)
    }, [coupon, mode, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        onClose()
    }

    const handleInputChange = (field: keyof CouponFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const generateCouponCode = () => {
        const prefix = formData.category.substring(0, 3).toUpperCase()
        const suffix = Math.floor(Math.random() * 100).toString().padStart(2, '0')
        const generatedCode = `${prefix}${suffix}`
        handleInputChange('code', generatedCode)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {mode === 'edit' ? 'Edit Coupon' : 'Create New Coupon'}
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
                <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((stepNumber) => (
                            <React.Fragment key={stepNumber}>
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= stepNumber
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {stepNumber}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {stepNumber === 1 && 'Category Selection'}
                                        {stepNumber === 2 && 'Coupon Details'}
                                        {stepNumber === 3 && 'Review & Publish'}
                                    </span>
                                </div>
                                {stepNumber < 3 && <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Step 1: Category Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Select Category & Product</h3>
                                <p className="text-gray-600 dark:text-gray-400">Choose the category, subcategory, and specific product for your coupon</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => {
                                            handleInputChange('category', e.target.value)
                                            handleInputChange('subcategory', '')
                                            handleInputChange('product', '')
                                        }}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value={'category'}>{'category'}</option>
                                        <option value={'category'}>{'category'}</option>
                                        <option value={"category"}>{'category'}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Subcategory *</label>
                                    <select
                                        value={formData.subcategory}
                                        onChange={(e) => {
                                            handleInputChange('subcategory', e.target.value)
                                            handleInputChange('product', '')
                                        }}
                                        disabled={!formData.category}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Select Subcategory</option>
                                        <option value={'subcategory'}>{'subcategory'}</option>
                                        <option value={'subcategory'}>{'subcategory'}</option>
                                        <option value={'subcategory'}>{'subcategory'}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Product *</label>
                                    <select
                                        value={formData.product}
                                        onChange={(e) => handleInputChange('product', e.target.value)}
                                        disabled={!formData.subcategory}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        <option value={'product'}>{'product'}</option>
                                        <option value={'product'}>{'product'}</option>
                                        <option value={'product'}>{'product'}</option>
                                    </select>
                                </div>
                            </div>

                            {formData.category && formData.subcategory && formData.product && (
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Selection Summary</h4>
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        <p><span className="text-gray-500 dark:text-gray-400">Category:</span> {formData.category}</p>
                                        <p><span className="text-gray-500 dark:text-gray-400">Subcategory:</span> {formData.subcategory}</p>
                                        <p><span className="text-gray-500 dark:text-gray-400">Product:</span> {formData.product}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Coupon Details */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Coupon Information</h3>
                                <p className="text-gray-600 dark:text-gray-400">Provide the details about your coupon</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Coupon Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="e.g., Extra 20% Off Fashion"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Company/Store *</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        placeholder="e.g., Myntra"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Coupon Code *</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                            placeholder="e.g., FASHION20"
                                            className="flex-1 bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600 font-mono uppercase"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={generateCouponCode}
                                            disabled={!formData.category}
                                            className="px-3"
                                            title="Generate Code"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Discount *</label>
                                    <select
                                        value={formData.discount}
                                        onChange={(e) => handleInputChange('discount', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    >
                                        <option value="">Select Discount</option>
                                        <option value="10% Off">10% Off</option>
                                        <option value="20% Off">20% Off</option>
                                        <option value="30% Off">30% Off</option>
                                        <option value="50% Off">50% Off</option>
                                        <option value="₹100 Off">₹100 Off</option>
                                        <option value="₹500 Off">₹500 Off</option>
                                        <option value="₹1000 Off">₹1000 Off</option>
                                        <option value="Free Shipping">Free Shipping</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Minimum Purchase *</label>
                                    <input
                                        type="text"
                                        value={formData.minPurchase}
                                        onChange={(e) => handleInputChange('minPurchase', e.target.value)}
                                        placeholder="e.g., ₹1,500"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Valid From *</label>
                                    <input
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => handleInputChange('validFrom', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Expiry Date *</label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Maximum Discount</label>
                                    <input
                                        type="text"
                                        value={formData.maxDiscount}
                                        onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                                        placeholder="e.g., ₹2,000"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Total Uses</label>
                                    <input
                                        type="number"
                                        value={formData.totalUses}
                                        onChange={(e) => handleInputChange('totalUses', parseInt(e.target.value) || 0)}
                                        placeholder="0 for unlimited"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Status *</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value as any)}
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Limited">Limited</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Expired">Expired</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Merchant Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.merchantImage}
                                        onChange={(e) => handleInputChange('merchantImage', e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                    placeholder="Describe your coupon offer..."
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Terms and Conditions</label>
                                <textarea
                                    value={formData.termsAndConditions}
                                    onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                                    rows={3}
                                    placeholder="Enter terms and conditions..."
                                    className="w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                                    className="w-4 h-4 text-purple-500 rounded"
                                />
                                <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">Make this coupon public</label>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Publish */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Review Your Coupon</h3>
                                <p className="text-gray-600 dark:text-gray-400">Please review all details before publishing</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Category Selection</h4>
                                        <div className="space-y-2 text-sm">
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Category:</span> {formData.category}</p>
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Subcategory:</span> {formData.subcategory}</p>
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Product:</span> {formData.product}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Coupon Details</h4>
                                        <div className="space-y-2 text-sm">
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Title:</span> {formData.title}</p>
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Company:</span> {formData.company}</p>
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Code:</span> <span className="font-mono">{formData.code}</span></p>
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Discount:</span> {formData.discount}</p>
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Min Purchase:</span> {formData.minPurchase}</p>
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Valid:</span> {formData.validFrom} to {formData.expiryDate}</p>
                                            <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Status:</span> {formData.status}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Coupon Preview */}
                                <div className="mt-6">
                                    <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Coupon Preview</h4>
                                    <Card className="max-w-md bg-white dark:bg-gray-800">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                    {formData.merchantImage ? (
                                                        <img src={formData.merchantImage} alt={formData.company} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${formData.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                                                    formData.status === 'Limited' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                        formData.status === 'Draft' ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300' :
                                                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                    }`}>
                                                    {formData.status}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{formData.title || 'Coupon Title'}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{formData.company || 'Company Name'}</p>
                                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-center">
                                                <p className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">{formData.code || 'COUPON_CODE'}</p>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                <p><span>Discount:</span> {formData.discount || 'N/A'}</p>
                                                <p><span>Min. Purchase:</span> {formData.minPurchase || 'N/A'}</p>
                                                <p><span>Max Discount:</span> {formData.maxDiscount || 'No limit'}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/20 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-purple-700 dark:text-purple-400 font-medium mb-1">Ready to Publish</p>
                                        <p className="text-purple-600 dark:text-purple-300">Your coupon will be available to users immediately after publishing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
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
                                    disabled={step === 1 && (!formData.category || !formData.subcategory || !formData.product)}
                                    className="bg-purple-600 text-white hover:bg-purple-700"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="bg-purple-600 text-white hover:bg-purple-700"
                                >
                                    {mode === 'edit' ? 'Update Coupon' : 'Create Coupon'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}