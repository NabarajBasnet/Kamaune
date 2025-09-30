// Slug generation utilities

/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @param options - Configuration options
 * @returns A URL-friendly slug
 */
export function slugify(text: string, options: {
    maxLength?: number
    separator?: string
    lowercase?: boolean
    strict?: boolean
} = {}): string {
    const {
        maxLength = 50,
        separator = '-',
        lowercase = true,
        strict = true
    } = options

    if (!text) return ''

    let slug = text.trim()

    // Convert to lowercase if specified
    if (lowercase) {
        slug = slug.toLowerCase()
    }

    // Replace spaces and special characters
    slug = slug
        .replace(/\s+/g, separator) // Replace spaces with separator
        .replace(/[^\w\-]+/g, separator) // Replace non-word chars with separator
        .replace(new RegExp(`\\${separator}+`, 'g'), separator) // Replace multiple separators with single
        .replace(new RegExp(`^\\${separator}+`), '') // Remove leading separators
        .replace(new RegExp(`\\${separator}+$`), '') // Remove trailing separators

    // Strict mode: only allow alphanumeric and separators
    if (strict) {
        slug = slug.replace(new RegExp(`[^a-z0-9\\${separator}]`, 'g'), '')
    }

    // Truncate to max length
    if (maxLength && slug.length > maxLength) {
        slug = slug.substring(0, maxLength)
        // Remove trailing separator if truncation created one
        slug = slug.replace(new RegExp(`\\${separator}+$`), '')
    }

    return slug
}

/**
 * Generate a unique slug by adding a suffix if needed
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @param maxAttempts - Maximum attempts to find a unique slug
 * @returns A unique slug
 */
export function generateUniqueSlug(
    baseSlug: string,
    existingSlugs: string[],
    maxAttempts = 100
): string {
    let slug = baseSlug
    let attempt = 1

    while (existingSlugs.includes(slug) && attempt <= maxAttempts) {
        slug = `${baseSlug}-${attempt}`
        attempt++
    }

    if (attempt > maxAttempts) {
        // Fallback: use timestamp
        slug = `${baseSlug}-${Date.now()}`
    }

    return slug
}

/**
 * Auto-generate slug from offer name with context-aware suggestions
 * @param name - The offer name
 * @param merchantName - The merchant name for context
 * @param existingSlugs - Array of existing slugs to avoid duplicates
 * @returns Generated slug
 */
export function generateOfferSlug(
    name: string,
    existingSlugs: string[] = []
): string {
    if (!name) return ''

    // Clean and prepare the name
    let cleanName = name.trim()

    // Remove common offer words that don't add value to slug
    const commonWords = [
        'offer', 'offers', 'deal', 'deals', 'sale', 'sales', 'discount', 'discounts',
        'promotion', 'promo', 'special', 'limited', 'time', 'only', 'get', 'buy',
        'now', 'today', 'new', 'latest', 'best', 'great', 'amazing', 'awesome'
    ]

    const words = cleanName.toLowerCase().split(/\s+/)
    const filteredWords = words.filter(word =>
        !commonWords.includes(word) && word.length > 1
    )

    // If we filtered out too many words, use original
    const finalWords = filteredWords.length >= 2 ? filteredWords : words

    // Create base slug from meaningful words
    let baseSlug = finalWords.slice(0, 4).join('-') // Limit to 4 words max
    baseSlug = slugify(baseSlug, { maxLength: 40 })

    // Ensure minimum length
    if (baseSlug.length < 5) {
        baseSlug = slugify(name, { maxLength: 30 })
    }

    // Make it unique
    return generateUniqueSlug(baseSlug, existingSlugs)
}

/**
 * Validate slug format
 * @param slug - The slug to validate
 * @returns Validation result
 */
export function validateSlug(slug: string): {
    isValid: boolean
    errors: string[]
} {
    const errors: string[] = []

    if (!slug) {
        errors.push('Slug is required')
        return { isValid: false, errors }
    }

    if (slug.length < 3) {
        errors.push('Slug must be at least 3 characters long')
    }

    if (slug.length > 50) {
        errors.push('Slug must be no more than 50 characters long')
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
        errors.push('Slug can only contain lowercase letters, numbers, and hyphens')
    }

    if (slug.startsWith('-') || slug.endsWith('-')) {
        errors.push('Slug cannot start or end with a hyphen')
    }

    if (slug.includes('--')) {
        errors.push('Slug cannot contain consecutive hyphens')
    }

    // Reserved slugs that should not be used
    const reservedSlugs = [
        'admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'root', 'test',
        'staging', 'dev', 'development', 'prod', 'production', 'app',
        'create', 'edit', 'delete', 'new', 'update', 'list', 'view'
    ]

    if (reservedSlugs.includes(slug)) {
        errors.push('This slug is reserved and cannot be used')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Suggest alternative slugs if the preferred one is taken
 * @param preferredSlug - The preferred slug
 * @param existingSlugs - Array of existing slugs
 * @param count - Number of suggestions to generate
 * @returns Array of suggested slugs
 */
export function suggestAlternativeSlugs(
    preferredSlug: string,
    existingSlugs: string[],
    count = 5
): string[] {
    const suggestions: string[] = []

    if (!existingSlugs.includes(preferredSlug)) {
        return [preferredSlug]
    }

    // Strategy 1: Add numbers
    for (let i = 1; i <= count; i++) {
        const suggestion = `${preferredSlug}-${i}`
        if (!existingSlugs.includes(suggestion)) {
            suggestions.push(suggestion)
        }
    }

    // Strategy 2: Add descriptive suffixes
    const suffixes = ['new', 'latest', 'special', 'exclusive', 'premium', 'plus', 'pro']
    for (const suffix of suffixes) {
        const suggestion = `${preferredSlug}-${suffix}`
        if (!existingSlugs.includes(suggestion) && suggestions.length < count) {
            suggestions.push(suggestion)
        }
    }

    // Strategy 3: Abbreviate and add numbers
    if (preferredSlug.length > 10) {
        const abbreviated = preferredSlug.substring(0, 8)
        for (let i = 1; i <= 3; i++) {
            const suggestion = `${abbreviated}-${i}`
            if (!existingSlugs.includes(suggestion) && suggestions.length < count) {
                suggestions.push(suggestion)
            }
        }
    }

    return suggestions.slice(0, count)
}