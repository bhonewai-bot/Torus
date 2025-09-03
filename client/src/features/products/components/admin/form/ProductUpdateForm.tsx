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
                length: product.dimensions?.length || "",
                width: product.dimensions?.width || "",
                height: product.dimensions?.height || "",
                weight: product.dimensions?.weight || "",
            },
            pricing: {
                price: product.pricing?.price || "",
                regularPrice: product.pricing?.regularPrice || "",
                salePrice: product.pricing?.salePrice || "",
                taxRate: product.pricing?.taxRate || "",
                taxIncluded: product.pricing?.taxIncluded || false,
            },
            inventory: {
                quantity: product.inventory?.quantity || "",
            },
            images: product.images?.map((img) => ({
                id: img.id,
                url: img.url,
                isMain: img.isMain
            })) || [],
            isActive: product.isActive ?? true
        }
    });

    const onSubmit = async (data: UpdateProductFormData) => {
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