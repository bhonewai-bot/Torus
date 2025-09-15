import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProductFormData, updateProductFormData } from "@/features/products/utils/product.schema";
import { ImageIcon, ImageUp, Star, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useUpdateProduct } from "@/features/products/hooks/useProducts";
import { showSuccess, showError } from "@/lib/utils/toast";
import { deleteProductImage, extractFilenameFromUrl } from "@/features/products/services/image.upload.service";

interface ProductImageManagerProps {
    form: UseFormReturn<createProductFormData | updateProductFormData>;
    mode: "create" | "edit";
    existingImages?: Array<{ id: string; url: string; isMain: boolean }>;
    productId?: string; // Required for edit mode to handle main image updates
}

interface ImageState {
    id?: string;
    url: string;
    file?: File;
    isMain: boolean;
    status: "existing" | "new" | "deleted"
}

export function ProductImageManager({ form, mode, existingImages = [], productId }: ProductImageManagerProps) {
    const [images, setImages] = useState<ImageState[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDeletingImage, setIsDeletingImage] = useState(false);
    const { confirm } = useConfirmDialog();
    const { mutate: updateProduct, isPending: isUpdatingMainImage } = useUpdateProduct();

    useEffect(() => {
        if (mode === "edit" && existingImages.length > 0) {
            const initImages: ImageState[] = existingImages.map((img) => ({
                id: img.id,
                url: img.url,
                isMain: img.isMain,
                status: "existing" as const,
            }));
            setImages(initImages);

            const mainIndex = initImages.findIndex((img) => img.isMain);
            setSelectedIndex(mainIndex >= 0 ? mainIndex : 0);
        }
    }, [mode, existingImages]);

    useEffect(() => {
        const activeImages = images.filter((img) => img.status !== "deleted");

        const formData = activeImages.map((img) => {
            if (img.status === "new" && img.file) {
                return {
                    file: img.file,
                    isMain: img.isMain,
                }
            } else if (img.status === "existing") {
                return {
                    id: img.id,
                    url: img.url,
                    isMain: img.isMain,
                }
            }
            return null;
        }).filter(Boolean);

        // Update form with only active images
        form.setValue("images", formData);
    }, [images, form]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImages: ImageState[] = acceptedFiles.map((file, index) => ({
            url: URL.createObjectURL(file),
            file,
            isMain: images.length === 0 && index === 0,
            status: "new" as const,
        }));

        setImages((prev) => [...prev, ...newImages]);
    }, [images.length]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"]
        },
        multiple: true,
        maxSize: 5 * 1024 * 1024,
        noClick: images.length > 0,
    });

    const removeImage = async (index: number) => {
        const imageToRemove = images[index];
        
        // Show confirmation dialog
        const confirmed = await confirm({
            title: "Delete Image",
            message: `Are you sure you want to delete this ${imageToRemove.isMain ? 'main ' : ''}image? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "destructive"
        });

        if (!confirmed) {
            return;
        }

        setIsDeletingImage(true);

        try {
            if (imageToRemove.status === 'new') {
                // Clean up blob URL for new images
                if (imageToRemove.url.startsWith('blob:')) {
                    URL.revokeObjectURL(imageToRemove.url);
                }
                // Remove completely for new images
                const newImages = images.filter((_, i) => i !== index);
                setImages(newImages);
                
                // Adjust selected index
                if (selectedIndex >= newImages.length) {
                    setSelectedIndex(Math.max(0, newImages.length - 1));
                } else if (selectedIndex === index) {
                    setSelectedIndex(0);
                }

                showSuccess("Image deleted successfully");
            } else {
                // For existing images, delete from server immediately
                let deleteSuccess = true;
                
                if (mode === "edit" && productId) {
                    try {
                        // Extract filename from URL for API call
                        const filename = extractFilenameFromUrl(imageToRemove.url);
                        if (filename) {
                            await deleteProductImage(filename);
                        }

                        // Also update the product to remove this image from the database
                        const remainingImages = images
                            .filter((_, i) => i !== index)
                            .filter(img => img.status === "existing")
                            .map(img => ({
                                id: img.id,
                                url: img.url,
                                isMain: img.isMain
                            }));

                        // If we're deleting the main image, set the first remaining image as main
                        if (imageToRemove.isMain && remainingImages.length > 0) {
                            remainingImages[0].isMain = true;
                        }

                        await new Promise<void>((resolve, reject) => {
                            updateProduct(
                                { 
                                    id: productId, 
                                    data: { images: remainingImages } 
                                },
                                {
                                    onSuccess: () => resolve(),
                                    onError: (error) => reject(error)
                                }
                            );
                        });

                    } catch (error) {
                        deleteSuccess = false;
                        showError("Failed to delete image from server");
                    }
                }

                if (deleteSuccess) {
                    // Remove from local state
                    const newImages = images.filter((_, i) => i !== index);
                    
                    // If we deleted the main image, make the first remaining image main
                    if (imageToRemove.isMain && newImages.length > 0) {
                        newImages[0].isMain = true;
                    }
                    
                    setImages(newImages);
                    
                    // Adjust selected index
                    if (selectedIndex >= newImages.length) {
                        setSelectedIndex(Math.max(0, newImages.length - 1));
                    } else if (selectedIndex === index) {
                        setSelectedIndex(0);
                    }

                    showSuccess("Image deleted successfully");
                }
            }
        } catch (error) {
            showError("Failed to delete image");
        } finally {
            setIsDeletingImage(false);
        }
    };

    const setMainImage = async (index: number) => {
        const targetImage = images[index];
        
        // Store original state for potential rollback
        const originalImages = [...images];
        
        // Update local state first for immediate UI feedback
        const newImages = images.map((img, i) => ({
            ...img,
            isMain: i === index
        }));
        setImages(newImages);

        // If in edit mode and target image is existing, make API call to persist the change
        if (mode === "edit" && productId && targetImage.status === "existing" && targetImage.id) {
            try {
                // Create the update payload with all existing images and their updated main status
                const imageUpdates = newImages
                    .filter(img => img.status === "existing")
                    .map(img => ({
                        id: img.id,
                        url: img.url,
                        isMain: img.isMain
                    }));

                // Use the mutation with proper error handling
                await new Promise<void>((resolve, reject) => {
                    updateProduct(
                        { 
                            id: productId, 
                            data: { 
                                images: imageUpdates 
                            } 
                        },
                        {
                            onSuccess: () => {
                                showSuccess("Main image updated successfully");
                                resolve();
                            },
                            onError: (error) => {
                                // Revert local state on error
                                setImages(originalImages);
                                reject(error);
                            }
                        }
                    );
                });
            } catch (error) {
                console.error("Error updating main image:", error);
                // Error already handled in the onError callback
            }
        } else if (mode === "create" || targetImage.status === "new") {
            // For create mode or new images, just show success since it will be saved with the form
            showSuccess("Main image set successfully");
        }
    };

    const activeImages = images.filter(img => img.status !== 'deleted');
    const currentImage = activeImages[selectedIndex];

    if (activeImages.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-lg font-medium">
                        Media
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div 
                        {...getRootProps()} 
                        className={`
                            relative border-1 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'}
                        `}
                    >
                        <input {...getInputProps()} />
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                {isDragActive ? (
                                    <Upload className="w-8 h-8 text-primary" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    {isDragActive ? 'Drop images here' : 'Upload product images'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Drag & drop or click to select<br />
                                    PNG, JPG, WebP up to 5MB each
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg font-medium">
                    <ImageIcon className="h-5 w-5 mr-2 text-primary" />
                    Media
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {/* Main Image Display */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                    <Image
                        src={currentImage.url}
                        alt="Product image"
                        fill
                        className="object-cover"
                        sizes="400px"
                        priority
                    />
                    
                    {/* Main Image Badge */}
                    {currentImage.isMain && (
                        <Badge className="absolute top-2 left-2 bg-primary/90">
                            Main    
                        </Badge>
                    )}
                    
                    {/* Remove Button */}
                    <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                            // Find the actual index in the full images array
                            const actualIndex = images.findIndex(img => 
                                activeImages[selectedIndex] === img
                            );
                            removeImage(actualIndex);
                        }}
                        disabled={isUpdatingMainImage || isDeletingImage}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                    
                    {/* Set Main Button */}
                    {!currentImage.isMain && (
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                                // Find the actual index in the full images array
                                const actualIndex = images.findIndex(img => 
                                    activeImages[selectedIndex] === img
                                );
                                setMainImage(actualIndex);
                            }}
                            disabled={isUpdatingMainImage || isDeletingImage}
                        >
                            <Star className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Thumbnail Strip */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Images ({activeImages.length}) 
                            {(isUpdatingMainImage || isDeletingImage) && (
                                <span className="text-orange-500"> (Processing...)</span>
                            )}
                        </span>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            disabled={isUpdatingMainImage || isDeletingImage}
                        >
                            <Upload className="w-4 h-4 mr-1" />
                            Add More
                        </Button>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {activeImages.map((image, index) => (
                            <button
                                key={`${image.id || image.url}-${index}`}
                                type="button"
                                onClick={() => setSelectedIndex(index)}
                                className={`
                                    relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all
                                    ${selectedIndex === index ? 'border-primary' : 'border-muted hover:border-primary/50'}
                                    ${(isUpdatingMainImage || isDeletingImage) ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                disabled={isUpdatingMainImage || isDeletingImage}
                            >
                                <Image
                                    src={image.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                                {image.isMain && (
                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                        <Star className="w-3 h-3 text-primary fill-primary" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Hidden File Input for Add More */}
                <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) onDrop(files);
                        e.target.value = ''; // Reset input
                    }}
                    className="hidden"
                />

                {/* Image Info */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>
                        Image {selectedIndex + 1} of {activeImages.length}
                    </span>
                    {currentImage.isMain && (
                        <span className="text-primary font-medium">Main Image</span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}