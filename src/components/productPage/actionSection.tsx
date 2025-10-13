'use client';

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { RefreshCcw, Box, Plus, ChevronDown } from "lucide-react";
import { CiExport, CiImport } from "react-icons/ci";
import { exportToCSV, exportToJSON, processProductDataForExport } from "@/utils/exportUtils";
import ImportDialog from "./importDialog";

interface ProductActionSectionProps {
    products: any[];
    filters: {
        search: string;
        category: string;
        subCategory: string;
        brand: string;
        status: string;
        merchant: string;
    };
    onRefresh?: () => void;
    onResetFilters?: () => void;
}

function ProductActionSection({ products, filters, onRefresh, onResetFilters }: ProductActionSectionProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'csv' | 'json' | null>(null);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setIsExportMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Function to handle export
    const handleExport = (format: 'csv' | 'json') => {
        setIsExporting(true);
        setExportFormat(format);

        try {
            // Process the data for export
            const processedData = processProductDataForExport(products);

            const timestamp = new Date().toISOString().slice(0, 10);
            const filterParts = [];

            if (filters.search) filterParts.push(`search_${filters.search}`);
            if (filters.category) filterParts.push(`cat_${filters.category}`);
            if (filters.subCategory) filterParts.push(`subcat_${filters.subCategory}`);
            if (filters.brand) filterParts.push(`brand_${filters.brand}`);
            if (filters.status) filterParts.push(`status_${filters.status}`);
            if (filters.merchant) filterParts.push(`merchant_${filters.merchant}`);

            const filterString = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';
            const filename = `products${filterString}_${timestamp}`;

            // Export based on selected format
            if (format === 'csv') {
                exportToCSV(processedData, filename);
            } else if (format === 'json') {
                exportToJSON(processedData, filename);
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setTimeout(() => {
                setIsExporting(false);
                setExportFormat(null);
            }, 1000);
        }
    };

    // Function to handle import completion
    const handleImportComplete = (data: any[]) => {
        if (onRefresh) {
            onRefresh();
        }
    };
    return (
        <>
            <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                {/* Left side actions */}
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <Button
                        variant="outline"
                        className="flex cursor-pointer items-center gap-2 py-6 px-6 text-base font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
                        onClick={onRefresh}
                    >
                        <RefreshCcw className="h-5 w-5" />
                        <span>Refresh</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="flex cursor-pointer items-center gap-2 py-6 px-6 text-base font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 hover:border-purple-400 dark:hover:border-purple-500 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg"
                        onClick={onResetFilters}
                    >
                        <Box className="h-5 w-5" />
                        <span>Reset Filters</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="flex cursor-pointer items-center gap-2 py-6 px-6 text-base font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 hover:border-green-400 dark:hover:border-green-500 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg"
                        onClick={() => setIsImportDialogOpen(true)}
                    >
                        <CiImport className="h-5 w-5" />
                        <span>Import</span>
                    </Button>

                    <div className="relative" ref={exportMenuRef}>
                        <Button
                            variant="outline"
                            className="flex cursor-pointer items-center gap-2 py-6 px-6 text-base font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 hover:border-green-400 dark:hover:border-green-500 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                            disabled={isExporting || products.length === 0}
                        >
                            <CiExport className="h-5 w-5" />
                            <span>Export</span>
                            <ChevronDown className="h-5 w-5" />
                        </Button>

                        {isExportMenuOpen && products.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-sm shadow-2xl z-10 min-w-[200px] overflow-hidden">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start cursor-pointer text-left py-5.5 px-0 text-base font-medium hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors duration-200"
                                    onClick={() => {
                                        handleExport('csv');
                                        setIsExportMenuOpen(false);
                                    }}
                                    disabled={isExporting}
                                >
                                    <FileText className="h-5 w-5 mr-2 text-green-500" />
                                    Export as CSV
                                </Button>
                                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start cursor-pointer text-left py-5.5 px-0 text-base font-medium hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors duration-200"
                                    onClick={() => {
                                        handleExport('json');
                                        setIsExportMenuOpen(false);
                                    }}
                                    disabled={isExporting}
                                >
                                    <FileJson className="h-5 w-5 mr-2 text-green-500" />
                                    Export as JSON
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <Button
                    onClick={() => router.push('/dashboard/products/add')}
                    className="flex items-center cursor-pointer gap-2 py-6 px-8 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-sm w-full lg:w-auto"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create Product</span>
                </Button>
            </div>

            {/* Import Dialog */}
            <ImportDialog
                isOpen={isImportDialogOpen}
                onClose={() => setIsImportDialogOpen(false)}
                onImportComplete={handleImportComplete}
            />
        </>
    );
}

import { FileText, FileJson } from "lucide-react";
import { useRouter } from "next/navigation";

export default ProductActionSection;