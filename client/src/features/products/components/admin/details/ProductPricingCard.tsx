import {ProductDetails} from "@/features/products/types/product.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DollarSign} from "lucide-react";
import React from "react";

interface ProductPricingCardProps {
    product: ProductDetails;
}

function isProductWithPricing(product: any): product is { pricing: { price: number; taxRate: number } } {
  return product.pricing !== undefined;
}

export function ProductPricingCard({ product }: ProductPricingCardProps) {
    return (
        <Card className={"shadow-none"}>
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pricing
                </CardTitle>
            </CardHeader>
            <CardContent>
                {product.pricing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Current Price</label>
                            <p className="text-xl font-semibold">
                                ฿ {product.pricing?.price?.toLocaleString() ?? "-"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Regular Price</label>
                            <p className="text-lg font-semibold">
                                {product.pricing.regularPrice ? <span>฿ {product.pricing.regularPrice}</span> : "-"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                            <p className="text-lg font-semibold">
                                {product.pricing.salePrice ? <span>฿ {product.pricing.salePrice}</span> : "-"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Tax Rate</label>
                            <p className="text-lg">
                                {product.pricing?.taxRate != null ? `${product.pricing.taxRate}%` : "-"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>No pricing information available</div>
                )}
            </CardContent>
        </Card>
    )
}