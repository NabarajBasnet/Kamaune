/**
 * Production-Ready Secure API Client
 * Handles authentication, token refresh, request deduplication, caching, CSRF protection,
 * rate limiting, request signing, and comprehensive security features
 */

import SECURITY_CONFIG from "@/config/security";
import {
    RequestSecurity,
    SecurityLogger,
    SecurityPerformance,
    InputSanitizer,
} from "@/utils/security";

interface CacheEntry<T = any> {
    data: T;
    timestamp: number;
    etag?: string;
    lastModified?: string;
}

interface RequestConfig {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
    cache?: boolean;
    cacheTTL?: number; // Time to live in milliseconds
    retries?: number;
    timeout?: number;
}

interface ApiResponse<T = any> {
    data: T;
    status: number;
    headers: Headers;
    fromCache: boolean;
}

class SecureApiClient {
    private baseURL: string;
    private cache = new Map<string, CacheEntry>();
    private pendingRequests = new Map<string, Promise<any>>();
    private refreshPromise: Promise<string> | null = null;
    private maxRetries: number;
    private defaultTimeout: number;
    private defaultCacheTTL: number;
    private rateLimitIdentifier: string = "api-client";

    constructor(baseURL: string) {
        // Use security configuration
        this.baseURL = SECURITY_CONFIG.API.BASE_URL.replace(/\/$/, "");
        this.maxRetries = SECURITY_CONFIG.API.RETRY_COUNT;
        this.defaultTimeout = SECURITY_CONFIG.API.TIMEOUT;
        this.defaultCacheTTL = SECURITY_CONFIG.CACHE.TTL;

        // Validate and potentially redirect HTTP to HTTPS
        if (
            SECURITY_CONFIG.API.ENABLE_HTTPS_REDIRECT &&
            this.baseURL.startsWith("http://")
        ) {
            this.baseURL = this.baseURL.replace("http://", "https://");
            SecurityLogger.log("info", "API_CLIENT_HTTPS_REDIRECT", {
                originalUrl: baseURL,
                newUrl: this.baseURL,
            });
        }

        // Clear expired cache entries every 5 minutes
        setInterval(() => this.cleanExpiredCache(), 5 * 60 * 1000);

        SecurityLogger.log("info", "API_CLIENT_INITIALIZED", {
            baseURL: this.baseURL,
        });
    }

    /**
     * Get authentication token from localStorage securely
     */
    private getAuthToken(): string | null {
        try {
            // Try multiple possible token keys for compatibility
            const tokenKeys = ["authToken", "access_token", "accessToken", "token"];

            for (const key of tokenKeys) {
                const token = localStorage.getItem(key);
                if (token && token.length > 10) {
                    // Basic validation
                    return token;
                }
            }

            return null;
        } catch (error) {
            console.error("Error accessing localStorage for token:", error);
            return null;
        }
    }

    /**
     * Get refresh token from localStorage securely
     */
    private getRefreshToken(): string | null {
        try {
            const refreshKeys = ["refreshToken", "refresh_token", "refresh"];

            for (const key of refreshKeys) {
                const token = localStorage.getItem(key);
                if (token && token.length > 10) {
                    return token;
                }
            }

            return null;
        } catch (error) {
            console.error("Error accessing localStorage for refresh token:", error);
            return null;
        }
    }

