import {ProductDetails} from "@/features/products/types/product.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Calendar} from "lucide-react";
import React from "react";

interface ProductMetadataCardProps {
    product: ProductDetails;
}

export function ProductMetadataCard({ product }: ProductMetadataCardProps) {
    return (
        <Card className={"shadow-none"}>
            <CardHeader>
                <CardTitle className={"text-lg font-medium flex items-center"}>
                    <Calendar className={"h-5 w-5 mr-2"} />
                    Metadata
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {product.createdAt && (
                        <div>
                            <label className="font-medium text-muted-foreground">Created</label>
                            <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                        </div>
                    )}
                    {product.updatedAt && (
                        <div>
                            <label className="font-medium text-muted-foreground">Last Updated</label>
                            <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}