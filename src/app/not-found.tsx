'use client';

import { Button } from '@/components/ui/button';
import { Monitor, ArrowBigLeft } from 'lucide-react';

export default function NotFound() {

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-md w-full text-center">

                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <Monitor className="w-24 h-24 text-emerald-500 dark:text-emerald-400" />
                </div>

                {/* Content */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Page Not Found
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action Button */}
                <Button
                    onClick={() => window.history.back()}
                    className="inline-flex cursor-pointer items-center gap-2 py-6 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-emerald-500/20"
                >
                    <ArrowBigLeft className="w-5 h-5" />
                    Go Back
                </Button>

                {/* Additional Info */}
                <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
                    <p>Error Code: 404</p>
                </div>
            </div>
        </div>
    );
}