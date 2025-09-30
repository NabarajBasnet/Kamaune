// Validation utilities for forms

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
}

export interface ValidationErrors {
    [key: string]: string[];
}

export function validateField(
    value: any,
    rules: ValidationRule,
    fieldName?: string
): string[] {
    const errors: string[] = [];

    // Required validation
    if (
        rules.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
    ) {
        errors.push("This field is required");
        return errors; // Return early for required fields
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === "string" && value.trim() === "")) {
        return errors;
    }

    // String validations
    if (typeof value === "string") {
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Must be no more than ${rules.maxLength} characters`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push("Invalid format");
        }
    }

    // Number validations
    if (typeof value === "number") {
        if (rules.min !== undefined && value < rules.min) {
            errors.push(`Must be at least ${rules.min}`);
        }

        if (rules.max !== undefined && value > rules.max) {
            errors.push(`Must be no more than ${rules.max}`);
        }
    }

    // Custom validation
    if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
            errors.push(customError);
        }
    }

    return errors;
}

export function validateForm<T extends Record<string, any>>(
    data: T,
    rules: Record<keyof T, ValidationRule>
): ValidationErrors {
    const errors: ValidationErrors = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
        const fieldErrors = validateField(data[field], fieldRules, field);
        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
        }
    }

    return errors;
}

// Common validation patterns
export const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^https?:\/\/.+/,
    imageUrl: /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?.*)?$/i,
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    phone: /^\+?[\d\s\-\(\)]+$/,
    number: /^\d+$/,
    decimal: /^\d+(\.\d+)?$/,
    percentage: /^\d+(\.\d+)?%?$/,
};

// Offer-specific validation rules
export const offerValidationRules = {
    name: {
        required: true,
        minLength: 3,
        maxLength: 100,
    },
    slug: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: patterns.slug,
        custom: (value: string) => {
            if (value.startsWith("-") || value.endsWith("-")) {
                return "Slug cannot start or end with a hyphen";
            }
            return null;
        },
    },
    short_description: {
        required: true,
        minLength: 5,
        maxLength: 200,
    },
    full_description: {
        maxLength: 1000,
    },
    cashback_type: {
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    cashback_button_text: {
        required: true,
        minLength: 2,
        maxLength: 20,
    },
    unique_identifier: {
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    tracking_speed: {
        required: true,
    },
    expected_confirmation_days: {
        required: true,
        min: 1,
        max: 365,
    },
    calendar_cashback_rules_type: {
        required: true,
    },
    seo_description: {
        maxLength: 160,
    },
    merchant: {
        required: true,
        custom: (value: any) => {
            if (!value || !value.name || !value.slug) {
                return "Merchant information is required";
            }
            if (value.name.length < 2) {
                return "Merchant name must be at least 2 characters";
            }
            if (value.slug.length < 2) {
                return "Merchant slug must be at least 2 characters";
            }
            if (value.image && !patterns.url.test(value.image)) {
                return "Merchant image must be a valid URL";
            }
            return null;
        },
    },
    network_id: {
        custom: (value: any) => {
            // Allow null, undefined, or empty values
            if (value === null || value === undefined || value === "") {
                return null;
            }
            // If a value is provided, it must be a positive integer
            if (!Number.isInteger(value) || value < 1) {
                return "Network ID must be a positive integer";
            }
            return null;
        },
    },
    rating_value: {
        custom: (value: any) => {
            // Allow null, undefined, or empty values
            if (value === null || value === undefined || value === "") {
                return null;
            }
            // If a value is provided, it must be between 0 and 5
            if (isNaN(value) || value < 0 || value > 5) {
                return "Rating must be between 0 and 5";
            }
            return null;
        },
    },
    rating_count: {
        custom: (value: any) => {
            // Allow null, undefined, or empty values
            if (value === null || value === undefined || value === "") {
                return null;
            }
            // If a value is provided, it must be a non-negative integer
            if (!Number.isInteger(value) || value < 0) {
                return "Rating count must be a non-negative integer";
            }
            return null;
        },
    },
    seo_h1_tag: {
        maxLength: 60,
    },
    report_store_categoryname: {
        maxLength: 50,
    },
    cashback_ribbon_text: {
        maxLength: 30,
    },
    intermediate_page_text: {
        maxLength: 500,
    },
    payment_date: {
        custom: (value: any) => {
            if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return "Payment date must be in YYYY-MM-DD format";
            }
            if (value && new Date(value) < new Date()) {
                return "Payment date cannot be in the past";
            }
            return null;
        },
    },
    app_orders: {
        custom: (value: any) => {
            if (value !== null && value !== undefined && value !== "") {
                const numValue = parseInt(value);
                if (isNaN(numValue) || numValue < 0) {
                    return "App orders must be a non-negative number";
                }
            }
            return null;
        },
    },
    image: {
        custom: (value: any) => {
            if (value && !patterns.imageUrl.test(value)) {
                return "Must be a valid image URL (jpg, png, gif, etc.)";
            }
            return null;
        },
    },
    banner_image: {
        custom: (value: any) => {
            if (value && !patterns.imageUrl.test(value)) {
                return "Must be a valid image URL (jpg, png, gif, etc.)";
            }
            return null;
        },
    },
};

// Helper function to get API error messages
export function getApiErrorMessage(error: any): string {
    if (typeof error === "string") {
        return error;
    }

    if (error?.response?.data) {
        const data = error.response.data;

        // Handle validation errors
        if (data.errors && typeof data.errors === "object") {
            const messages = Object.values(data.errors).flat();
            return messages.join(", ");
        }

        // Handle single error message
        if (data.message) {
            return data.message;
        }

        if (data.detail) {
            return data.detail;
        }

        if (data.error) {
            return data.error;
        }
    }

    if (error?.message) {
        return error.message;
    }

    // Network errors
    if (error?.code === "NETWORK_ERROR" || error?.name === "NetworkError") {
        return "Network error. Please check your connection and try again.";
    }

    // Timeout errors
    if (error?.code === "TIMEOUT" || error?.message?.includes("timeout")) {
        return "Request timed out. Please try again.";
    }

    // Default error message
    return "An unexpected error occurred. Please try again.";
}

// Helper function to format validation errors for display
export function formatValidationErrors(errors: ValidationErrors): string {
    const messages: string[] = [];

    for (const [field, fieldErrors] of Object.entries(errors)) {
        const fieldName = field
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        fieldErrors.forEach((error) => {
            messages.push(`${fieldName}: ${error}`);
        });
    }

    return messages.join("\n");
}
