import {ProductDetails} from "@/features/products/types/product.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Package} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import React from "react";

interface ProductInventoryCardProps {
    product: ProductDetails;
}

export function ProductInventoryCard({ product }: ProductInventoryCardProps) {
    return (
        <Card className={"shadow-none"}>
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Inventory
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Stock Quantity</label>
                        <p className={`text-2xl font-bold ${
                            (product.inventory?.quantity) === 0
                                ? 'text-red-600'
                                : (product.inventory?.quantity) < 10
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                        }`}>
                            {product.inventory?.quantity}
                        </p>
                    </div>
                    <Badge variant={
                        (product.inventory?.quantity) === 0
                            ? "destructive"
                            : (product.inventory?.quantity) < 10
                                ? "outline"
                                : "default"
                    }>
                        {(product.inventory?.quantity) === 0
                            ? "Out of Stock"
                            : (product.inventory?.quantity) < 10
                                ? "Low Stock"
                                : "In Stock"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}