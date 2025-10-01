export interface User {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Social {
    platform: string;
    url: string;
}

export interface Wallet {
    id: number;
    balance: string;
    currency: string;
}

export interface UserProfile {
    id: number;
    user: User;
    address_line_1: string;
    address_line_2: string;
    profile_picture: string | null;
    city: string;
    province: string;
    country: string;
    social: Social[];
    wallet: Wallet | null;
}

export interface ProfileApiResponse {
    data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: UserProfile[];
    };
    message: string;
}

export interface MobileSidebarProps {
    profileData: UserProfile | null;
    logout: () => void
}