import {UseFormReturn} from "react-hook-form";
import {UpdateProductFormData} from "@/features/products/schemas/product.schema";
import {ExistingImage} from "@/features/products/types/image.types";
import React, {useCallback, useEffect, useState} from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {ExternalLink, Package, Star, StarOff, Upload, X} from "lucide-react";
import {FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useDropzone} from "react-dropzone";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

interface ProductUpdateImageUploadProps {
    form: UseFormReturn<UpdateProductFormData>;
    existingImages: ExistingImage[];
}

interface ImagePreview {
    id?: string;
    file?: File;
    preview: string;
    isMain: boolean;
    isExisting: boolean;
}

export function ProductUpdateImageUpload({ form, existingImages }: ProductUpdateImageUploadProps) {
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

    useEffect(() => {
        const existingPreviews: ImagePreview[] = existingImages.map((img) => ({
            id: img.id,
            preview: img.url,
            isMain: img.isMain,
            isExisting: true,
        }));

        setImagePreviews(existingPreviews);

        const imageData = existingPreviews.map(preview => ({
            id: preview.id,
            url: preview.preview,
            isMain: preview.isMain,
        }));
        form.setValue("images", imageData)
    }, [existingImages, form]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPreviews = acceptedFiles.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            isMain: imagePreviews.length === 0 && index === 0,
            isExisting: false,
        }));

        const updatedPreviews = [...imagePreviews, ...newPreviews];
        setImagePreviews(updatedPreviews);

        // Update form data
        const imageData = updatedPreviews.map((preview) => {
            if (preview.isExisting) {
                return {
                    id: preview.id,
                    url: preview.preview,
                    isMain: preview.isMain,
                };
            } else {
                return {
                    url: preview.preview,
                    isMain: preview.isMain,
                    file: preview.file,
                }
            }
        });

        form.setValue("images", imageData)
    }, [imagePreviews, form]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"]
        },
        multiple: true,
        maxSize: 5 * 1024 *1024,
    });

    const removeImage = (index: number) => {
        const imageToRemove = imagePreviews[index];
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        if (imageToRemove.isMain && updatedPreviews.length > 0) {
            updatedPreviews[0].isMain = true;
        }

        setImagePreviews(updatedPreviews);

        const imageData = updatedPreviews.map((preview) => {
            if (preview.isExisting) {
                return {
                    id: preview.id,
                    url: preview.preview,
                    isMain: preview.isMain,
                }
            } else {
                return {
                    url: preview.preview,
                    isMain: preview.isMain,
                    file: preview.file,
                }
            }
        });

        form.setValue("images", imageData);

        if (!imageToRemove.isExisting) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
    }

    const setMainImage = (index: number) => {
        const updatedPreviews = imagePreviews.map((preview, i) => ({
            ...preview,
            isMain: i === index
        }));

        setImagePreviews(updatedPreviews);

        // Update form data
        const imageData = updatedPreviews.map((preview) => {
            if (preview.isExisting) {
                return {
                    id: preview.id,
                    url: preview.preview,
                    isMain: preview.isMain,
                }
            } else {
                return {
                    url: preview.preview,
                    isMain: preview.isMain,
                    file: preview.file,
                }
            }
        });

        form.setValue("images", imageData);

        useEffect(() => {
            return () => {
                imagePreviews
                    .filter(preview => !preview.isExisting)
                    .forEach(preview => {
                        URL.revokeObjectURL(preview.preview)
                    })
            }
        }, []);
    }

    return (
        <Accordion type={"single"} collapsible defaultValue={"product-image-upload"} className={"bg-primary-foreground border rounded-lg"}>
            <AccordionItem value={"product-image-upload"}>
                <AccordionTrigger className={"flex items-center justify-between px-4 py-3 decoration-transparent rounded-lg transition"}>
                    <span className={"flex items-center text-lg font-medium"}>
                        <Package className={"h-5 w-5 mr-2"} />
                        Images
                    </span>
                </AccordionTrigger>
                <AccordionContent className={"p-4 border-t"}>
                    <div className={"space-y-6"}>
                        <div>
                            <FormField
                                control={form.control}
                                name={"images"}
                                render={({ field }) => (
                                    <FormItem>
                                        {/* Upload Area */}
                                        <div
                                            {...getRootProps()}
                                            className={`
                                                border-1 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                                                ${isDragActive
                                                    ? "border-primary bg-primary/5"
                                                    : "border-gray-300 hover:border-primary hover:bg-gray-50"
                                                }
                                            `}
                                        >
                                            <input {...getInputProps()} />
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="h-10 w-10 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {isDragActive ? "Drop new images here..." : "Add more images"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        or <span className="text-primary underline">browse files</span>
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    PNG, JPG, WEBP up to 5MB each
                                                </p>
                                            </div>
                                        </div>

                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"}>
                                                {imagePreviews.map((preview, index) => (
                                                   <Card key={index} className={"relative group cursor-pointer shadow-none"}>
                                                        <CardContent className={"p-4"}>
                                                            <div className={"aspect-square relative rounded-md overflow-hidden bg-gray-100"}>
                                                                <img
                                                                    src={preview.preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className={"w-full h-full object-cover"}
                                                                />

                                                                {/* Existing Image Indicator */}
                                                                {preview.isExisting && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="absolute top-2 right-2 text-xs"
                                                                    >
                                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                                        Saved
                                                                    </Badge>
                                                                )}

                                                                {/* Main Image Badge */}
                                                                {preview.isMain && (
                                                                    <Badge className="absolute top-2 left-2">
                                                                        <Star className="h-3 w-3 mr-1" />
                                                                        Main
                                                                    </Badge>
                                                                )}

                                                                {/* Action Buttons */}
                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                                                    {!preview.isMain && (
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            onClick={() => setMainImage(index)}
                                                                            className="h-8 w-8 p-0"
                                                                        >
                                                                            <StarOff className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => removeImage(index)}
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <div className="mt-2">
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {preview.isExisting
                                                                        ? "Existing image"
                                                                        : preview.file?.name
                                                                    }
                                                                </p>
                                                                {preview.file && (
                                                                    <p className="text-xs text-gray-400">
                                                                        {(preview.file.size / 1024 / 1024).toFixed(1)} MB
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                   </Card>
                                                ))}
                                            </div>
                                        )}
                                        <FormMessage className="text-xs text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}