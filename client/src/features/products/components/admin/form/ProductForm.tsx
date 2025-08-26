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
import {transformFormDataToDto} from "@/features/products/utils/transformers";
import {ProductImageUpload} from "@/features/products/components/admin/form/ProductImageUpload";

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
            categoryId: undefined,
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

    const onSubmit = (data: CreateProductFormData) => {
        const transformedData = transformFormDataToDto(data);
        console.log("Payload being sent:", transformedData);

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