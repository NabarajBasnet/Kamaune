/**
 * Security Utilities and Helpers
 * Production-ready security functions and middleware
 */

import { SECURITY_CONFIG, SecurityUtils } from "@/config/security";

// Rate limiting store
interface RateLimitEntry {
    count: number;
    windowStart: number;
    lastRequest: number;
}

class RateLimiter {
    private store = new Map<string, RateLimitEntry>();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Cleanup expired entries every 5 minutes
        if (SECURITY_CONFIG.RATE_LIMIT.ENABLED) {
            this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
        }
    }

    isAllowed(identifier: string): boolean {
        if (!SECURITY_CONFIG.RATE_LIMIT.ENABLED) {
            return true;
        }

        const now = Date.now();
        const windowMs = SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;
        const maxRequests = SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS;

        const entry = this.store.get(identifier);

        if (!entry) {
            this.store.set(identifier, {
                count: 1,
                windowStart: now,
                lastRequest: now,
            });
            return true;
        }

        // Reset window if it has expired
        if (now - entry.windowStart >= windowMs) {
            entry.count = 1;
            entry.windowStart = now;
            entry.lastRequest = now;
            return true;
        }

        // Check if limit exceeded
        if (entry.count >= maxRequests) {
            return false;
        }

        // Increment counter
        entry.count++;
        entry.lastRequest = now;
        return true;
    }

    private cleanup(): void {
        const now = Date.now();
        const windowMs = SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;

        for (const [key, entry] of this.store.entries()) {
            if (now - entry.windowStart >= windowMs) {
                this.store.delete(key);
            }
        }
    }

    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.store.clear();
    }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// CSRF Token Management
class CSRFManager {
    private token: string | null = null;
    private tokenExpiry: number = 0;

    getToken(): string | null {
        if (!SECURITY_CONFIG.CSRF.ENABLED) {
            return null;
        }

        // Generate new token if expired or doesn't exist
        if (!this.token || Date.now() > this.tokenExpiry) {
            this.generateToken();
        }

        return this.token;
    }

    private generateToken(): void {
        this.token = SecurityUtils.generateSecureToken(32);
        this.tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Store in secure cookie (if running in browser)
        if (typeof document !== "undefined") {
            const cookieOptions = SECURITY_CONFIG.CSRF.COOKIE_OPTIONS;
            const cookieValue =
                `${SECURITY_CONFIG.CSRF.COOKIE_NAME}=${this.token}; ` +
                `Max-Age=${cookieOptions.maxAge}; ` +
                `SameSite=${cookieOptions.sameSite}; ` +
                (cookieOptions.secure ? "Secure; " : "") +
                (cookieOptions.httpOnly ? "HttpOnly; " : "") +
                "Path=/";

            document.cookie = cookieValue;
        }
    }

    validateToken(token: string): boolean {
        if (!SECURITY_CONFIG.CSRF.ENABLED) {
            return true;
        }

        return token === this.token && Date.now() <= this.tokenExpiry;
    }
}

export const csrfManager = new CSRFManager();

// Request Security
export interface SecureRequestOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    skipCSRF?: boolean;
    skipRateLimit?: boolean;
    identifier?: string;
}

export class RequestSecurity {
    /**
     * Prepare secure request headers
     */
    static prepareHeaders(
        options: SecureRequestOptions = {}
    ): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        // Add CSRF token
        if (!options.skipCSRF && SECURITY_CONFIG.CSRF.ENABLED) {
            const csrfToken = csrfManager.getToken();
            if (csrfToken) {
                headers[SECURITY_CONFIG.CSRF.TOKEN_HEADER] = csrfToken;
            }
        }

        // Add security headers
        if (SECURITY_CONFIG.HEADERS.ENABLED) {
            headers["X-Requested-With"] = "XMLHttpRequest";
        }

        return headers;
    }

    /**
     * Check rate limiting
     */
    static checkRateLimit(identifier?: string): boolean {
        if (!identifier) {
            identifier = "global";
        }

        return rateLimiter.isAllowed(identifier);
    }

    /**
     * Validate request before sending
     */
    static validateRequest(
        url: string,
        options: SecureRequestOptions = {}
    ): void {
        // Validate URL
        if (!SecurityUtils.isTrustedDomain(url)) {
            throw new Error("Request to untrusted domain blocked");
        }

        // Check method
        const method = options.method?.toUpperCase() || "GET";
        if (!SECURITY_CONFIG.REQUEST.ALLOWED_METHODS.includes(method)) {
            throw new Error(`HTTP method ${method} not allowed`);
        }

        // Check body size
        if (options.body && typeof options.body === "string") {
            if (options.body.length > SECURITY_CONFIG.REQUEST.MAX_BODY_SIZE) {
                throw new Error("Request body too large");
            }
        }

        // Check rate limiting
        if (!options.skipRateLimit && !this.checkRateLimit(options.identifier)) {
            throw new Error("Rate limit exceeded");
        }
    }

    /**
     * Sign request (if enabled)
     */
    static async signRequest(
        url: string,
        method: string,
        body?: any,
        timestamp?: number
    ): Promise<string | null> {
        if (!SECURITY_CONFIG.REQUEST.ENABLE_SIGNING) {
            return null;
        }

        const ts = timestamp || Date.now();
        const bodyString = body ? JSON.stringify(body) : "";
        const message = `${method.toUpperCase()}|${url}|${bodyString}|${ts}`;

        return await SecurityUtils.hashString(message);
    }
}

