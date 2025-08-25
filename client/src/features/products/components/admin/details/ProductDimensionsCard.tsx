import {ProductDetails} from "@/features/products/types/product.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Archive} from "lucide-react";
import React from "react";

interface ProductDimensionsCardProps {
    product: ProductDetails;
}

export function ProductDimensionsCard({ product }: ProductDimensionsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                    <Archive className="h-5 w-5 mr-2" />
                    Dimensions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Length</label>
                        <p className="text-base">
                            {product.dimensions?.length ? `${product.dimensions.length} cm` : "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Width</label>
                        <p className="text-base">
                            {product.dimensions?.width ? `${product.dimensions.width} cm` : "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Height</label>
                        <p className="text-base">
                            {product.dimensions?.height ? `${product.dimensions.height} cm` : "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Weight</label>
                        <p className="text-base">
                            {product.dimensions?.weight ? `${product.dimensions.weight} g` : "N/A"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}