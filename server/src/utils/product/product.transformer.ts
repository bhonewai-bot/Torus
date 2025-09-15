import { ProductDetail, ProductList } from "@src/types/product.types";

export function formatProductList(product: any): ProductList {
    return {
        id: product.id,
        sku: product.sku,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        mainImage: product?.images?.[0]?.url,
        category: product.category ? {
            id: product.category.id,
            title: product.category.title,
        } : undefined,
        status: product.status,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }
}

export function formatProductDetail(product: any): ProductDetail {
    return {
        id: product.id,
        sku: product.sku,
        title: product.title,
        description: product.description,
        category: product.category ? {
            id: product.category.id,
            title: product.category.title,
        } : undefined,
        pricing: {
            price: product.price,
        },
        inventory: {
            quantity: product.quantity,
        },
        images: product.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            isMain: img.isMain,
        })),
        status: product.status,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }
}