import { useState, useEffect } from 'react'
import {
    X,
    Save,
    TrendingUp,
    User,
    DollarSign,
    Globe,
    Smartphone,
    Calendar,
    ExternalLink,
    Hash,
    Mail,
    Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ConversionModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (conversion: Omit<ConversionData, 'id'>) => void
    onUpdate?: (id: string, updates: Partial<ConversionData>) => void
    conversion?: ConversionData
    mode: 'add' | 'edit'
}

export function ConversionModal({
    isOpen,
    onClose,
    onSave,
    onUpdate,
    conversion,
    mode
}: ConversionModalProps) {
    const [formData, setFormData] = useState<Omit<ConversionData, 'id'>>({
        timestamp: new Date().toISOString(),
        platformName: '',
        productName: '',
        customerEmail: '',
        customerName: '',
        conversionValue: 0,
        currency: 'USD',
        status: 'pending',
        referralId: '',
        commissionAmount: 0,
        conversionType: 'purchase',
        deviceType: 'desktop',
        country: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: ''
    })

    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 3

    useEffect(() => {
        if (mode === 'edit' && conversion) {
            setFormData({
                timestamp: conversion.timestamp,
                platformName: conversion.platformName,
                productName: conversion.productName,
                customerEmail: conversion.customerEmail,
                customerName: conversion.customerName,
                conversionValue: conversion.conversionValue,
                currency: conversion.currency,
                status: conversion.status,
                referralId: conversion.referralId,
                commissionAmount: conversion.commissionAmount,
                conversionType: conversion.conversionType,
                deviceType: conversion.deviceType,
                country: conversion.country,
                utmSource: conversion.utmSource || '',
                utmMedium: conversion.utmMedium || '',
                utmCampaign: conversion.utmCampaign || ''
            })
        }
    }, [mode, conversion])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (mode === 'edit' && conversion && onUpdate) {
            onUpdate(conversion.id, formData)
        } else {
            onSave(formData)
        }
        onClose()
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            timestamp: new Date().toISOString(),
            platformName: '',
            productName: '',
            customerEmail: '',
            customerName: '',
            conversionValue: 0,
            currency: 'USD',
            status: 'pending',
            referralId: '',
            commissionAmount: 0,
            conversionType: 'purchase',
            deviceType: 'desktop',
            country: '',
            utmSource: '',
            utmMedium: '',
            utmCampaign: ''
        })
        setCurrentStep(1)
    }

    const handleClose = () => {
        onClose()
        resetForm()
    }

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const updateFormData = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const platforms = [
        'Amazon', 'eBay', 'Shopify Store', 'WooCommerce', 'Magento', 'Etsy',
        'BigCommerce', 'PrestaShop', 'OpenCart', 'Other'
    ]

    const countries = [
        'US', 'CA', 'UK', 'DE', 'FR', 'IT', 'ES', 'AU', 'SG', 'JP', 'IN', 'NL', 'Other'
    ]

    const currencies = [
        'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'SGD', 'NPR'
    ]

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {mode === 'edit' ? 'Edit Conversion' : 'Add New Conversion'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Step {currentStep} of {totalSteps}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Conversion Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Conversion Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Platform *
                                        </label>
                                        <select
                                            value={formData.platformName}
                                            onChange={(e) => updateFormData('platformName', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            required
                                        >
                                            <option value="">Select Platform</option>
                                            {platforms.map(platform => (
                                                <option key={platform} value={platform}>{platform}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.productName}
                                            onChange={(e) => updateFormData('productName', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Conversion Type *
                                        </label>
                                        <select
                                            value={formData.conversionType}
                                            onChange={(e) => updateFormData('conversionType', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            required
                                        >
                                            <option value="purchase">Purchase</option>
                                            <option value="signup">Sign Up</option>
                                            <option value="subscription">Subscription</option>
                                            <option value="lead">Lead</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Status *
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => updateFormData('status', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            required
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Referral ID *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.referralId}
                                            onChange={(e) => updateFormData('referralId', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="Enter referral ID"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Device Type *
                                        </label>
                                        <select
                                            value={formData.deviceType}
                                            onChange={(e) => updateFormData('deviceType', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            required
                                        >
                                            <option value="desktop">Desktop</option>
                                            <option value="mobile">Mobile</option>
                                            <option value="tablet">Tablet</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Customer & Financial Info */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Customer & Financial Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Customer Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => updateFormData('customerName', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="Enter customer name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Customer Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={(e) => updateFormData('customerEmail', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="Enter customer email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Conversion Value *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.conversionValue}
                                            onChange={(e) => updateFormData('conversionValue', parseFloat(e.target.value) || 0)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Currency *
                                        </label>
                                        <select
                                            value={formData.currency}
                                            onChange={(e) => updateFormData('currency', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            required
                                        >
                                            {currencies.map(currency => (
                                                <option key={currency} value={currency}>{currency}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Commission Amount *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.commissionAmount}
                                            onChange={(e) => updateFormData('commissionAmount', parseFloat(e.target.value) || 0)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Country *
                                        </label>
                                        <select
                                            value={formData.country}
                                            onChange={(e) => updateFormData('country', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: UTM & Tracking Info */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <ExternalLink className="w-5 h-5" />
                                    UTM & Tracking Parameters
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            UTM Source
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.utmSource}
                                            onChange={(e) => updateFormData('utmSource', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="e.g., google, facebook, email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            UTM Medium
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.utmMedium}
                                            onChange={(e) => updateFormData('utmMedium', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="e.g., cpc, social, newsletter"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            UTM Campaign
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.utmCampaign}
                                            onChange={(e) => updateFormData('utmCampaign', e.target.value)}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                            placeholder="e.g., summer_sale, electronics, fitness"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Conversion Timestamp
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.timestamp.slice(0, 16)}
                                            onChange={(e) => updateFormData('timestamp', new Date(e.target.value).toISOString())}
                                            className="w-full bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                            <div>
                                {currentStep > 1 && (
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        Previous
                                    </Button>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {currentStep < totalSteps ? (
                                    <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                                        <Save className="w-4 h-4 mr-2" />
                                        {mode === 'edit' ? 'Update Conversion' : 'Create Conversion'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    )
}