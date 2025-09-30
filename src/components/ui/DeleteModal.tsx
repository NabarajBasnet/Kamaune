import { Trash2, Loader2 } from 'lucide-react'
import { Button } from './button'

interface DeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    itemName?: string
    isLoading?: boolean
}

export function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    isLoading = false
}: DeleteModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{title}</h3>
                            <p className="text-gray-400 text-sm">{description}</p>
                        </div>
                    </div>

                    {itemName && (
                        <div className="bg-gray-800 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-300">
                                <span className="text-gray-400">Item to delete:</span>
                                <br />
                                <span className="font-medium text-white">{itemName}</span>
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="text-gray-400 hover:text-white border-gray-600"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/25"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}