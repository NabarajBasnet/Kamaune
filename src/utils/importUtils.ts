// Function to parse CSV data
export const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));

    // Parse the remaining lines
    return lines.slice(1).map(line => {
        const values: string[] = [];
        let inQuotes = false;
        let currentValue = '';

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    currentValue += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of value
                values.push(currentValue.trim().replace(/^"|"$/g, ''));
                currentValue = '';
            } else {
                currentValue += char;
            }
        }

        // Add the last value
        values.push(currentValue.trim().replace(/^"|"$/g, ''));

        // Create object with headers as keys
        const obj: any = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });

        return obj;
    });
};

// Function to parse JSON data
export const parseJSON = (jsonText: string): any[] => {
    try {
        const data = JSON.parse(jsonText);
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error('Invalid JSON format:', error);
        return [];
    }
};

export const processImportedProductData = (data: any[]): any[] => {
    return data.map((item, index) => {
        return {
            id: item.id || null,
            name: item.name || '',
            slug: item.slug || '',
            category: item.category ? {
                category_name: item.category,
                id: null,
                slug: '',
                description: '',
                cat_image: null
            } : null,
            sub_category: item.sub_category ? {
                id: null,
                sub_category_name: item.sub_category,
                slug: '',
                description: '',
                cat_image: null,
                products_count: 0
            } : null,
            brand: item.brand ? {
                id: null,
                name: item.brand,
                slug: '',
                image: null,
                description: '',
                products_count: 0
            } : null,
            merchant: item.merchant ? {
                id: null,
                slug: '',
                name: item.merchant,
                image: '',
                cashback_type: null,
                cashback_ribbon_text: ''
            } : null,
            price: parseFloat(item.price) || 0,
            discount_percentage: parseFloat(item.discount_percentage) || 0,
            availability_status: item.availability_status || 'Available',
            is_active: item.is_active === 'true' || item.is_active === true,
            is_hero_product: item.is_hero_product === 'true' || item.is_hero_product === true,
            card_type: item.card_type === 'true' || item.card_type === true,
            product_label: item.product_label || '',
            image_url: item.image_url || '',
            product_button_text: item.product_button_text || 'Buy Now',
            popularity: parseInt(item.popularity) || 0,
            product_start_datetime: item.created_at || new Date().toISOString(),
            product_end_datetime: item.ends_at || new Date().toISOString(),
            is_compared: false,
            category_price_starting_from: item.price || '0.00',
            category_earn_text: '0%',
            category_detail: item.product_label || '',
            cashback_url: null,
            image_urls: [],
            product_gallery: [],
            features: {
                brand: item.brand || '',
                merchant: item.merchant || '',
                category: item.category || '',
                sub_category: item.sub_category || ''
            }
        };
    });
};

// Function to read file content
export const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            if (event.target?.result) {
                resolve(event.target.result as string);
            } else {
                reject(new Error('Failed to read file'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
    });
};