    /**
     * Store tokens securely
     */
    private storeTokens(accessToken: string, refreshToken?: string): void {
        try {
            // Store access token in multiple keys for compatibility
            localStorage.setItem("authToken", accessToken);
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("token", accessToken);

            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("refresh_token", refreshToken);
            }
        } catch (error) {
            throw new Error("Failed to store authentication tokens");
        }
    }

    /**
     * Clear all authentication tokens
     */
    private clearTokens(): void {
        try {
            const tokenKeys = [
                "authToken",
                "access_token",
                "accessToken",
                "token",
                "refreshToken",
                "refresh_token",
                "refresh",
                "userData",
            ];

            tokenKeys.forEach((key) => {
                localStorage.removeItem(key);
            });

            // Clear cache on logout for security
            this.cache.clear();
        } catch (error) {
            console.error("Error clearing tokens:", error);
        }
    }

    /**
     * Refresh access token using refresh token
     */
    private async refreshAccessToken(): Promise<string> {
        // Prevent multiple simultaneous refresh requests
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this.performTokenRefresh();

        try {
            const newToken = await this.refreshPromise;
            return newToken;
        } finally {
            this.refreshPromise = null;
        }
    }

    private async performTokenRefresh(): Promise<string> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        try {
            const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // If refresh token is invalid, clear all tokens
                if (response.status === 401 || errorData?.code === "token_not_valid") {
                    this.clearTokens();
                    throw new Error("Session expired. Please log in again.");
                }

                throw new Error(`Token refresh failed: ${response.status}`);
            }

            const data = await response.json();
            const newAccessToken = data.access || data.access_token || data.token;
            const newRefreshToken = data.refresh || data.refresh_token;

            if (!newAccessToken) {
                throw new Error("No access token in refresh response");
            }

            // Store new tokens
            this.storeTokens(newAccessToken, newRefreshToken);

            return newAccessToken;
        } catch (error) {
            console.error("❌ Token refresh failed:", error);
            this.clearTokens();
            throw error;
        }
    }

    /**
     * Generate cache key for request
     */
    private getCacheKey(url: string, method: string, body?: any): string {
        const bodyString = body ? JSON.stringify(body) : "";
        return `${method}:${url}:${bodyString}`;
    }

    /**
     * Check if cache entry is valid
     */
    private isCacheValid(entry: CacheEntry, ttl: number): boolean {
        return Date.now() - entry.timestamp < ttl;
    }

    /**
     * Get data from cache if valid
     */
    private getFromCache<T>(cacheKey: string, ttl: number): T | null {
        const entry = this.cache.get(cacheKey);

        if (entry && this.isCacheValid(entry, ttl)) {
            // Reduce logging to prevent spam
            if (Math.random() < 0.1) {
                // Only log 10% of cache hits
            }
            return entry.data;
        }

        return null;
    }

    /**
     * Store data in cache
     */
    private setCache<T>(
        cacheKey: string,
        data: T,
        etag?: string,
        lastModified?: string
    ): void {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            etag,
            lastModified,
        });
    }

    /**
     * Clean expired cache entries
     */
    private cleanExpiredCache(): void {
        const now = Date.now();
        let cleanedCount = 0;

        for (const [key, entry] of this.cache.entries()) {
            // Remove entries older than 1 hour
            if (now - entry.timestamp > 60 * 60 * 1000) {
                this.cache.delete(key);
                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
        }
    }

    /**
     * Create request headers with authentication and security features
     */
    private async createHeaders(
        customHeaders: Record<string, string> = {}
    ): Promise<Record<string, string>> {
        // Prepare secure headers using RequestSecurity
        const secureHeaders = RequestSecurity.prepareHeaders({
            headers: customHeaders,
        });

        const token = this.getAuthToken();
        if (token) {
            secureHeaders["Authorization"] = token.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`;
        }

        // Add security headers if enabled
        if (SECURITY_CONFIG.HEADERS.ENABLED) {
            secureHeaders["X-Content-Type-Options"] =
                SECURITY_CONFIG.HEADERS.X_CONTENT_TYPE_OPTIONS;
            secureHeaders["X-XSS-Protection"] =
                SECURITY_CONFIG.HEADERS.X_XSS_PROTECTION;
            secureHeaders["Referrer-Policy"] =
                SECURITY_CONFIG.HEADERS.REFERRER_POLICY;
        }

        return secureHeaders;
    }

    /**
     * Make HTTP request with security validation, retry logic and token refresh
     */
    private async makeRequest<T>(
        url: string,
        config: RequestConfig = {},
        attempt: number = 1
    ): Promise<ApiResponse<T>> {
        const startTime = performance.now();

        // Security validation
        try {
            RequestSecurity.validateRequest(url, {
                method: config.method,
                body: config.body,
                identifier: this.rateLimitIdentifier,
            });
        } catch (error) {
            SecurityLogger.log("error", "REQUEST_SECURITY_VALIDATION_FAILED", {
                url,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
        const {
            method = "GET",
            headers: customHeaders = {},
            body,
            timeout = this.defaultTimeout,
            retries = this.maxRetries,
        } = config;

        // Sanitize request body
        const sanitizedBody = body ? InputSanitizer.sanitizeObject(body) : body;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const headers = await this.createHeaders(customHeaders);

            // Add conditional headers for cache validation
            const cacheKey = this.getCacheKey(url, method, body);
            const cacheEntry = this.cache.get(cacheKey);

            if (cacheEntry && method === "GET") {
                if (cacheEntry.etag) {
                    headers["If-None-Match"] = cacheEntry.etag;
                }
                if (cacheEntry.lastModified) {
                    headers["If-Modified-Since"] = cacheEntry.lastModified;
                }
            }

            const response = await fetch(url, {
                method,
                headers,
                body: sanitizedBody ? JSON.stringify(sanitizedBody) : undefined,
                signal: controller.signal,
            });

            console.log("Response Body:", response.body);

            // Log performance metrics
            const duration = performance.now() - startTime;
            SecurityPerformance.measureRequest(`${method}:${url}`, duration);

            clearTimeout(timeoutId);

            // Handle 304 Not Modified - return cached data
            if (response.status === 304 && cacheEntry) {
                return {
                    data: cacheEntry.data,
                    status: 200,
                    headers: response.headers,
                    fromCache: true,
                };
            }

            // Handle authentication errors
            if (response.status === 401) {
                try {
                    await this.refreshAccessToken();

                    // Retry with new token (only once to prevent infinite loops)
                    if (attempt === 1) {
                        return this.makeRequest<T>(url, config, attempt + 1);
                    }
                } catch (refreshError) {
                    throw new Error("Authentication failed. Please log in again.");
                }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    errorData.message || errorData.detail || `HTTP ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Sanitize response data
            const sanitizedData = InputSanitizer.sanitizeObject(data);

            // Cache successful GET requests
            if (method === "GET" && config.cache !== false) {
                const etag = response.headers.get("ETag");
                const lastModified = response.headers.get("Last-Modified");
                this.setCache(
                    cacheKey,
                    sanitizedData,
                    etag || undefined,
                    lastModified || undefined
                );
            }

            SecurityLogger.log("info", "API_REQUEST_SUCCESS", {
                method,
                url,
                status: response.status,
                duration: performance.now() - startTime,
            });

            return {
                data: sanitizedData,
                status: response.status,
                headers: response.headers,
                fromCache: false,
            };
        } catch (error) {
            clearTimeout(timeoutId);
            const duration = performance.now() - startTime;

            // Log error
            SecurityLogger.log("error", "API_REQUEST_ERROR", {
                method,
                url,
                error: error instanceof Error ? error.message : "Unknown error",
                attempt,
                duration,
            });

            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    throw new Error(`Request timeout after ${timeout}ms`);
                }

                // Retry on network errors (but not auth errors)
                if (attempt < retries && !error.message.includes("Authentication")) {
                    SecurityLogger.log("info", "API_REQUEST_RETRY", {
                        url,
                        attempt,
                        maxRetries: retries,
                    });
                    await new Promise((resolve) =>
                        setTimeout(resolve, Math.pow(2, attempt) * 1000)
                    ); // Exponential backoff
                    return this.makeRequest<T>(url, config, attempt + 1);
                }
            }

            throw error;
        }
    }

    /**
     * Public API methods
     */
    public async get<T>(
        endpoint: string,
        config: Omit<RequestConfig, "method" | "body"> = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = this.getCacheKey(url, "GET");
        const cacheTTL = config.cacheTTL || this.defaultCacheTTL;

        // Check cache first for GET requests
        if (config.cache !== false) {
            const cachedData = this.getFromCache<T>(cacheKey, cacheTTL);
            if (cachedData) {
                return {
                    data: cachedData,
                    status: 200,
                    headers: new Headers(),
                    fromCache: true,
                };
            }
        }

        // Prevent duplicate requests
        if (this.pendingRequests.has(cacheKey)) {
            const data = await this.pendingRequests.get(cacheKey)!;
            return {
                data,
                status: 200,
                headers: new Headers(),
                fromCache: false,
            };
        }

        const requestPromise = this.makeRequest<T>(url, {
            ...config,
            method: "GET",
        })
            .then((response) => {
                this.pendingRequests.delete(cacheKey);
                return response;
            })
            .catch((error) => {
                this.pendingRequests.delete(cacheKey);
                throw error;
            });

        this.pendingRequests.set(
            cacheKey,
            requestPromise.then((r) => r.data)
        );
        return requestPromise;
    }

    public async post<T>(
        endpoint: string,
        data?: any,
        config: Omit<RequestConfig, "method"> = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        return this.makeRequest<T>(url, {
            ...config,
            method: "POST",
            body: data,
            cache: false,
        });
    }

    public async put<T>(
        endpoint: string,
        data?: any,
        config: Omit<RequestConfig, "method"> = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        return this.makeRequest<T>(url, {
            ...config,
            method: "PUT",
            body: data,
            cache: false,
        });
    }

    public async patch<T>(
        endpoint: string,
        data?: any,
        config: Omit<RequestConfig, "method"> = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        return this.makeRequest<T>(url, {
            ...config,
            method: "PATCH",
            body: data,
            cache: false,
        });
    }

    public async delete<T>(
        endpoint: string,
        config: Omit<RequestConfig, "method" | "body"> = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        return this.makeRequest<T>(url, {
            ...config,
            method: "DELETE",
            cache: false,
        });
    }

    /**
     * Cache management methods
     */
    public clearCache(pattern?: string): void {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }

    public getCacheStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }

    /**
     * Authentication methods
     */
    public async login(email: string, password: string): Promise<any> {
        // Sanitize login inputs
        const sanitizedEmail = InputSanitizer.sanitizeObject(email);
        const sanitizedPassword = InputSanitizer.sanitizeObject(password);

        SecurityLogger.log("info", "LOGIN_ATTEMPT", { email: sanitizedEmail });

        try {
            const response = await this.post("/auth/login/", {
                email: sanitizedEmail,
                password: sanitizedPassword,
            });

            // Handle nested response structure
            const responseData = response.data.data || response.data;
            const tokens = responseData.tokens || responseData;

            const accessToken = tokens.access || tokens.access_token || tokens.token;
            const refreshToken = tokens.refresh || tokens.refresh_token;

            if (accessToken) {
                this.storeTokens(accessToken, refreshToken);

                // Store user data if available
                if (responseData.email) {
                    const userData = {
                        email: responseData.email,
                        name: responseData.name || sanitizedEmail.split("@")[0],
                        loginTime: new Date().toISOString(),
                    };
                    localStorage.setItem("userData", JSON.stringify(userData));
                }

                SecurityLogger.log("info", "LOGIN_SUCCESS", { email: sanitizedEmail });
            } else {
                SecurityLogger.log("error", "LOGIN_NO_TOKEN", {
                    email: sanitizedEmail,
                });
            }

            return response.data;
        } catch (error) {
            SecurityLogger.log("error", "LOGIN_FAILED", {
                email: sanitizedEmail,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }

    public logout(): void {
        SecurityLogger.log("info", "LOGOUT_INITIATED");
        this.clearTokens();
        this.cache.clear();
        this.pendingRequests.clear();
        SecurityLogger.log("info", "LOGOUT_COMPLETED");
    }

    public isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }
}

// Create singleton instance with secure configuration
export const apiClient = new SecureApiClient(SECURITY_CONFIG.API.BASE_URL);

// Export types for use in components
export type { ApiResponse, RequestConfig };
