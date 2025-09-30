import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Link, Image as ImageIcon, AlertCircle, Loader2, Eye, Download } from 'lucide-react'
import { Button } from './button'
import { toast } from 'sonner'

interface ImageUploadProps {
    value?: string | null
    onChange: (value: string | null) => void
    label?: string
    placeholder?: string
    accept?: string
    maxSize?: number // in MB
    className?: string
    required?: boolean
    error?: string
    disabled?: boolean
    showPreview?: boolean
    allowUrl?: boolean
    allowUpload?: boolean
}

interface ImageFile {
    file: File
    preview: string
    progress?: number
    error?: string
}

export function ImageUpload({
    value,
    onChange,
    label = 'Image',
    placeholder = 'Enter image URL or upload file',
    accept = 'image/*',
    maxSize = 5, // 5MB default
    className = '',
    required = false,
    error,
    disabled = false,
    showPreview = true,
    allowUrl = true,
    allowUpload = true
}: ImageUploadProps) {
    const [mode, setMode] = useState<'url' | 'upload'>('url')
    const [urlInput, setUrlInput] = useState(value || '')
    const [uploadedFile, setUploadedFile] = useState<ImageFile | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [urlError, setUrlError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Validate image URL
    const validateImageUrl = useCallback(async (url: string): Promise<boolean> => {
        if (!url) return true // Empty is valid if not required

        // Basic URL validation
        try {
            new URL(url)
        } catch {
            setUrlError('Please enter a valid URL')
            return false
        }

        // Check if it's an image URL
        const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i
        if (!imageExtensions.test(url)) {
            setUrlError('URL must point to an image file (jpg, png, gif, etc.)')
            return false
        }

        // Try to load the image to verify it exists
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => {
                setUrlError(null)
                resolve(true)
            }
            img.onerror = () => {
                setUrlError('Unable to load image from this URL')
                resolve(false)
            }
            img.src = url
        })
    }, [])

    // Handle URL input change
    const handleUrlChange = async (url: string) => {
        setUrlInput(url)

        if (url) {
            const isValid = await validateImageUrl(url)
            if (isValid) {
                onChange(url)
            }
        } else {
            onChange(null)
            setUrlError(null)
        }
    }

    // Compress image file
    const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            const img = new Image()

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img
                if (width > maxWidth) {
                    height = (height * maxWidth) / width
                    width = maxWidth
                }

                canvas.width = width
                canvas.height = height

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height)
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now()
                            })
                            resolve(compressedFile)
                        } else {
                            resolve(file)
                        }
                    },
                    file.type,
                    quality
                )
            }

            img.src = URL.createObjectURL(file)
        })
    }

    // Upload image using the offer service
    const uploadImage = async (file: File): Promise<string> => {
        // Simulate upload progress
        setIsUploading(true)

        try {
            // Compress image before upload
            const compressedFile = await compressImage(file)

            // Simulate progress updates
            const progressInterval = setInterval(() => {
                setUploadedFile(prev => {
                    if (prev && prev.progress !== undefined && prev.progress < 90) {
                        return { ...prev, progress: prev.progress + 10 }
                    }
                    return prev
                })
            }, 300)

            // Dynamic import to avoid circular dependency

            // Upload to actual API
            const uploadResult = await offerService.uploadImage(compressedFile)

            clearInterval(progressInterval)
            setUploadedFile(prev => prev ? { ...prev, progress: 100 } : null)

            // Small delay to show 100% progress
            await new Promise(resolve => setTimeout(resolve, 500))

            toast.success('Your image has been uploaded successfully.')
            return uploadResult.url

        } catch (error) {
            console.error('Upload failed:', error)
            toast.error('Failed to upload image. Please try again.')
            throw error
        } finally {
            setIsUploading(false)
        }
    }

    // Validate file
    const validateFile = (file: File): string | null => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            return 'Please select an image file'
        }

        // Check file size
        const maxSizeBytes = maxSize * 1024 * 1024
        if (file.size > maxSizeBytes) {
            return `File size must be less than ${maxSize}MB`
        }

        return null
    }

    // Handle file selection
    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const file = files[0]
        const validationError = validateFile(file)

        if (validationError) {
            toast.error('Invalid File')
            return
        }

        // Create preview
        const preview = URL.createObjectURL(file)
        setUploadedFile({ file, preview })

        try {
            // Upload file
            const uploadedUrl = await uploadImage(file)
            onChange(uploadedUrl)
        } catch (error) {
            setUploadedFile(null)
            URL.revokeObjectURL(preview)
        }
    }

    // Handle drag and drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileSelect(e.dataTransfer.files)
    }, [])

    // Clear image
    const handleClear = () => {
        onChange(null)
        setUrlInput('')
        setUploadedFile(null)
        setUrlError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Get current image URL for preview
    const getPreviewUrl = () => {
        if (uploadedFile) return uploadedFile.preview
        if (value && mode === 'url') return value
        return null
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Mode Selection */}
            {allowUrl && allowUpload && (
                <div className="flex gap-2 mb-4">
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'url'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        disabled={disabled}
                    >
                        <Link className="w-4 h-4" />
                        URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('upload')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'upload'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        disabled={disabled}
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>
            )}

            {/* URL Input Mode */}
            {mode === 'url' && allowUrl && (
                <div className="space-y-2">
                    <div className="relative">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder={placeholder}
                            className={`w-full bg-white dark:bg-gray-700 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none border ${error || urlError
                                ? 'border-red-500 dark:border-red-400'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            disabled={disabled}
                        />
                        <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {urlError && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {urlError}
                        </p>
                    )}
                </div>
            )}

            {/* File Upload Mode */}
            {mode === 'upload' && allowUpload && (
                <div className="space-y-2">
                    {/* Upload Area */}
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : error
                                ? 'border-red-300 dark:border-red-600'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {isUploading ? (
                            <div className="space-y-2">
                                <Loader2 className="w-8 h-8 mx-auto animate-spin text-orange-600" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Uploading... {uploadedFile?.progress || 0}%
                                </p>
                                {uploadedFile?.progress && (
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadedFile.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-orange-600 hover:text-orange-500 cursor-pointer">
                                            Click to upload
                                        </span>{' '}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, GIF up to {maxSize}MB
                                    </p>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={disabled || isUploading}
                        />
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}

            {/* Image Preview */}
            {showPreview && getPreviewUrl() && (
                <div className="relative">
                    <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Preview
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(getPreviewUrl()!, '_blank')}
                                    className="p-1 h-auto"
                                    title="View full size"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClear}
                                    className="p-1 h-auto text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    disabled={disabled}
                                    title="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden">
                            <img
                                src={getPreviewUrl()!}
                                alt="Preview"
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    setUrlError('Failed to load image')
                                }}
                            />
                        </div>
                        {uploadedFile && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <p>File: {uploadedFile.file.name}</p>
                                <p>Size: {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}