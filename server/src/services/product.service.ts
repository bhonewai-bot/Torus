
import {calculatePagination} from "@utils/helpers";
import {productDetailInclude, productListInclude} from "@utils/product/product.include";
import {buildProductWhereClause} from "@utils/product/product.helpers";
import {deleteImageFiles, findImagesToDelete, splitImages} from "@utils/image.helpers";
import { formatProductDetail, formatProductList } from "@src/utils/product/product.transformer";
import prisma from "@config/prisma";
import {Prisma} from "@prisma/client";
import {createProductDto, updateProductDto, updateProductImageDto} from "@utils/product/product.schema";
import {ProductDetail} from "@src/types/product.types";
import { ErrorFactory } from "@src/lib/errors";

export interface GetAllProductsParams {
    page?: number;
    limit?: number;
    categoryId?: string;
    status?: boolean;
    search?: string;
    sortBy?: "title" | "price" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}

export async function getAllProducts(params: GetAllProductsParams = {}) {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = params;
    
        const where = buildProductWhereClause(params);
    
        if (limit === -1) {
            const products = await prisma.product.findMany({
                where,
                include: productListInclude,
                orderBy: {
                    [sortBy]: sortOrder,
                }
            });
    
            const formattedProducts = products.map(formatProductList);
            const pagination = calculatePagination(products.length, page, -1);
    
            return {
                products: formattedProducts,
                pagination
            }
        }
    
        const skip = (page - 1) * limit;
    
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
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error);
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}

export async function getProductById(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: productDetailInclude,
        });

        if (!product) {
            return null;
        }
    
        return formatProductDetail(product);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw ErrorFactory.fromPrismaError(error, undefined, {
                opeartion: "getProductById",
                productId: id,
            });
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}

export async function createProduct(data: createProductDto): Promise<ProductDetail | undefined> {
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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw ErrorFactory.createError(
                    "SKU already exists. Please use a different one",
                    409,
                    "SKU_ALREADY_EXISTS",
                );
            }
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: "createProduct",
                productData: data,
            })
        }
    }
}

export async function updateProduct(id: string, data: updateProductDto): Promise<ProductDetail | null> {
    try {
        const { images = [], ...productData } = data;

        const existedProduct = await prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!existedProduct) {
            return null;
        }

        const { existingImages, newImages, existingImagesId } = splitImages(images as updateProductImageDto[]);

        const imagesToDelete = findImagesToDelete(existedProduct.images, existingImagesId);

        await deleteImageFiles(imagesToDelete);

        const updatedProduct = await prisma.$transaction(async (tx) => {
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

            const product = await tx.product.update({
                where: { id },
                data: productData,
                include: { images: true },
            });

            return tx.product.findUnique({
                where: {id},
                include: productDetailInclude,
            });
        });

        if (!updatedProduct) {
            throw ErrorFactory.createError(
                "Failed to update product",
                500,
                "PRODUCT_UPDATE_FAILED",
            );
        }

        return formatProductDetail(updatedProduct);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw ErrorFactory.createError(
                    "SKU already exists. Please use a different one",
                    409,
                    'SKU_ALREADY_EXISTS',
                )
            }
            if (error.code === 'P2025') {
                return null;
            }
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: 'updateProduct',
                productId: id,
                updateData: data,
            });
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}



export async function deleteProduct(id: string) {
    try {
        const productWithImages = await prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!productWithImages) {
            return null;
        }

        if (productWithImages.images && productWithImages.images.length > 0) {
            await deleteImageFiles(productWithImages.images);
        }

        const deletedProduct = await prisma.product.delete({
            where: { id },
        });

        return deletedProduct;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return null;
            }
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: 'deleteProduct',
                productId: id,
            });
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}

export async function bulkDeleteProducts(ids: string[]) {
    try {
        const productsWithImages = await prisma.product.findMany({
            where: { id: { in: ids } },
            include: { images: true },
        });

        if (!productsWithImages) {
            return null;
        }

        const allImages = productsWithImages.flatMap((product) => product.images ?? []);
        if (allImages.length > 0) {
            await deleteImageFiles(allImages);
        }

        const deleteProducts  = await prisma.product.deleteMany({
            where: { id: { in: ids } },
        });

        return deleteProducts.count;
    } catch(error) {    
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return null;
            }
            throw ErrorFactory.fromPrismaError(error, undefined, {
                operation: "bulkDeleteProducts",
                productIds: ids
            });
        }
        throw ErrorFactory.fromUnknownError(error);
    }
}
