import {Order} from "@src/types/order.types";

export const formatOrder = (order: any): Order => {
    return {
        id: order.id,
        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        user: {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
        },
        items: order.items.map((item: any) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            taxAmount: item.taxAmount,
            product: {
                id: item.product.id,
                title: item.product.title,
                mainImage: item.product.images?.[0]?.url,
            }
        }))
    }
}