// Input Sanitization
export class InputSanitizer {
    /**
     * Sanitize object recursively
     */
    static sanitizeObject(obj: any): any {
        if (obj === null || obj === undefined) {
            return obj;
        }

        if (typeof obj === "string") {
            return SecurityUtils.sanitizeString(obj);
        }

        if (typeof obj === "number" || typeof obj === "boolean") {
            return obj;
        }

        if (Array.isArray(obj)) {
            if (obj.length > SECURITY_CONFIG.VALIDATION.MAX_ARRAY_LENGTH) {
                obj = obj.slice(0, SECURITY_CONFIG.VALIDATION.MAX_ARRAY_LENGTH);
            }
            return obj.map((item) => this.sanitizeObject(item));
        }

        if (typeof obj === "object") {
            const sanitized: any = {};
            for (const [key, value] of Object.entries(obj)) {
                const sanitizedKey = SecurityUtils.sanitizeString(key);
                sanitized[sanitizedKey] = this.sanitizeObject(value);
            }
            return sanitized;
        }

        return obj;
    }

    /**
     * Validate and sanitize form data
     */
    static sanitizeFormData(formData: Record<string, any>): Record<string, any> {
        const sanitized: Record<string, any> = {};

        for (const [key, value] of Object.entries(formData)) {
            const sanitizedKey = SecurityUtils.sanitizeString(key);

            if (value instanceof File) {
                // Validate file
                if (
                    SECURITY_CONFIG.UPLOAD.ALLOWED_MIME_TYPES.includes(value.type) &&
                    value.size <= SECURITY_CONFIG.UPLOAD.MAX_FILE_SIZE
                ) {
                    sanitized[sanitizedKey] = value;
                }
            } else {
                sanitized[sanitizedKey] = this.sanitizeObject(value);
            }
        }

        return sanitized;
    }
}

// Security Event Logging
export class SecurityLogger {
    private static logs: Array<{
        timestamp: number;
        level: "info" | "warn" | "error";
        event: string;
        details?: any;
    }> = [];

    static log(
        level: "info" | "warn" | "error",
        event: string,
        details?: any
    ): void {
        if (!SECURITY_CONFIG.LOGGING.ENABLE_SECURITY_EVENTS) {
            return;
        }

        const logEntry = {
            timestamp: Date.now(),
            level,
            event,
            details,
        };

        this.logs.push(logEntry);

        // Keep only recent logs
        if (this.logs.length > SECURITY_CONFIG.LOGGING.MAX_LOG_ENTRIES) {
            this.logs = this.logs.slice(-SECURITY_CONFIG.LOGGING.MAX_LOG_ENTRIES);
        }

        // Log to console in development
        if (SECURITY_CONFIG.LOGGING.ENABLE_DEBUG) {
            const timestamp = new Date(logEntry.timestamp).toISOString();
        }
    }

    static getLogs(): typeof SecurityLogger.logs {
        return [...this.logs];
    }

    static clearLogs(): void {
        this.logs = [];
    }
}

// Performance Monitoring
export class SecurityPerformance {
    private static metrics = new Map<string, number[]>();

    static measureRequest(identifier: string, duration: number): void {
        if (!SECURITY_CONFIG.LOGGING.ENABLE_PERFORMANCE) {
            return;
        }

        if (!this.metrics.has(identifier)) {
            this.metrics.set(identifier, []);
        }

        const measurements = this.metrics.get(identifier)!;
        measurements.push(duration);

        // Keep only last 100 measurements
        if (measurements.length > 100) {
            measurements.shift();
        }
    }

    static getMetrics(): Record<string, { avg: number; count: number }> {
        const result: Record<string, { avg: number; count: number }> = {};

        for (const [identifier, measurements] of this.metrics.entries()) {
            const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
            result[identifier] = { avg, count: measurements.length };
        }

        return result;
    }
}

// Cleanup function for when the module is destroyed
export function cleanup(): void {
    rateLimiter.destroy();
    SecurityLogger.clearLogs();
}

// Export all utilities
export { SecurityUtils, SECURITY_CONFIG };
