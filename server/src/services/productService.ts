import {calculatePagination} from "@utils/helpers";
import prisma from "@config/prisma";
import {productDetailInclude, productListInclude} from "@utils/product/product.include";
import {buildProductWhereClause, formatProductDetail, formatProductList} from "@utils/product/product.helpers";
import {CreateProductDto} from "@src/types/dto/product/CreateProductDto";
import {ProductDetailItem} from "@src/types/ProductResponse";
import {UpdateProductDto} from "@src/types/dto/product/UpdateProductDto";

export interface GetAllProductsParams {
    page?: number;
    limit?: number;
    categoryId?: string;
    brand?: string;
    isActive?: boolean;
    search?: string;
    sortBy?: "title" | "price" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}

export async function getAllProducts(params: GetAllProductsParams = {}) {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;
    const where = buildProductWhereClause(params);

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            include: productListInclude,
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip,
            take: limit,
        }),
        prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map(formatProductList);
    const pagination = calculatePagination(total, page, limit);

    return {
        products: formattedProducts,
        pagination
    }
}

export async function getProductById(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: productDetailInclude,
    });

    return formatProductDetail(product);
}

export async function createProduct(data: CreateProductDto): Promise<ProductDetailItem> {
    const { images = [], ...productData } = data;

    const product = await prisma.product.create({
        data: {
            ...productData,
            images: {
                create: images.map((img) => ({
                    url: img.url,
                    isMain: img.isMain,
                }))
            }
        },
        include: productDetailInclude,
    });

    return formatProductDetail(product);
}

export async function updateProduct(id: string, data: UpdateProductDto): Promise<ProductDetailItem | null> {
    const existedProduct = await prisma.product.findUnique({
        where: { id },
        include: { images: true },
    });

    if (!existedProduct) {
        return null;
    }

    const { images, ...productData } = data;

    let updateData: any = productData;

    if (images) {
        updateData.images = {
            deleteMany: {},
            create: images.map((img) => ({
                url: img.url,
                isMain: img.isMain,
            }))
        }
    }

    const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData,
        include: productDetailInclude,
    });

    return formatProductDetail(updatedProduct);
}

/*export async function createProduct(data: CreateProductDto): Promise<ProductListResponse | null> {
    const { quantity, ...productData } = data;

    const product = await prisma.product.create({
        data: {
            ...productData,
            inventory: {
                create: {
                    quantity
                }
            }
        },
        include: productInclude,
    });

    return formatProduct(product);
}*/

/*export async function getProductById(id: string): Promise<ProductResponse | null> {
    const product = await prisma.product.findUnique({
        where: { id },
        include: productInclude,
    });

    return formatProduct(product);
}

export async function updateProduct(id: string, data: UpdateProductDto): Promise<ProductResponse | null> {
    const { quantity, ...productData } = data;

    const product = await prisma.product.update({
        where: { id },
        data: {
            ...productData,
            ...(quantity !== undefined
                ? {
                    inventory: {
                        update: {
                            quantity,
                        },
                    },
                }
                : {}),
        },
        include: productInclude,
    });

    return formatProduct(product);
}*/

/*export async function deleteProduct(id: string): Promise<ProductResponse | null> {
    const product = await prisma.product.delete({
        where: { id },
        include: productInclude,
    });

    return formatProduct(product);
}*/

/*
export async function addProductImage(id: string, newImages: string[]): Promise<ProductResponse | null> {
    const product = await prisma.product.update({
        where: { id },
        data: {
            images: {
                push: newImages,
            }
        },
        include: productInclude,
    });

    return formatProduct(product);
}*/
