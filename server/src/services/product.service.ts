import {calculatePagination} from "@utils/helpers";
import prisma, { Prisma } from "@config/prisma";
import {productDetailInclude, productListInclude} from "@utils/product/product.include";
import {buildProductWhereClause} from "@utils/product/product.helpers";
import {ProductDetailItem} from "@src/types/product.types";
import {deleteImageFiles, findImagesToDelete, splitImages} from "@utils/image.helpers";
import { formatProductDetail, formatProductList } from "@src/utils/product/product.transformer";
import {CreateProductDto, UpdateProductDto, UpdateProductImageDto} from "@src/types/dto/product.dto";

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
    try {
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
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new Error("SKU already exists. Please use a different one");
        }
        throw error;
    }
}

export async function updateProduct(id: string, data: UpdateProductDto): Promise<ProductDetailItem | null> {
    try {
        const { images = [], ...productData } = data;

        const existedProduct = await prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!existedProduct) {
            throw new Error("Product not found");
        }

        const { existingImages, newImages, existingImagesId } = splitImages(images as UpdateProductImageDto[]);

        const imagesToDelete = findImagesToDelete(existedProduct.images, existingImagesId);

        await deleteImageFiles(imagesToDelete);

        /*let updateData: any = productData;*/

        const updatedProduct = await prisma.$transaction(async (tx) => {
            const product = await tx.product.update({
                where: { id },
                data: productData,
                include: { images: true },
            });

            if (imagesToDelete.length > 0) {
                await tx.productImage.deleteMany({
                    where: { id: { in: imagesToDelete.map((img) => img.id) } },
                });
            }

            await Promise.all(
                existingImages.map((img) =>
                    tx.productImage.update({
                        where: { id: img.id },
                        data: { isMain: img.isMain },
                    })
                )
            );

            if (newImages.length > 0) {
                await tx.productImage.createMany({
                    data: newImages.map((img) => ({
                        productId: id,
                        url: img.url,
                        isMain: img.isMain,
                    }))
                });
            }

            return tx.product.findUnique({
                where: {id},
                include: productDetailInclude,
            });
        });

        if (!updatedProduct) throw new Error("Failed to update product");

        return formatProductDetail(updatedProduct);
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new Error("SKU already exists. Please use a different one");
        }
        throw error;
    }
}

export async function deleteProduct(id: string) {
    try {
        const productWithImages = await prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!productWithImages) {
            throw new Error("Product not found");
        }

        if (productWithImages.images && productWithImages.images.length > 0) {
            await deleteImageFiles(productWithImages.images);
        }

        const deletedProduct = await prisma.product.delete({
            where: { id },
            include: productDetailInclude,
        });

        return formatProductDetail(deletedProduct);
    } catch (error) {
        // If it's a Prisma error for record not found
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error("Product not found");
        }
        throw error;
    }
}