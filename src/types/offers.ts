// Offer Data Types
export interface OfferData {
    id: number;
    slug: string;
    name: string;
    merchant: {
        id: number;
        slug: string;
        name: string;
        image: string;
    };
    network_id: number | null;
    cashback_type: string;
    offer_type: string | null;
    payment_date: string | null;
    accept_ticket: boolean;
    tracking_speed: string;
    expected_confirmation_days: number;
    cashback_button_text: string;
    unique_identifier: string;
    short_description: string;
    full_description: string;
    image: string | null;
    banner_image: string | null;
    cashback_ribbon_text: string | null;
    calendar_cashback_rules_type: string;
    report_store_categoryname: string | null;
    app_tracking_enabled_android: boolean;
    app_tracking_enabled_ios: boolean;
    is_custom_override_case: boolean;
    intermediate_page_text: string;
    seo_h1_tag: string | null;
    rating_value: number | null;
    rating_count: number | null;
    seo_description: string;
    app_orders: string | null;
}

export interface CreateOfferData {
    name: string;
    offer_id?: string;
    slug: string;
    merchant: number;
    network_id?: number | null;
    cashback_type: string;
    offer_type?: string | null;
    payment_date?: string | null;
    accept_ticket?: boolean;
    tracking_speed: string;
    expected_confirmation_days: number;
    cashback_button_text: string;
    unique_identifier: string;
    short_description: string;
    full_description: string;
    image?: string | null;
    banner_image?: string | null;
    cashback_ribbon_text?: string | null;
    calendar_cashback_rules_type: string;
    report_store_categoryname?: string | null;
    app_tracking_enabled_android?: boolean;
    app_tracking_enabled_ios?: boolean;
    is_custom_override_case?: boolean;
    intermediate_page_text?: string;
    seo_h1_tag?: string | null;
    rating_value?: number | null;
    rating_count?: number | null;
    seo_description: string;
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

export interface GridProps {
    data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: [];
    };
    message: string;
    isLoading: boolean
}