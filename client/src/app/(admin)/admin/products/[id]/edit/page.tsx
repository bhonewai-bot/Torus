"use client";

import {ProductBreadcrumb} from "@/features/products/components/admin/ProductBreadcrumb";
import {ProductUpdateForm} from "@/features/products/components/admin/form/ProductUpdateForm";
import {useProduct} from "@/features/products/hooks/useProducts";
import React from "react";
import {ProductDimensions} from "@/features/products/components/admin/form/ProductDimensions";

interface ProductUpdatePageProps {
    params: {
        id: string
    }
}

export default function ProductUpdatePage({ params }: ProductUpdatePageProps) {
    const unwrappedParams = React.use(params);
    const { id } = unwrappedParams;
    const { data: product, isLoading } = useProduct(id);
    console.log(product);

    if (isLoading) {
        return (
            <div className={"flex items-center justify-center h-64"}>
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className={"flex flex-col gap-6 pb-4"}>
            <div className={"flex flex-col gap-4"}>
                <ProductBreadcrumb item={"Update Product"} />
                <h1 className={"text-3xl font-medium"}>Update Product</h1>
            </div>
            <ProductUpdateForm product={product} />
        </div>
    );
}