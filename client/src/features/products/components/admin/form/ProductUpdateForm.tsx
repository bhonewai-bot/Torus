"use client";

import {ProductDetails} from "@/features/products/types/product.types";
import {useRouter} from "next/navigation";
import {useUpdateProduct} from "@/features/products/hooks/useProducts";
import {FormProvider, useForm} from "react-hook-form";
import {updateProductFormData, updateProductSchema} from "@/features/products/utils/product.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {ProductBasicInfo} from "@/features/products/components/admin/form/ProductBasicInfo";
import {ProductDimensions} from "@/features/products/components/admin/form/ProductDimensions";
import {ProductPricingInventory} from "@/features/products/components/admin/form/ProductPricingInventory";
import {Button} from "@/components/ui/button";
import {ProductUpdateImageUpload} from "@/features/products/components/admin/form/ProductUpdateImageUpload";
import {ExistingImage} from "@/features/products/types/image.types";
import {transformUpdateFormDataToDto} from "@/features/products/utils/product.transformers";

interface ProductUpdateFormProps {
    product: ProductDetails;
}

export function ProductUpdateForm({ product }: ProductUpdateFormProps) {
    const router = useRouter();
    const { mutate: updateProduct, isPending } = useUpdateProduct();

    const form = useForm<updateProductFormData>({
        resolver: zodResolver(updateProductSchema),
        defaultValues: {
            sku: product.sku,
            title: product.title,
            brand: product.brand || "",
            description: product.description || "",
            categoryId: product.category?.id,
            dimensions: {
                length: product.dimensions?.length ?? undefined,
                width: product.dimensions?.width ?? undefined,
                height: product.dimensions?.height ?? undefined,
                weight: product.dimensions?.weight ?? undefined,
            },
            pricing: {
                price: product.pricing?.price ?? undefined,
                regularPrice: product.pricing?.regularPrice ?? undefined,
                salePrice: product.pricing?.salePrice ?? undefined,
                taxRate: product.pricing?.taxRate ?? undefined,
                taxIncluded: product.pricing?.taxIncluded ?? false,
            },
            inventory: {
                quantity: product.inventory?.quantity ?? undefined,
            },
            images: product.images?.map((img) => ({
                id: img.id,
                url: img.url,
                isMain: img.isMain
            })) || [],
            status: product.status
        }
    });

    const onSubmit = async (data: updateProductFormData) => {
        const existingImages: ExistingImage[] = product.images?.map(img => ({
            id: img.id,
            url: img.url,
            isMain: img.isMain,
        })) || [];

        const transformedData = await transformUpdateFormDataToDto(data, existingImages);

        updateProduct({ id: product.id, data: transformedData }, {
            onSuccess: () => {
                router.push("/admin/products");
            }
        });
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
                <ProductBasicInfo form={form} />
                <ProductPricingInventory form={form} />
                <ProductDimensions form={form} />
                <ProductUpdateImageUpload form={form} existingImages={product.images || []} />

                <div className={"flex items-center gap-4"}>
                    <Button
                        type={"submit"}
                        disabled={isPending}
                        className={"min-w-[120px]"}
                    >
                        {isPending ? "Updating" : "Update Product"}
                    </Button>
                    <Button
                        type={"button"}
                        variant={"outline"}
                        onClick={() => router.push("/admin/products")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}