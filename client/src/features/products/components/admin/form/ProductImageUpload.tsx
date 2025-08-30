import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/features/products/schemas/product.schema";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Package, Star, StarOff, Upload, X} from "lucide-react";
import {FormField, FormItem, FormMessage} from "@/components/ui/form";
import React, {useCallback, useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductImageUploadProps {
    form: UseFormReturn<CreateProductFormData>;
}

interface ImagePreview {
    file: File;
    preview: string;
    isMain: boolean;
}

export function ProductImageUpload({ form }: ProductImageUploadProps) {
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPreviews = acceptedFiles.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            isMain: imagePreviews.length === 0 && index === 0,
        }));

        const updatedPreviews = [...imagePreviews, ...newPreviews];
        setImagePreviews(updatedPreviews);

        const imageData = updatedPreviews.map((preview, index) => ({
            url: preview.preview,
            isMain: preview.isMain,
            file: preview.file,
        }));

        form.setValue("images", imageData);
    }, [imagePreviews, form]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"]
        },
        multiple: true,
        maxSize: 5 * 1024 * 1024,
    });

    const removeImage = (index: number) => {
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        if (imagePreviews[index].isMain && imagePreviews.length > 0) {
            updatedPreviews[0].isMain = true;
        }

        setImagePreviews(updatedPreviews);

        const imageData = updatedPreviews.map((preview) => ({
            url: preview.preview,
            isMain: preview.isMain,
            file: preview.file,
        }));

        form.setValue("images", imageData);

        URL.revokeObjectURL(imagePreviews[index].preview);
    }

    const setMainImage = (index: number) => {
        const updatedReviews = imagePreviews.map((preview, i) => ({
            ...preview,
            isMain: i === index
        }));

        setImagePreviews(updatedReviews);

        const imageData = updatedReviews.map((preview) => ({
            url: preview.preview,
            isMain: preview.isMain,
            file: preview.file,
        }));

        form.setValue("images", imageData);
    }

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                URL.revokeObjectURL(preview.preview);
            });
        }
    }, []);

    return (
        <Accordion type={"single"} collapsible defaultValue={"product-image-upload"} className={"bg-primary-foreground border rounded-lg"}>
            <AccordionItem value={"product-image-upload"}>
                <AccordionTrigger className={"flex items-center justify-between px-4 py-3 decoration-transparent rounded-lg transition"}>
                    <span className={"flex items-center text-lg font-medium"}>
                        <Package className={"h-5 w-5 mr-2"} />
                        Images
                    </span>
                </AccordionTrigger>
                <AccordionContent className={"px-4 py-4 border-t"}>
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
                                            <div className={"flex flex-col items-center gap-2"}>
                                                <Upload className={"h-10 w-10 text-gray-400"} />
                                                <div>
                                                    <p className={"text-sm font-medium"}>
                                                        {isDragActive ? "Drop images here..." : "Drag & drop images here"}
                                                    </p>
                                                    <p className={"text-xs text-gray-500 mt-1"}>
                                                        or <span className={"text-primary underline"}>browse files</span>
                                                    </p>
                                                </div>
                                                <p className={"text-xs text-gray-400"}>
                                                    PNG, JPG, WEBP up to 5MB each
                                                </p>
                                            </div>
                                        </div>

                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"}>
                                                {imagePreviews.map((preview, index) => (
                                                    <Card key={index} className={"relative group cursor-pointer shadow-none"}>
                                                        <CardContent className={"px-4"}>
                                                            <div className={"aspect-square relative rounded-md overflow-hidden bg-gray-100"}>
                                                                <img
                                                                    src={preview.preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className={"w-full h-full object-cover"}
                                                                />

                                                                {/* Main Image Badge */}
                                                                {preview.isMain && (
                                                                    <Badge className={"absolute top-2 left-2 text-shadow-xs"}>
                                                                        <Star className={"h-3 w-3 mr-1"} />
                                                                        Main
                                                                    </Badge>
                                                                )}

                                                                {/* Action Buttons */}
                                                                <div className={"absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1"}>
                                                                    {!preview.isMain && (
                                                                        <Button
                                                                            type={"button"}
                                                                            onClick={() => setMainImage(index)}
                                                                            className={"h-8 w-8 p-0"}
                                                                        >
                                                                            <StarOff className={"h-4 w-4"} />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        type={"button"}
                                                                        size={"sm"}
                                                                        variant={"destructive"}
                                                                        onClick={() => removeImage(index)}
                                                                        className={"h-8 w-8 p-0"}
                                                                    >
                                                                        <X className={"h-4 w-4"} />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <div className={"mt-2"}>
                                                                <p className={"text-xs text-gray-500 truncate"}>
                                                                    {preview.file.name}
                                                                </p>
                                                                <p className={"text-xs text-gray-400"}>
                                                                    {(preview.file.size / 1024 / 1024).toFixed(1)} MB
                                                                </p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}

                                        <FormMessage className={"text-xs text-red-500 mt-1"} />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}