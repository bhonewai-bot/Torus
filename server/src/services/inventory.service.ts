import prisma from "@config/prisma";
import {InventoryResponse} from "@src/types/InventoryResponse";
import {UpdateInventoryDto} from "@src/types/dto/inventory/UpdateInventoryDto";
import {BulkInventoryUpdateDto} from "@src/types/dto/inventory/BulkInventoryUpdateDto";

export async function getAllInventory(): Promise<InventoryResponse[]> {
    const inventory = await prisma.inventory.findMany({
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                }
            }
        },
        orderBy: { updatedAt: 'desc' },
    });

    return inventory.map((item) => ({
        ...item,
    }));
}

export async function updateInventory(productId: string, data: UpdateInventoryDto): Promise<InventoryResponse | null> {
    const { quantity } = data

    const inventory = await prisma.inventory.update({
        where: { productId },
        data: {
            ...(quantity !== undefined ? { quantity } : {}),
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                }
            }
        }
    });

    return {
        ...inventory
    };
}

export async function getLowStockInventory(threshold = 5): Promise<InventoryResponse[]> {
    const lowStockItems = await prisma.inventory.findMany({
        where: {
            quantity: {
                lte: threshold,
            }
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                }
            }
        },
        orderBy: {
            quantity: 'asc',
        }
    });

    return lowStockItems.map((item) => ({
        ...item
    }));
}

export async function bulkUpdateInventory(data: BulkInventoryUpdateDto): Promise<InventoryResponse[]> {
    const updates = data.updates.map(({ productId, quantity }) =>
        prisma.inventory.update({
            where: { productId },
            data: { quantity },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        price: true
                    }
                }
            }
        })
    );

    const results = await prisma.$transaction(updates);
    return results;
}