"use client";

import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ProductBasicInfo} from "@/features/products/components/admin/form/ProductBasicInfo";
import {useRouter} from "next/navigation";
import {useCreateProduct} from "@/features/products/hooks/useProducts";
import {CreateProductFormData, createProductSchema} from "@/features/products/schemas/product.schema";
import {Button} from "@/components/ui/button";
import {ProductPricingInventory} from "@/features/products/components/admin/form/ProductPricingInventory";
import {ProductDimensions} from "@/features/products/components/admin/form/ProductDimensions";
import {CreateProductDto} from "@/features/products/types/product.types";

export function ProductForm() {
    const router = useRouter();
    const { mutate: createProduct, isPending } = useCreateProduct();

    const form = useForm<CreateProductFormData>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            sku: "",
            title: "",
            brand: "",
            description: "",
            categoryId: "",
            dimensions: {
                length: "" as any,
                width: "" as any,
                height: "" as any,
                weight: "" as any,
            },
            pricing: {
                price: "" as any,
                regularPrice: "" as any,
                salePrice: "" as any,
                taxRate: "" as any,
                taxIncluded: false,
            },
            inventory: {
                quantity: "" as any,
            },
            images: [],
            isActive: true
        }
    });

    // Transform nested form data to flat API structure
    const transformFormDataToDto = (data: CreateProductFormData): CreateProductDto => {
        return {
            sku: data.sku,
            title: data.title,
            brand: data.brand,
            description: data.description,
            categoryId: data.categoryId,
            // Flatten dimensions
            length: data.dimensions?.length,
            width: data.dimensions?.width,
            height: data.dimensions?.height,
            weight: data.dimensions?.weight,
            // Flatten pricing
            price: data.pricing.price,
            regularPrice: data.pricing.regularPrice,
            salePrice: data.pricing.salePrice,
            taxRate: data.pricing.taxRate,
            taxIncluded: data.pricing.taxIncluded,
            // Flatten inventory
            quantity: data.inventory.quantity,
            // Keep images and isActive as-is
            images: data.images,
            isActive: data.isActive,
        };
    };

    const onSubmit = (data: CreateProductFormData) => {
        const transformedData = transformFormDataToDto(data);

        createProduct(
            transformedData,
            {
                onSuccess: () => {
                    router.push("/admin/products");
                }
            }
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
                <ProductBasicInfo form={form} />
                <ProductPricingInventory form={form} />
                <ProductDimensions form={form} />

                <div className={"flex items-center gap-4"}>
                    <Button
                        type={"submit"}
                        disabled={isPending}
                        className={"min-w-[120px]"}
                    >
                        {isPending ? "Creating" : "Create Product"}
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
        </Form>
    );
}