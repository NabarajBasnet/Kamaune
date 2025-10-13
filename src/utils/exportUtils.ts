// Function to export data to CSV
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        return;
    }

    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(item =>
            headers.map(header => {
                const value = getNestedValue(item, header);
                return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            }).join(',')
        )
    ].join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Function to export data to JSON
export const exportToJSON = (data: any, filename: string) => {
    if (!data) {
        console.error('No data to export');
        return;
    }

    // Create JSON content
    const jsonContent = JSON.stringify(data, null, 2);

    // Create a blob and download link
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Helper function to get nested values
const getNestedValue = (obj: any, path: string): string => {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        if (current === null || current === undefined) {
            return '';
        }

        if (typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return '';
        }
    }

    // Convert to string and handle special cases
    if (typeof current === 'object') {
        return JSON.stringify(current);
    }

    return String(current);
};

// Function to process product data for export
export const processProductDataForExport = (products: any[]) => {
    return products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category?.category_name || '',
        sub_category: product.sub_category?.sub_category_name || '',
        brand: product.brand?.name || '',
        merchant: product.merchant?.name || '',
        price: product.price,
        discount_percentage: product.discount_percentage,
        availability_status: product.availability_status,
        is_active: product.is_active,
        is_hero_product: product.is_hero_product,
        card_type: product.card_type,
        product_label: product.product_label,
        image_url: product.image_url,
        product_button_text: product.product_button_text,
        popularity: product.popularity,
        created_at: product.product_start_datetime,
        ends_at: product.product_end_datetime
    }));
};