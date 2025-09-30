import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface Merchant {
    id?: number
    slug: string
    publisher: number
    name: string
    cashback_type?: string | null
    image?: string
    terms_and_conditions: string
    final_terms_condition?: string | null
    is_coupon: boolean
    cashback_payment_type?: string | null
    cashback_details?: string | null
    report_storename?: string | null
    app_tracking_enabled_android: boolean
    app_tracking_enabled_ios: boolean
    is_custom_override_case: boolean
    intermediate_page_text?: string | null
    seo_h1_tag?: string | null
    seo_description?: string | null
    app_orders?: string | null
    status: 'active' | 'pending' | 'suspended'
    created_at?: string
    updated_at?: string
}

export interface MerchantStats {
    totalRevenue: number
    totalOrders: number
    conversionRate: number
    activeCampaigns: number
    activeOffers: number
    activeCoupons: number
}

interface MerchantContextType {
    merchants: Merchant[]
    userMerchant: Merchant | null
    merchantStats: MerchantStats | null
    isLoading: boolean
    hasValidMerchant: boolean
    createMerchant: (merchant: Omit<Merchant, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>
    updateMerchant: (id: number, updates: Partial<Merchant>) => Promise<boolean>
    deleteMerchant: (id: number) => Promise<boolean>
    getMerchantBySlug: (slug: string) => Merchant | undefined
    validateMerchantAccess: () => boolean
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined)

// Sample merchant data based on the API response
const sampleMerchants: Merchant[] = [
    {
        id: 1,
        slug: "mr_grey",
        publisher: 9,
        name: "Mr.Grey",
        cashback_type: null,
        image: `${''}/media/photos/merchants/%7Bslug%7D/mr_grey.png`,
        terms_and_conditions: "Standard terms and conditions for Mr.Grey merchant account.",
        final_terms_condition: "",
        is_coupon: false,
        cashback_payment_type: null,
        cashback_details: "",
        report_storename: null,
        app_tracking_enabled_android: false,
        app_tracking_enabled_ios: false,
        is_custom_override_case: false,
        intermediate_page_text: "",
        seo_h1_tag: null,
        seo_description: "",
        app_orders: null,
        status: 'active',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
    },
    {
        id: 2,
        slug: "buddha",
        publisher: 8,
        name: "Buddha Air",
        cashback_type: "Cashback",
        image: `${'/'}/media/photos/merchants/%7Bslug%7D/pngwing.com_5.png`,
        terms_and_conditions: "Terms and conditions for Buddha Air affiliate program.",
        final_terms_condition: "",
        is_coupon: true,
        cashback_payment_type: null,
        cashback_details: "",
        report_storename: null,
        app_tracking_enabled_android: false,
        app_tracking_enabled_ios: false,
        is_custom_override_case: false,
        intermediate_page_text: "",
        seo_h1_tag: null,
        seo_description: "",
        app_orders: null,
        status: 'active',
        created_at: '2024-01-15T09:45:00Z',
        updated_at: '2024-01-15T09:45:00Z'
    },
    {
        id: 3,
        slug: "daraz_nepal",
        publisher: 7,
        name: "Daraz Nepal",
        cashback_type: "Cashback",
        image: `${'SECURITY_CONFIG.API.BASE_URL'}/media/photos/merchants/%7Bslug%7D/Daraz_8PYPYDJ.png`,
        terms_and_conditions: "Daraz Nepal affiliate terms and conditions apply.",
        final_terms_condition: "",
        is_coupon: true,
        cashback_payment_type: null,
        cashback_details: "",
        report_storename: null,
        app_tracking_enabled_android: false,
        app_tracking_enabled_ios: false,
        is_custom_override_case: false,
        intermediate_page_text: "",
        seo_h1_tag: null,
        seo_description: "",
        app_orders: null,
        status: 'active',
        created_at: '2024-01-15T08:20:00Z',
        updated_at: '2024-01-15T08:20:00Z'
    }
]

export function MerchantProvider({ children }: { children: ReactNode }) {
    const [merchants, setMerchants] = useState<Merchant[]>(sampleMerchants)
    const [isLoading, setIsLoading] = useState(false)

    // Simulate user having the first merchant
    const userMerchant = merchants[0] || null
    const hasValidMerchant = userMerchant !== null && userMerchant.status === 'active'

    // Sample merchant stats
    const merchantStats: MerchantStats = {
        totalRevenue: 15420.50,
        totalOrders: 234,
        conversionRate: 3.2,
        activeCampaigns: 5,
        activeOffers: 12,
        activeCoupons: 8
    }

    const createMerchant = async (merchantData: Omit<Merchant, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Check if slug already exists
            if (merchants.some(m => m.slug === merchantData.slug)) {
                throw new Error('Merchant slug already exists')
            }

            const newMerchant: Merchant = {
                ...merchantData,
                id: Date.now(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            setMerchants(prev => [newMerchant, ...prev])
            return true
        } catch (error) {
            console.error('Error creating merchant:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const updateMerchant = async (id: number, updates: Partial<Merchant>): Promise<boolean> => {
        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            setMerchants(prev =>
                prev.map(merchant =>
                    merchant.id === id
                        ? { ...merchant, ...updates, updated_at: new Date().toISOString() }
                        : merchant
                )
            )
            return true
        } catch (error) {
            console.error('Error updating merchant:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const deleteMerchant = async (id: number): Promise<boolean> => {
        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setMerchants(prev => prev.filter(merchant => merchant.id !== id))
            return true
        } catch (error) {
            console.error('Error deleting merchant:', error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const getMerchantBySlug = (slug: string): Merchant | undefined => {
        return merchants.find(merchant => merchant.slug === slug)
    }

    const validateMerchantAccess = (): boolean => {
        return hasValidMerchant
    }

    return (
        <MerchantContext.Provider value={{
            merchants,
            userMerchant,
            merchantStats,
            isLoading,
            hasValidMerchant,
            createMerchant,
            updateMerchant,
            deleteMerchant,
            getMerchantBySlug,
            validateMerchantAccess
        }}>
            {children}
        </MerchantContext.Provider>
    )
}

export function useMerchant() {
    const context = useContext(MerchantContext)
    if (context === undefined) {
        throw new Error('useMerchant must be used within a MerchantProvider')
    }
    return context
}