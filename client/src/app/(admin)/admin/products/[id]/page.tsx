"use client";

import {useProduct} from "@/features/products/hooks/useProducts";
import {use} from "react";
import {useRouter} from "next/router";
import { Button } from "@/components/ui/button";
import {Archive, ArrowLeft, DollarSign, Edit, ImageIcon, Package} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";

interface ProductDetailPageProps {
    params: {
        id: string;
    }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id: productId } = use(params);
    const { data: product, isLoading, error } = useProduct(productId);

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{product.title}</h1>
                        <p className="text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/*<Badge variant={product.isActive ? "default" : "secondary"}>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Images */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ImageIcon className="h-5 w-5 mr-2" />
                            Product Images
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {product.images && product.images.length > 0 ? (
                                product.images.map((image) => (
                                    <div key={image.id} className="relative aspect-square">
                                        <Image
                                            src={image.url}
                                            alt={product.title}
                                            fill
                                            className="object-cover rounded-lg"
                                            sizes="(max-width: 768px) 100vw, 400px"
                                        />
                                        {image.isMain && (
                                            <Badge className="absolute top-2 left-2">
                                                Main Image
                                            </Badge>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="relative aspect-square">
                                    <Image
                                        src={product.mainImage}
                                        alt={product.title}
                                        fill
                                        className="object-cover rounded-lg"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Product Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
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

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <DollarSign className="h-5 w-5 mr-2" />
                                Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.pricing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Current Price</label>
                                        <p className="text-2xl font-bold">
                                            ฿{product.pricing.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Regular Price</label>
                                        <p className="text-lg">
                                            {product.pricing.regularPrice ? `฿{product.pricing.regularPrice.toLocaleString()}` : "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                                        <p className="text-lg">
                                            {product.pricing.salePrice ? `฿{product.pricing.salePrice.toLocaleString()}` : "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Tax Rate</label>
                                        <p className="text-lg">{product.pricing.taxRate}%</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Price</label>
                                    <p className="text-2xl font-bold">
                                        ฿{product.price.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Inventory */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Package className="h-5 w-5 mr-2" />
                                Inventory
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Stock Quantity</label>
                                    <p className={`text-2xl font-bold ${
                                        (product.inventory?.quantity ?? product.quantity) === 0
                                            ? 'text-red-600'
                                            : (product.inventory?.quantity ?? product.quantity) < 10
                                                ? 'text-yellow-600'
                                                : 'text-green-600'
                                    }`}>
                                        {product.inventory?.quantity ?? product.quantity}
                                    </p>
                                </div>
                                <Badge variant={
                                    (product.inventory?.quantity ?? product.quantity) === 0
                                        ? "destructive"
                                        : (product.inventory?.quantity ?? product.quantity) < 10
                                            ? "outline"
                                            : "default"
                                }>
                                    {(product.inventory?.quantity ?? product.quantity) === 0
                                        ? "Out of Stock"
                                        : (product.inventory?.quantity ?? product.quantity) < 10
                                            ? "Low Stock"
                                            : "In Stock"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dimensions */}
                    {product.dimensions && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Archive className="h-5 w-5 mr-2" />
                                    Dimensions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Length</label>
                                        <p className="text-base">{product.dimensions.length} cm</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Width</label>
                                        <p className="text-base">{product.dimensions.width} cm</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Height</label>
                                        <p className="text-base">{product.dimensions.height} cm</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Weight</label>
                                        <p className="text-base">{product.dimensions.weight} g</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
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
                </div>
            </div>
        </div>
    );
}