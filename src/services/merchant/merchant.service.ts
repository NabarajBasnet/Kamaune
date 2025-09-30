// API service for merchants operations
import { apiClient } from "@/utils/apiClient";
import { getApiErrorMessage } from "@/utils/validation";

// Merchant Data Types
export interface MerchantData {
    id: number;
    slug: string;
    publisher: number;
    name: string;
    cashback_type: string | null;
    image: string | null;
    terms_and_conditions: string;
    final_terms_condition: string | null;
    is_coupon: boolean;
    cashback_payment_type: string | null;
    cashback_details: string | null;
    report_storename: string | null;
    app_tracking_enabled_android: boolean;
    app_tracking_enabled_ios: boolean;
    is_custom_override_case: boolean;
    intermediate_page_text: string | null;
    seo_h1_tag: string | null;
    seo_description: string | null;
    app_orders: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CreateMerchantData {
    slug: string;
    name: string;
    publisher: number;
    cashback_type?: string | null;
    image?: string | null;
    terms_and_conditions: string;
    final_terms_condition?: string | null;
    is_coupon?: boolean;
    cashback_payment_type?: string | null;
    cashback_details?: string | null;
    report_storename?: string | null;
    app_tracking_enabled_android?: boolean;
    app_tracking_enabled_ios?: boolean;
    is_custom_override_case?: boolean;
    intermediate_page_text?: string | null;
    seo_h1_tag?: string | null;
    seo_description?: string | null;
    app_orders?: string | null;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
}

export interface ApiListResponse<T> {
    data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: T[];
    };
    message: string;
}

// Query Keys for TanStack Query
export const merchantKeys = {
    all: ["merchants"] as const,
    lists: () => [...merchantKeys.all, "list"] as const,
    list: (filters: Record<string, any>) =>
        [...merchantKeys.lists(), { filters }] as const,
    details: () => [...merchantKeys.all, "detail"] as const,
    detail: (id: number) => [...merchantKeys.details(), id] as const,
    byPublisher: (publisherId: number) =>
        [...merchantKeys.all, "publisher", publisherId] as const,
    search: (query: string) => [...merchantKeys.all, "search", query] as const,
};

// Merchants API Functions
export const merchantService = {
    // Get all merchants with optional filtering
    async getMerchants(params?: Record<string, any>): Promise<MerchantData[]> {
        try {
            const queryParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const endpoint = `/store/merchants/${queryParams.toString() ? `?${queryParams.toString()}` : ""
                }`;
            const response = await apiClient.get<ApiListResponse<MerchantData>>(
                endpoint
            );

            return response.data.data.results;
        } catch (error) {
            console.error("Error fetching merchants:", error);
            const message = getApiErrorMessage(error);
            throw new Error(message);
        }
    },

    // Get single merchant by ID
    async getMerchant(id: number): Promise<MerchantData> {
        try {
            const response = await apiClient.get<ApiResponse<MerchantData>>(
                `/store/merchants/${id}/`
            );
            return response.data.data;
        } catch (error) {
            console.error("Error fetching merchant:", error);
            const message = getApiErrorMessage(error);
            throw new Error(message);
        }
    },

    // Get merchants by publisher
    async getMerchantsByPublisher(publisherId: number): Promise<MerchantData[]> {
        try {
            const response = await apiClient.get<ApiListResponse<MerchantData>>(
                `/store/merchants/?publisher=${publisherId}`
            );
            return response.data.data.results;
        } catch (error) {
            console.error("Error fetching publisher merchants:", error);
            const message = getApiErrorMessage(error);
            throw new Error(message);
        }
    },

    // Search merchants by name
    async searchMerchants(query: string, limit = 10): Promise<MerchantData[]> {
        try {
            if (!query.trim()) return [];

            const response = await apiClient.get<ApiListResponse<MerchantData>>(
                `/store/merchants/?search=${encodeURIComponent(
                    query.trim()
                )}&limit=${limit}`
            );
            return response.data.data.results;
        } catch (error) {
            console.error("Error searching merchants:", error);
            const message = getApiErrorMessage(error);
            throw new Error(message);
        }
    },

    // Create new merchant
    async createMerchant(data: CreateMerchantData): Promise<MerchantData> {
        try {
            // Validate required fields before sending
            if (!data.name || !data.slug || !data.publisher) {
                throw new Error(
                    "Missing required fields: name, slug, and publisher are required."
                );
            }

            const response = await apiClient.post<ApiResponse<MerchantData>>(
                "/store/merchants/",
                data
            );
            return response.data.data;
        } catch (error) {
            console.error("Error creating merchant:", error);
            const message = getApiErrorMessage(error);
            throw new Error(message);
        }
    },

    // Update existing merchant
    async updateMerchant(
        id: number,
        data: Partial<CreateMerchantData>
    ): Promise<MerchantData> {
        try {
            if (!id || id <= 0) {
                throw new Error("Invalid merchant ID provided.");
            }

            const response = await apiClient.put<ApiResponse<MerchantData>>(
                `/store/merchants/${id}/`,
                data
            );
            return response.data.data;
        } catch (error) {
            console.error("Error updating merchant:", error);
            const message = getApiErrorMessage(error);
            throw new Error(message);
        }
    },

    // Delete merchant
    async deleteMerchant(id: number): Promise<void> {
        try {
            if (!id || id <= 0) {
                throw new Error("Invalid merchant ID provided.");
            }

            await apiClient.delete(`/store/merchants/${id}/`);
        } catch (error) {
            console.error("Error deleting merchant:", error);
            const message = getApiErrorMessage(error);
            throw new Error(message);
        }
    },
};

// React Query hooks for merchants
export const useMerchants = () => {
    return {
        // Query keys
        keys: merchantKeys,

        // Service methods
        service: merchantService,

        // Common query options
        queryOptions: {
            staleTime: 0, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: true,
        },
    };
};
