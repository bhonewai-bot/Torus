import {UseFormReturn} from "react-hook-form";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Package, Star, StarOff, Upload, X} from "lucide-react";
import {FormField, FormItem, FormMessage} from "@/components/ui/form";
import React, {useCallback, useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {createProductFormData} from "@/features/products/utils/product.schema";

interface ProductImageUploadProps {
    form: UseFormReturn<createProductFormData>;
}

interface ImagePreview {
    file: File;
    preview: string;
    isMain: boolean;
}

export function ProductImageUpload({ form }: ProductImageUploadProps) {
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPreviews = acceptedFiles.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            isMain: imagePreviews.length === 0 && index === 0,
        }));

        const updatedPreviews = [...imagePreviews, ...newPreviews];
        setImagePreviews(updatedPreviews);

        const imageData = updatedPreviews.map((preview) => ({
            file: preview.file,
            isMain: preview.isMain,
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
        const imageToRemove = imagePreviews[index];
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        if (imageToRemove.isMain && updatedPreviews.length > 0) {
            updatedPreviews[0].isMain = true;
        }

        setImagePreviews(updatedPreviews);

        const imageData = updatedPreviews.map((preview) => ({
            file: preview.file,
            isMain: preview.isMain,
        }));

        form.setValue("images", imageData);

        URL.revokeObjectURL(imageToRemove.preview);
    }

    const setMainImage = (index: number) => {
        const updatedPreviews = imagePreviews.map((preview, i) => ({
            ...preview,
            isMain: i === index
        }));

        setImagePreviews(updatedPreviews);

        const imageData = updatedPreviews.map((preview) => ({
            file: preview.file,
            isMain: preview.isMain,
        }));

        form.setValue("images", imageData);
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                URL.revokeObjectURL(preview.preview);
            });
        };
    }, [imagePreviews]);

    return (
        <Accordion type={"single"} collapsible defaultValue={"product-image-upload"} className={"border rounded-lg shadow-sm dark:shadow-none"}>
            <AccordionItem value={"product-image-upload"} className={"border-none"}>
                <AccordionTrigger className={"flex items-center justify-between px-4 py-3 decoration-transparent rounded-lg transition-colors hover:bg-muted/50"}>
                    <span className={"flex items-center text-lg font-medium text-foreground"}>
                        <Package className={"h-5 w-5 mr-2 text-muted-foreground"} />
                        Images
                    </span>
                </AccordionTrigger>
                <AccordionContent className={"px-4 py-4 border-t border-border"}>
                    <div className={"space-y-4"}>
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
                                                border-1 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200
                                                ${isDragActive
                                                    ? "border-primary bg-primary/5 dark:bg-primary/10 scale-[1.02]"
                                                    : "border-border hover:border-primary hover:bg-muted/30 dark:border-border dark:hover:border-primary dark:hover:bg-muted/20"
                                                }
                                            `}
                                        >
                                            <input {...getInputProps()} />
                                            <div className={"flex flex-col items-center gap-3"}>
                                                <div>
                                                    <Upload className={`h-8 w-8 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                                                </div>
                                                <div className={"space-y-1"}>
                                                    <p className={"text-sm font-medium text-foreground"}>
                                                        {isDragActive ? "Drop images here..." : "Drag & drop images here"}
                                                    </p>
                                                    <p className={"text-xs text-muted-foreground"}>
                                                        or <span className={"text-primary underline font-medium"}>browse files</span>
                                                    </p>
                                                </div>
                                                <p className={"text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full"}>
                                                    PNG, JPG, WEBP up to 5MB each
                                                </p>
                                            </div>
                                        </div>

                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2"}>
                                                {imagePreviews.map((preview, index) => (
                                                    <Card key={index} className={"relative group cursor-pointer shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-none transition-all duration-200 border-border hover:border-primary/20"}>
                                                        <CardContent className={"py-0 px-2"}>
                                                            <div className={"aspect-square relative rounded-lg overflow-hidden bg-muted"}>
                                                                <img
                                                                    src={preview.preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className={"w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"}
                                                                />

                                                                {/* Main Image Badge */}
                                                                {preview.isMain && (
                                                                    <Badge className={"absolute top-2 left-2 bg-primary text-primary-foreground shadow-md"}>
                                                                        <Star className={"h-3 w-3 mr-1 fill-current"} />
                                                                        Main
                                                                    </Badge>
                                                                )}

                                                                {/* Action Buttons Overlay */}
                                                                <div className={"absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2"}>
                                                                    {!preview.isMain && (
                                                                        <Button
                                                                            type={"button"}
                                                                            onClick={() => setMainImage(index)}
                                                                            size={"sm"}
                                                                            variant={"secondary"}
                                                                            className={"h-8 w-8 p-0 bg-background/90 hover:bg-background border-border shadow-sm"}
                                                                        >
                                                                            <StarOff className={"h-4 w-4 text-foreground"} />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        type={"button"}
                                                                        size={"sm"}
                                                                        variant={"destructive"}
                                                                        onClick={() => removeImage(index)}
                                                                        className={"h-8 w-8 p-0 shadow-sm"}
                                                                    >
                                                                        <X className={"h-4 w-4"} />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {/* File Info */}
                                                            <div className={"mt-3 space-y-1"}>
                                                                <p className={"text-xs text-foreground truncate font-medium"}>
                                                                    {preview.file.name}
                                                                </p>
                                                                <p className={"text-xs text-muted-foreground"}>
                                                                    {(preview.file.size / 1024 / 1024).toFixed(1)} MB
                                                                </p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}

                                        <FormMessage className={"text-xs text-destructive mt-2"} />
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