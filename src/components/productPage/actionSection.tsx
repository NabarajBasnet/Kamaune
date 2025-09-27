import React from "react";
import { Button } from "../ui/button";
import { RefreshCcw, Box, Plus } from "lucide-react";
import { CiExport, CiImport } from "react-icons/ci";

function ProductActionSection() {
    return (
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left side actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 shadow-sm hover:bg-muted py-5.5 cursor-pointer"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                </Button>

                <Button
                    variant="outline"
                    className="flex items-center gap-2 shadow-sm hover:bg-muted py-5.5 cursor-pointer"
                >
                    <Box className="h-4 w-4" />
                    Reset Filters
                </Button>

                <Button
                    variant="outline"
                    className="flex items-center gap-2 shadow-sm hover:bg-muted py-5.5 cursor-pointer"
                >
                    <CiImport className="h-4 w-4" />
                    Import
                </Button>

                <Button
                    variant="outline"
                    className="flex items-center gap-2 shadow-sm hover:bg-muted py-5.5 cursor-pointer"
                >
                    <CiExport className="h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Right side */}
            <Button
                variant="outline"
                className="flex items-center gap-2 shadow-sm md:self-auto w-full md:w-auto py-5.5 cursor-pointer"
            >
                <Plus className="h-4 w-4" />
                Create Product
            </Button>
        </div>
    );
}

export default ProductActionSection;