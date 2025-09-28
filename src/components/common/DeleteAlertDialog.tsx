'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'destructive' | 'warning';
    children?: ReactNode;
}

export function DeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
    variant = "destructive",
    children,
}: DeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center space-x-3">
                        <div className={`
              flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full
              ${variant === 'destructive'
                                ? 'bg-red-100 dark:bg-red-900/20'
                                : 'bg-amber-100 dark:bg-amber-900/20'
                            }
            `}>
                            {variant === 'destructive' ? (
                                <Trash2 className={`
                  h-6 w-6
                  ${variant === 'destructive'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                    }
                `} />
                            ) : (
                                <AlertTriangle className={`
                  h-6 w-6
                  ${variant === 'destructive'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                    }
                `} />
                            )}
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </AlertDialogTitle>
                    </div>
                </AlertDialogHeader>

                <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-300">
                    {description}
                </AlertDialogDescription>

                {children && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        {children}
                    </div>
                )}

                <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                    <AlertDialogCancel asChild>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            className="flex-1 sm:flex-none"
                        >
                            <X className="h-4 w-4 mr-2" />
                            {cancelText}
                        </Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            type="button"
                            variant={variant === 'destructive' ? 'destructive' : 'default'}
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : variant === 'destructive' ? (
                                <Trash2 className="h-4 w-4 mr-2" />
                            ) : (
                                <AlertTriangle className="h-4 w-4 mr-2" />
                            )}
                            {confirmText}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteDialog;