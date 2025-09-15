"use client";

import { useCreateProduct, useUpdateProduct } from "@/features/products/hooks/useProducts";
import { ExistingImage } from "@/features/products/types/image.types";
import { ProductDetails } from "@/features/products/types/product.types";
import { createProductFormData, createProductSchema, updateProductFormData, updateProductSchema } from "@/features/products/utils/product.schema";
import { clearUploadRollbackData, rollbackUploadedImages, transformCreateFormDataToDto, transformUpdateFormDataToDto } from "@/features/products/utils/product.transformers";
import { zodResolver } from "@hookform/resolvers/zod";
import { deepEqual } from "@/lib/utils/deep-equal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { Button } from "@/components/ui/button";
import { ProductImageManager } from "./ProductImageManager";
import { ProductDetails as ProductDetailsForm } from "./ProductDetails";

interface ProductFormProps {
    mode: "create" | "edit";
    product?: ProductDetails;
}

export function ProductForm({ mode, product }: ProductFormProps) {
    const router = useRouter();
    const [hasChanges, setHasChanges] = useState(false);

    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(() => {
        if (mode === "create") {
            return {
                sku: "",
                title: "",
                brand: "",
                description: "",
                categoryId: "",
                pricing: {
                    price: "",
                },
                inventory: {
                    quantity: "",
                },
                images: [],
                status: "ACTIVE" as const
            }
        }

        return {
            sku: product?.sku || "",
            title: product?.title || "",
            brand: product?.brand || "",
            description: product?.description || "",
            categoryId: product?.category?.id || "",
            pricing: {
                price: product?.pricing?.price ?? "",
            },
            inventory: {
                quantity: product?.inventory?.quantity ?? "",
            },
            images: product?.images?.map((img) => ({
                id: img.id,
                url: img.url,
                isMain: img.isMain
            })) || [],
            status: product?.status || "ACTIVE" as const
        }
    }, [mode, product]);

    const form = useForm<createProductFormData | updateProductFormData>({
        resolver: zodResolver(mode === "create" ? createProductSchema : updateProductSchema),
        defaultValues
    });

    useEffect(() => {
        if (mode === "edit") {
            const subscription = form.watch((values) => {
                const currentValues = values;
                const originalValues = defaultValues;

                const changed = !(
                    currentValues.sku === originalValues.sku &&
                    currentValues.title === originalValues.title &&
                    currentValues.description === originalValues.description &&
                    currentValues.categoryId === originalValues.categoryId &&
                    Number(currentValues.pricing?.price) == Number(originalValues.pricing.price) &&
                    Number(currentValues.inventory?.quantity) == Number(originalValues.inventory.quantity) &&
                    deepEqual(currentValues.images, originalValues.images) &&
                    currentValues.status === originalValues.status
                );

                setHasChanges(changed);
            });
            return () => subscription.unsubscribe();
        }
    }, [form, mode, defaultValues]);

    const onSubmit = async (data: createProductFormData | updateProductFormData) => {
        if (mode === "create") {
            const transformedData = await transformCreateFormDataToDto(data as createProductFormData);

            createProduct(transformedData, {
                onSuccess: () => {
                    clearUploadRollbackData();
                    router.push("/admin/products");
                },
                onError: async () => {
                    await rollbackUploadedImages();
                }
            })
        } else {
            const existingImages: ExistingImage[] = product?.images?.map((img) => ({
                id: img.id,
                url: img.url,
                isMain: img.isMain,
            })) || [];

            const transformedData = await transformUpdateFormDataToDto(
                data as updateProductFormData,
                existingImages
            );

            updateProduct({ id: product!.id, data: transformedData }, {
                onSuccess: () => {
                    clearUploadRollbackData();
                    router.push("/admin/products");
                },
                onError: async () => {
                    await rollbackUploadedImages();
                }
            })
        }
    }

    const isSubmitDisabled = () => {
        if (mode === "create") {
            return isPending;
        }

        return !hasChanges || isPending;
    }

    const getSubmitButtonText = () => {
        if (mode === "create") {
            return isCreating ? "Creating..." : "Create Product";
        }
        return isUpdating ? "Updating..." : "Update Product";
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-6">
                        <ProductImageManager form={form} mode={mode} existingImages={product?.images} />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <ProductBasicInfo form={form} /> 
                        <ProductDetailsForm form={form} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/products")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitDisabled()}
                        className="min-w-[120px]"
                    >
                        {getSubmitButtonText()}
                    </Button>
                </div>
                
            </form>
        </FormProvider>
    )
}