import { useForm, useFieldArray } from "react-hook-form";
import React from "react";

interface Photo {
    id?: string;
    url?: string;
    alt: string;
    isPrimary: boolean;
    image: string;
}

interface FormValues {
    photos: Photo[];
}

interface ProductPhotoManagementProps {
    onPhotosChange?: (photos: Photo[]) => void;
}

const ProductPhotoManagement = ({ onPhotosChange }: ProductPhotoManagementProps) => {
    const {
        register,
        control,
        watch,
        setValue,
        getValues
    } = useForm<FormValues>({
        defaultValues: {
            photos: []
        }
    });

    const {
        fields: photos,
        append,
        remove
    } = useFieldArray({
        control,
        name: "photos"
    });

    const watchPhotos = watch("photos");
    const currentPhotos = watchPhotos || [];
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const notifyParent = () => {
        if (onPhotosChange) {
            const formValues = getValues();
            onPhotosChange(formValues.photos);
        }
    };

    // Convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Handle file selection
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const availableSlots = 5 - currentPhotos.length;
        const filesToProcess = Array.from(files).slice(0, availableSlots);

        if (filesToProcess.length === 0) return;

        for (let index = 0; index < filesToProcess.length; index++) {
            const file = filesToProcess[index];
            if (file.type.startsWith('image/')) {
                try {
                    const base64String = await fileToBase64(file);
                    const url = URL.createObjectURL(file);
                    const isFirstPhoto = currentPhotos.length === 0 && index === 0;

                    append({
                        id: Date.now().toString() + index,
                        url: url,
                        alt: file.name.split('.')[0] || `Photo ${currentPhotos.length + index + 1}`,
                        isPrimary: isFirstPhoto,
                        image: base64String
                    });
                } catch (error) {
                    console.error('Error converting file to base64:', error);
                }
            }
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        notifyParent();
    };

    const handleSetPrimaryPhoto = (photoIndex: number) => {
        currentPhotos.forEach((_, index) => {
            setValue(`photos.${index}.isPrimary`, index === photoIndex);
        });
        notifyParent();
    };

    const handleRemovePhoto = (index: number) => {
        const photoToRemove = currentPhotos[index];

        if (photoToRemove?.url && photoToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(photoToRemove.url);
        }

        const wasPrimary = photoToRemove?.isPrimary;

        remove(index);

        if (wasPrimary && currentPhotos.length > 1) {
            const newFirstIndex = index === 0 ? 0 : index - 1;
            setValue(`photos.${newFirstIndex}.isPrimary`, true);
        }

        notifyParent();
    };

    React.useEffect(() => {
        return () => {
            currentPhotos.forEach(photo => {
                if (photo?.url && photo.url.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.url);
                }
            });
        };
    }, []);

    React.useEffect(() => {
        notifyParent();
    }, []);

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                Product Photos (Up to 5)
            </h3>

            <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-600">
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                                S.N
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                                Preview
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                                File Name
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                                Alt Text
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                                Primary
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {photos.map((photo, index) => (
                            <tr
                                key={photo.id}
                                className="border-b border-gray-200 dark:border-gray-600"
                            >
                                <td className="py-3 px-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    {currentPhotos[index]?.url ? (
                                        <img
                                            src={currentPhotos[index].url}
                                            alt={currentPhotos[index].alt || `Photo ${index + 1}`}
                                            className="w-12 h-12 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src =
                                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHA+CjwvZz4KPC9zdmc+Cg==";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                No Image
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="py-3 px-2">
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {currentPhotos[index]?.alt || 'No file'}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <input
                                        type="text"
                                        {...register(`photos.${index}.alt`)}
                                        placeholder={`Alt text for photo ${index + 1}`}
                                        className="w-full bg-white dark:bg-gray-700 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                    />
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <input
                                        type="radio"
                                        checked={currentPhotos[index]?.isPrimary || false}
                                        onChange={() => handleSetPrimaryPhoto(index)}
                                        disabled={!currentPhotos[index]?.url}
                                        className="w-4 h-4 text-emerald-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-emerald-500 disabled:opacity-50"
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(index)}
                                        className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={currentPhotos.length >= 5}
                    className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Upload Photos ({currentPhotos.length}/5)
                </button>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>• Upload up to 5 product photos</p>
                <p>• Select one photo as primary (will be used as main product image)</p>
                <p>• Alt text helps with accessibility and SEO</p>
                <p>• Supported formats: JPEG, PNG, WebP, GIF</p>
            </div>
        </div>
    );
};

export default ProductPhotoManagement;
