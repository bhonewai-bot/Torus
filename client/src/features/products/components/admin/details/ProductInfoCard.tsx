import {ProductDetails} from "@/features/products/types/product.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Info} from "lucide-react";
import React from "react";

interface ProductInfoCardProps {
    product: ProductDetails;
}

export function ProductInfoCard({ product }: ProductInfoCardProps) {
    return (
        <Card className={"shadow-none"}>
            <CardHeader>
                <CardTitle className={"text-lg font-medium flex items-center"}>
                    <Info className="h-5 w-5 mr-2" />
                    Product Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Brand</label>
                        <p className="text-base">{product.brand}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                        <p className="text-base">{product.category?.title || "No category"}</p>
                    </div>
                </div>
                {product.description && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-base mt-1">{product.description}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}