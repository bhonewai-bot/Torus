import {OrderResponse} from "@src/types/OrderResponse";
import prisma from "@config/prisma";
import {UpdateOrderStatusDto} from "@src/types/dto/order/UpdateOrderStatusDto";

function formatOrder(order: any): OrderResponse | null {
    if (!order) return null;

    const { user, items, ...orderData } = order;

    return {
        ...orderData,
        userId: order.userId,
        userName: user?.name ?? '',
        userEmail: user?.email ?? '',
        items: items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product?.name ?? '',
            price: item.price ?? 0,
            quantity: item.quantity
        })),
    }
}

export async function getAllOrders(page = 1, limit = 10): Promise<{
    data: OrderResponse[];
    pagination: { total: number; page: number; limit: number; totalPages: number  }
}> {
    const skip = (page - 1) * limit;

    const [orders, total] = await prisma.$transaction([
        prisma.order.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
        }),
        prisma.order.count(),
    ]);

    return {
        data: orders.map(formatOrder).filter(Boolean) as OrderResponse[],
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }
}

export async function getOrderById(id: string): Promise<OrderResponse | null> {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });

    return formatOrder(order) ?? null;
}

export async function updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<OrderResponse | null> {
    const { status } = data;

    const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });

    return formatOrder(order) ?? null;
}

export async function refundOrder(id: string): Promise<OrderResponse | null> {
    const order = await prisma.order.update({
        where: { id },
        data: {
            status: 'REFUNDED',
            refunded: true,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            }
        }
    });

    return formatOrder(order) ?? null;
}