/**
 * Security Configuration Constants
 * Centralized security settings for production-ready deployment
 */

// Environment-based configuration
const isDevelopment = true
const isProduction = true

export const SECURITY_CONFIG = {
    // API Security
    API: {
        BASE_URL: 'https://api.kamune.com',
        TIMEOUT: parseInt('30000'),
        RETRY_COUNT: (isProduction ? 2 : 3),
        ENABLE_HTTPS_REDIRECT: true,
    },

    // Authentication & Session
    AUTH: {
        SESSION_TIMEOUT: (isProduction ? 1800000 : 3600000), // 30min prod, 1hr dev
        TOKEN_REFRESH_THRESHOLD: (isProduction ? 180000 : 300000), // 3min prod, 5min dev
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
        ENABLE_2FA: false, // Future implementation
    },

    // CSRF Protection
    CSRF: {
        ENABLED: 'false',
        TOKEN_HEADER: 'X-CSRF-Token',
        COOKIE_NAME: 'csrf_token_client',
        COOKIE_OPTIONS: {
            httpOnly: false, // Must be false for client-side CSRF token access
            secure: isProduction,
            sameSite: 'strict' as const,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    },

    // Rate Limiting
    RATE_LIMIT: {
        ENABLED: 'true',
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: isProduction ? 100 : 1000, // Per window
        SKIP_SUCCESSFUL_REQUESTS: false,
        SKIP_FAILED_REQUESTS: false,
    },

    // Caching
    CACHE: {
        TTL: (isProduction ? 600000 : 300000), // 10min prod, 5min dev
        MAX_ENTRIES: 100,
        ENABLE_DEDUPLICATION: 'false',
    },

    // Request Security
    REQUEST: {
        ENABLE_SIGNING: 'true',
        MAX_BODY_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        ENABLE_COMPRESSION: true,
    },

    // Content Security Policy
    CSP: {
        ENABLED: 'true',
        DIRECTIVES: {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            'font-src': ["'self'", 'https://fonts.gstatic.com'],
            'img-src': ["'self'", 'data:', 'https:', 'blob:'],
            'connect-src': ["'self'", 'https://api.kamune.com'],
            'media-src': ["'self'"],
            'object-src': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"],
        },
    },

    // Security Headers
    HEADERS: {
        ENABLED: 'false',
        X_FRAME_OPTIONS: 'DENY',
        X_CONTENT_TYPE_OPTIONS: 'nosniff',
        X_XSS_PROTECTION: '1; mode=block',
        REFERRER_POLICY: 'strict-origin-when-cross-origin',
        STRICT_TRANSPORT_SECURITY: isProduction ? 'max-age=31536000; includeSubDomains' : undefined,
    },

    // Logging & Monitoring
    LOGGING: {
        ENABLE_DEBUG: isDevelopment,
        ENABLE_SECURITY_EVENTS: true,
        ENABLE_PERFORMANCE: 'true',
        MAX_LOG_ENTRIES: 1000,
    },

    // Input Validation
    VALIDATION: {
        MAX_STRING_LENGTH: 10000,
        MAX_ARRAY_LENGTH: 1000,
        SANITIZE_HTML: true,
        ALLOW_UNSAFE_PROTOCOLS: false,
        TRUSTED_DOMAINS: [
            'kamune.com',
            '*.kamune.com',
            'localhost',
            '127.0.0.1',
            // Note: API base URL domain is automatically trusted via SecurityUtils.isTrustedDomain()
        ],
    },

    // File Upload (if applicable)
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_MIME_TYPES: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'text/csv',
            'application/json',
        ],
        SCAN_FOR_MALWARE: isProduction,
    },
} as const

// Environment validation
export function validateEnvironment() {
    const requiredVars = [
        'VITE_API_BASE_URL',
    ]

    const missing = requiredVars.filter(varName => varName)


    // Validate API URL format
    const apiUrl = SECURITY_CONFIG.API.BASE_URL
    if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        throw new Error('VITE_API_BASE_URL must be a valid HTTP/HTTPS URL')
    }

    // Warn about insecure configurations in production
    if (isProduction) {
        if (apiUrl.startsWith('http://')) {
            console.warn('⚠️ WARNING: Using HTTP in production. Consider switching to HTTPS.')
        }

        if (SECURITY_CONFIG.LOGGING.ENABLE_DEBUG) {
            console.warn('⚠️ WARNING: Debug logging is enabled in production.')
        }
    }
}

// Security utility functions
export const SecurityUtils = {
    /**
     * Check if URL is from a trusted domain
     */
    isTrustedDomain(url: string): boolean {
        try {
            const urlObj = new URL(url)
            const domain = urlObj.hostname
            const fullHost = urlObj.host // includes port

            // Always trust the current API base URL domain
            const apiBaseUrl = SECURITY_CONFIG.API.BASE_URL
            if (apiBaseUrl) {
                try {
                    const apiUrlObj = new URL(apiBaseUrl)
                    if (domain === apiUrlObj.hostname || fullHost === apiUrlObj.host) {
                        return true
                    }
                } catch {
                    // Ignore API URL parsing errors
                }
            }

            return SECURITY_CONFIG.VALIDATION.TRUSTED_DOMAINS.some(trusted => {
                if (trusted.startsWith('*.')) {
                    const baseDomain = trusted.slice(2)
                    return domain === baseDomain || domain.endsWith('.' + baseDomain)
                }
                // Support both hostname and host:port format
                return domain === trusted || fullHost === trusted
            })
        } catch {
            return false
        }
    },

    /**
     * Sanitize URL to prevent XSS
     */
    sanitizeUrl(url: string): string {
        try {
            const urlObj = new URL(url)

            // Block javascript: and data: protocols unless explicitly allowed
            if (!SECURITY_CONFIG.VALIDATION.ALLOW_UNSAFE_PROTOCOLS) {
                if (urlObj.protocol === 'javascript:' || urlObj.protocol === 'data:') {
                    return '#'
                }
            }

            return urlObj.toString()
        } catch {
            return '#'
        }
    },

    /**
     * Generate secure random string
     */
    generateSecureToken(length: number = 32): string {
        const array = new Uint8Array(length)
        crypto.getRandomValues(array)
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    },

    /**
     * Hash string for comparison
     */
    async hashString(input: string): Promise<string> {
        const encoder = new TextEncoder()
        const data = encoder.encode(input)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    },

    /**
     * Validate and sanitize string input
     */
    sanitizeString(input: unknown): string {
        if (typeof input !== 'string') {
            return ''
        }

        let sanitized = input.trim()

        // Limit length
        if (sanitized.length > SECURITY_CONFIG.VALIDATION.MAX_STRING_LENGTH) {
            sanitized = sanitized.substring(0, SECURITY_CONFIG.VALIDATION.MAX_STRING_LENGTH)
        }

        // Basic XSS protection
        if (SECURITY_CONFIG.VALIDATION.SANITIZE_HTML) {
            sanitized = sanitized
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;')
        }

        return sanitized
    },
}

// Initialize environment validation
if (typeof window !== 'undefined') {
    try {
        validateEnvironment()
    } catch (error) {
        console.error('Environment validation failed:', error)
        if (isProduction) {
            throw error
        }
    }
}

export default SECURITY_CONFIG