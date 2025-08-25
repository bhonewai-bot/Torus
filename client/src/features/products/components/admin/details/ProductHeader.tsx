import {ProductDetails} from "@/features/products/types/product.types";
import {Button} from "@/components/ui/button";
import {Edit} from "lucide-react";
import React from "react";
import {useRouter} from "next/navigation";

interface ProductHeaderProps {
    product: ProductDetails;
}

export function ProductHeader({ product }: ProductHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className={"space-y-2"}>
                    <h1 className="text-3xl font-medium">{product.title}</h1>
                    <p className="text-muted-foreground">SKU: {product.sku}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {/*<Badge variant={product.isActive ? "outline" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                </Badge>*/}
                <Button
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                </Button>
            </div>
        </div>
    )
}