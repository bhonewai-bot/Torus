"use client";

import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ProductBasicInfo} from "@/features/products/components/admin/form/ProductBasicInfo";
import {useRouter} from "next/navigation";
import {useCreateProduct} from "@/features/products/hooks/useProducts";
import {createProductFormData, createProductSchema} from "@/features/products/utils/product.schema";
import {Button} from "@/components/ui/button";
import {ProductPricingInventory} from "@/features/products/components/admin/form/ProductPricingInventory";
import {ProductDimensions} from "@/features/products/components/admin/form/ProductDimensions";
import {transformCreateFormDataToDto} from "@/features/products/utils/product.transformers";
import {ProductImageUpload} from "@/features/products/components/admin/form/ProductImageUpload";
import {useState} from "react";

export function ProductCreateForm() {
    const router = useRouter();
    const { mutate: createProduct, isPending } = useCreateProduct();

    const form = useForm<createProductFormData>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            sku: "",
            title: "",
            brand: "",
            description: "",
            categoryId: "",
            dimensions: {
                length: "",
                width: "",
                height: "",
                weight: "",
            },
            pricing: {
                price: "",
                regularPrice: "",
                salePrice: "",
                taxRate: "",
                taxIncluded: false,
            },
            inventory: {
                quantity: "",
            },
            images: [],
            isActive: true
        }
    });

    const onSubmit = async (data: createProductFormData) => {
        console.log("Form data before transform:", data);
        const transformedData = await transformCreateFormDataToDto(data);
        console.log("Transformed data:", transformedData);

        createProduct(transformedData, {
            onSuccess: () => {
                router.push("/admin/products");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
                <ProductBasicInfo form={form} />
                <ProductPricingInventory form={form} />
                <ProductDimensions form={form} />
                <ProductImageUpload form={form} />

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