import {ProductDetailItem, ProductListItem} from "@src/types/product.types";

export function formatProductList(product: any): ProductListItem {
    return {
        id: product.id,
        sku: product.sku,
        title: product.title,
        brand: product.brand,
        price: product.price,
        quantity: product.quantity,
        mainImage: product?.images?.[0]?.url,
        category: product.category ? {
            id: product.category.id,
            title: product.category.title,
        } : undefined,
        isActive: product.isActive,
    }
}

export function formatProductDetail(product: any): ProductDetailItem {
    return {
        id: product.id,
        sku: product.sku,
        title: product.title,
        brand: product.brand,
        description: product.description,
        category: product.category ? {
            id: product.category.id,
            title: product.category.title,
        } : undefined,
        dimensions: {
            length: product.length,
            width: product.width,
            height: product.height,
            weight: product.weight
        },
        pricing: {
            price: product.price,
            regularPrice: product.regularPrice,
            salePrice: product.salePrice,
            taxRate: product.taxRate,
            taxIncluded: product.taxIncluded,
        },
        inventory: {
            quantity: product.quantity,
        },
        images: product.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            isMain: img.isMain
        })),
        isActive: product.isActive,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    }
}

export function buildProductWhereClause(params: any) {
    const { categoryId, brand, isActive = true, search } = params;

    const where: any = { isActive };

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (brand) {
        where.brand = {
            contains: brand,
            mode: "insensitive",
        }
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } }
        ];
    }

    return where;
}