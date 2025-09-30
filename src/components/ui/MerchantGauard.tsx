import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Store, AlertCircle, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useMerchant } from '@/contexts/MerchantContext'
import { Settings } from 'lucide-react'

interface MerchantGuardProps {
    children: ReactNode
    feature: 'campaigns' | 'offers' | 'coupons'
    requiredFeatures?: string[]
}

export function MerchantGuard({ children, feature, requiredFeatures = [] }: MerchantGuardProps) {
    const { userMerchant, hasValidMerchant } = useMerchant()
    const router = useRouter()

    // Check if user has a valid merchant
    if (!hasValidMerchant) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">{feature}</h1>
                </div>

                <Card className="glass p-6 sm:p-8 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Merchant Profile Required
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        You need to create and activate a merchant profile before you can manage {feature}.
                        This ensures all your marketing activities are properly tracked and compliant.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Button
                            onClick={() => router.push('/profile')}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        >
                            <Store className="w-4 h-4 mr-2" />
                            Create Merchant Profile
                        </Button>

                        <Button variant="outline" onClick={() => router.push('/')} className="w-full sm:w-auto">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Button>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                            Why do I need a merchant profile?
                        </h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-400 text-left space-y-1">
                            <li>• Track your marketing campaigns and performance</li>
                            <li>• Ensure compliance with affiliate marketing regulations</li>
                            <li>• Access advanced features like coupons and cashback</li>
                            <li>• Build trust with your audience through verified profiles</li>
                        </ul>
                    </div>
                </Card>
            </div>
        )
    }

    // Check if merchant account is pending approval
    if (userMerchant?.status === 'pending') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">{feature}</h1>
                </div>

                <Card className="glass p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Merchant Approval Pending
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Your merchant profile "{userMerchant.name}" is currently under review.
                        You'll be able to manage {feature} once your account is approved.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => router.push('/profile')}
                            variant="outline"
                        >
                            <Store className="w-4 h-4 mr-2" />
                            View Profile
                        </Button>

                        <Button variant="outline" onClick={() => router.push('/')}>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Button>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            <strong>Approval typically takes 1-2 business days.</strong><br />
                            We'll notify you via email once your merchant profile is approved.
                        </p>
                    </div>
                </Card>
            </div>
        )
    }

    // Check if merchant account is suspended
    if (userMerchant?.status === 'suspended') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">{feature}</h1>
                </div>

                <Card className="glass p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Account Suspended
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Your merchant account has been suspended. Please contact support to resolve any issues
                        and restore access to {feature} management.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            Contact Support
                        </Button>

                        <Button variant="outline" onClick={() => router.push('/')}>
                            Go to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // Check for specific feature requirements
    if (requiredFeatures.length > 0) {
        const missingFeatures = requiredFeatures.filter(featureReq => {
            switch (featureReq) {
                case 'coupons':
                    return !userMerchant?.is_coupon
                case 'cashback':
                    return !userMerchant?.cashback_type
                case 'android_tracking':
                    return !userMerchant?.app_tracking_enabled_android
                case 'ios_tracking':
                    return !userMerchant?.app_tracking_enabled_ios
                default:
                    return false
            }
        })

        if (missingFeatures.length > 0) {
            return (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">{feature}</h1>
                    </div>

                    <Card className="glass p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Feature Not Enabled
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                            Your merchant profile needs additional features enabled to access {feature}:
                        </p>

                        <div className="mb-6">
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {missingFeatures.map(feature => (
                                    <li key={feature} className="flex items-center justify-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                        <span>{feature.replace('_', ' ').toUpperCase()} required</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            onClick={() => router.push('/profile')}
                            className="bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Update Merchant Settings
                        </Button>
                    </Card>
                </div>
            )
        }
    }

    // All checks passed, render the children
    return <>{children}</>
}