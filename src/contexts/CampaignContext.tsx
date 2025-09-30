'use client';

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
export interface Campaign {
    id: string
    name: string
    type: 'product' | 'offer' | 'coupon' | 'mixed'
    description: string
    status: 'active' | 'paused' | 'completed' | 'draft'
    budget: number
    spent: number
    commission: string
    commissionType: 'percentage' | 'fixed' | 'tiered'
    startDate: string
    endDate: string
    visibility: 'public' | 'private' | 'invite-only'
    geographicTargeting: 'all-regions' | 'india' | 'specific-states'
    landingPageUrl: string
    selectedItems: CampaignItem[]
    clicks: number
    conversions: number
    revenue: number
    createdAt: string
    updatedAt: string
}

export interface CampaignItem {
    id: string
    type: 'product' | 'offer' | 'coupon'
    name: string
    category: string
    commission: string
    imageUrl?: string
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

interface CampaignContextType {
    campaigns: Campaign[]
    addCampaign: (campaign: CampaignFormData) => void
    updateCampaign: (id: string, campaign: Partial<Campaign>) => void
    deleteCampaign: (id: string) => void
    getCampaign: (id: string) => Campaign | undefined
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

const initialCampaigns: Campaign[] = [
    {
        id: '1',
        name: 'Summer Electronics Sale',
        type: 'product',
        description: 'Promote electronics products with special summer discounts',
        status: 'active',
        budget: 50000,
        spent: 15750,
        commission: '12%',
        commissionType: 'percentage',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        visibility: 'public',
        geographicTargeting: 'all-regions',
        landingPageUrl: 'https://example.com/summer-electronics',
        selectedItems: [
            {
                id: 'p1',
                type: 'product',
                name: 'Premium Wireless Headphones',
                category: 'Electronics',
                commission: '15%',
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
            },
            {
                id: 'p2',
                type: 'product',
                name: 'Samsung 4K TV 55 inch',
                category: 'Electronics',
                commission: '8%',
                imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=100&h=100&fit=crop'
            }
        ],
        clicks: 1250,
        conversions: 87,
        revenue: 125000,
        createdAt: '2024-06-01T00:00:00.000Z',
        updatedAt: '2024-06-15T12:30:00.000Z'
    },
    {
        id: '2',
        name: 'Fashion Week Exclusive',
        type: 'mixed',
        description: 'Mixed campaign featuring fashion products and exclusive coupons',
        status: 'active',
        budget: 75000,
        spent: 32100,
        commission: '18%',
        commissionType: 'percentage',
        startDate: '2024-07-01',
        endDate: '2024-07-31',
        visibility: 'invite-only',
        geographicTargeting: 'india',
        landingPageUrl: 'https://example.com/fashion-week',
        selectedItems: [
            {
                id: 'p3',
                type: 'product',
                name: 'Designer Summer Collection',
                category: 'Fashion',
                commission: '20%',
                imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop'
            },
            {
                id: 'c1',
                type: 'coupon',
                name: 'FASHION20 - 20% Off',
                category: 'Fashion',
                commission: '₹50 per use'
            }
        ],
        clicks: 890,
        conversions: 134,
        revenue: 89500,
        createdAt: '2024-07-01T00:00:00.000Z',
        updatedAt: '2024-07-15T08:45:00.000Z'
    },
    {
        id: '3',
        name: 'Health & Beauty Boost',
        type: 'offer',
        description: 'Special offers on health and beauty products',
        status: 'paused',
        budget: 25000,
        spent: 8950,
        commission: '₹100',
        commissionType: 'fixed',
        startDate: '2024-05-15',
        endDate: '2024-06-15',
        visibility: 'public',
        geographicTargeting: 'specific-states',
        landingPageUrl: 'https://example.com/health-beauty',
        selectedItems: [
            {
                id: 'p4',
                type: 'product',
                name: 'Organic Face Cream',
                category: 'Health & Beauty',
                commission: '25%',
                imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop'
            }
        ],
        clicks: 456,
        conversions: 23,
        revenue: 18750,
        createdAt: '2024-05-15T00:00:00.000Z',
        updatedAt: '2024-06-01T14:20:00.000Z'
    }
]

export function CampaignProvider({ children }: { children: ReactNode }) {
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)

    const addCampaign = (campaignData: CampaignFormData) => {
        const newCampaign: Campaign = {
            ...campaignData,
            id: crypto.randomUUID(),
            status: 'draft',
            spent: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        setCampaigns(prev => [newCampaign, ...prev])
    }

    const updateCampaign = (id: string, campaignData: Partial<Campaign>) => {
        setCampaigns(prev => prev.map(campaign =>
            campaign.id === id
                ? { ...campaign, ...campaignData, updatedAt: new Date().toISOString() }
                : campaign
        ))
    }

    const deleteCampaign = (id: string) => {
        setCampaigns(prev => prev.filter(campaign => campaign.id !== id))
    }

    const getCampaign = (id: string) => {
        return campaigns.find(campaign => campaign.id === id)
    }

    return (
        <CampaignContext.Provider value={{
            campaigns,
            addCampaign,
            updateCampaign,
            deleteCampaign,
            getCampaign
        }}>
            {children}
        </CampaignContext.Provider>
    )
}

export function useCampaigns() {
    const context = useContext(CampaignContext)
    if (context === undefined) {
        throw new Error('useCampaigns must be used within a CampaignProvider')
    }
    return context
}