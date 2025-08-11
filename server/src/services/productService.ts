import prisma from "@config/prisma";
import {CreateProductDto} from "@src/types/dto/CreateProductDto";
import {UpdateProductDto} from "@src/types/dto/UpdateProductDto";
import {ProductResponse} from "@src/types/ProductResponse";

const productInclude = {
    inventory: true,
};

function formatProduct(product: any): ProductResponse | null {
    if (!product) return null;
    const { inventory, ...productData } = product;
    return {
        ...productData,
        quantity: inventory?.quantity ?? 0,
    };
}

export async function getAllProducts(page = 1, limit = 10): Promise<{
    data: ProductResponse[];
    pagination: { total: number; page: number; limit: number; totalPage: number };
}> {
    const skip = (page - 1) * limit;

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: productInclude,
        }),
        prisma.product.count(),
    ]);

    return {
        data: products.map(formatProduct).filter(Boolean) as ProductResponse[],
        pagination: {
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        }
    }
}

export async function createProduct(data: CreateProductDto): Promise<ProductResponse | null> {
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
}

export async function getProductById(id: string): Promise<ProductResponse | null> {
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
}

export async function deleteProduct(id: string): Promise<ProductResponse | null> {
    const product = await prisma.product.delete({
        where: { id },
        include: productInclude,
    });

    return formatProduct(product);
}

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
}