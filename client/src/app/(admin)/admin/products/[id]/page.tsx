"use client";

import {useProduct} from "@/features/products/hooks/useProducts";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ProductImageCarousel} from "@/features/products/components/admin/details/ProductImageCarousel";
import React from "react";
import {ProductHeader} from "@/features/products/components/admin/details/ProductHeader";
import {ProductInfoCard} from "@/features/products/components/admin/details/ProductInfoCard";
import {ProductPricingCard} from "@/features/products/components/admin/details/ProductPricingCard";
import {ProductInventoryCard} from "@/features/products/components/admin/details/ProductInventoryCard";
import {ProductDimensionsCard} from "@/features/products/components/admin/details/ProductDimensionsCard";
import {ProductMetadataCard} from "@/features/products/components/admin/details/ProductMetadataCard";

interface ProductDetailPageProps {
    params: {
        id: string;
    }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const router = useRouter();
    // @ts-ignore
    const { id } = React.use(params);
    const { data: product, isLoading, error } = useProduct(id);

    console.log(product);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading product</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-4">
            {/* Header */}
            <ProductHeader product={product} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Images */}
                <ProductImageCarousel product={product} />

                {/* Product Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <ProductInfoCard product={product} />

                    {/* Pricing */}
                    <ProductPricingCard product={product} />

                    {/* Inventory */}
                    <ProductInventoryCard product={product} />

                    {/* Dimensions */}
                    {product.dimensions && (
                        <ProductDimensionsCard product={product} />
                    )}

                    {/* Metadata */}
                    <ProductMetadataCard product={product} />
                </div>
            </div>
        </div>
    );
}