export interface Merchant {
    id: number;
    image: string;
    name: string;
    slug: string;
    cashback_type?: string
}

export interface Category {
    id: number;
    category_name: string;
    slug: string;
    description: string;
    cat_image: string | null;
}

export interface SubCategory {
    id: number;
    sub_category_name: string;
    slug: string;
    description: string;
    cat_image: string | null;
}

export interface Features {
    brand: string;
    merchant: string;
}

export interface Product {
    id: number;
    slug: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    image_urls: string[];
    is_compared: boolean;
    is_hero_product: boolean;
    popularity: number | null;
    product_button_text: string;
    product_label: string;
    product_start_datetime: string;
    product_end_datetime: string;
    product_gallery: string[];
    category_price_starting_from: string;
    category_earn_text: string;
    category_detail: string;
    brand: string;
    image: string | null;
    card_type: boolean;
    cashback_url: string | null;
    category: Category;
    sub_category: SubCategory;
    merchant: Merchant;
    features: Features;
}

export interface ProductsResponse {
    data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: Product[];
    };
    message: string;
}