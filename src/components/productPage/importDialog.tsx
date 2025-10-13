import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, FileJson, X } from "lucide-react";
import { parseCSV, parseJSON, processImportedProductData, readFileContent } from "@/utils/importUtils";
import { exportToCSV, exportToJSON, processProductDataForExport } from "@/utils/exportUtils";

interface ImportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImportComplete: (data: any[]) => void;
}

function ImportDialog({ isOpen, onClose, onImportComplete }: ImportDialogProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileImport(files[0]);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileImport(file);
        }
    };

    const handleFileImport = async (file: File) => {
        if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
            alert('Unsupported file format. Please use CSV or JSON files.');
            return;
        }

        setIsImporting(true);

        try {
            const fileContent = await readFileContent(file);
            let parsedData: any[] = [];

            // Parse based on file type
            if (file.name.endsWith('.csv')) {
                parsedData = parseCSV(fileContent);
            } else if (file.name.endsWith('.json')) {
                parsedData = parseJSON(fileContent);
            }

            // Process the imported data
            const processedData = processImportedProductData(parsedData);

            // Call the onImportComplete callback
            onImportComplete(processedData);

            // Show success message
            alert(`Successfully imported ${processedData.length} products!`);

            // Close the dialog
            onClose();
        } catch (error) {
            console.error('Import failed:', error);
            alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsImporting(false);
        }
    };

    const downloadTemplate = (format: 'csv' | 'json') => {
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `product_template_${timestamp}`;

        const templateData = [
            {
                id: 1,
                name: "Sample Product",
                slug: "sample-product",
                category: "Electronics",
                sub_category: "Mobile",
                brand: "Apple",
                merchant: "Sample Store",
                price: 999.99,
                discount_percentage: 10,
                availability_status: "Available",
                is_active: true,
                is_hero_product: false,
                card_type: true,
                product_label: "Sample product description",
                image_url: "https://example.com/image.jpg",
                product_button_text: "Buy Now",
                popularity: 5,
                created_at: "2023-01-01T00:00:00Z",
                ends_at: "2023-12-31T23:59:59Z"
            }
        ];

        if (format === 'csv') {
            exportToCSV(processProductDataForExport(templateData), filename);
        } else {
            exportToJSON(templateData, filename);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <DialogTitle className="flex items-center justify-between text-2xl font-bold">
                        <span className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            Import Products
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8 pt-4">
                    {/* Drop Zone */}
                    <div
                        className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-105 shadow-lg'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleFileSelect}
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`p-4 rounded-full transition-all duration-300 ${isDragging
                                ? 'bg-blue-100 dark:bg-blue-900/40'
                                : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                <Upload className={`h-12 w-12 transition-colors duration-300 ${isDragging
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-400 dark:text-gray-500'
                                    }`} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Drop your file here
                                </p>
                                <p className="text-base text-gray-500 dark:text-gray-400">
                                    or click to browse
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Supports CSV and JSON formats
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                disabled={isImporting}
                                className="mt-4 py-6 px-8 text-base font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 hover:border-blue-500 rounded-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileSelect();
                                }}
                            >
                                {isImporting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                                        Importing...
                                    </>
                                ) : (
                                    <>Choose File</>
                                )}
                            </Button>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.json"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    {/* File Format Information */}
                    <div className="space-y-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            Supported File Formats
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-200">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                        CSV Format
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Columns should include: name, category, sub category, description, merchant, brand, price, commission, status, image_url, image_urls (semicolon-separated for multiple)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors duration-200">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                                    <FileJson className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                        JSON Format
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Array of product objects with the same fields. image_urls should be an array of URLs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Template Downloads */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            Download Templates
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => downloadTemplate('csv')}
                                className="flex items-center justify-center gap-3 py-6 px-6 text-base font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 hover:border-blue-500 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
                            >
                                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                CSV Template
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => downloadTemplate('json')}
                                className="flex items-center justify-center gap-3 py-6 px-6 text-base font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 hover:border-green-500 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg"
                            >
                                <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                                JSON Template
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ImportDialog;