import {OrderDetail, OrderList} from "@src/types/order.types";

export const formatOrderList = (order: any): OrderList => {
    return {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        taxAmount: order.taxAmount ?? undefined,
        total: order.total,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        user: {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
        },
        itemCount: order.itemCount,
        notes: order.notes ?? undefined,
    }
}

export const formatOrderDetail = (order: any): OrderDetail => {
    return {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        taxAmount: order.taxAmount ?? undefined,
        total: order.total,
        shippingAddress: order.shippingAddress ?? undefined,
        billingAddress: order.billingAddress ?? undefined,
        notes: order.notes ?? undefined,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        user: {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
        },
        items: order.items.map((item: any) => ({
            id: item.id,
            productSku: item.productSku,
            productTitle: item.productTitle,
            productImage: item.productImage ?? undefined,
            price: item.price,
            quantity: item.quantity,
            taxAmount: item.taxAmount ?? undefined,
            lineTotal: item.lineTotal,
            product: {
                id: item.product.id,
                sku: item.product.sku,
                title: item.product.title,
                price: item.product.price,
                isActive: item.product.isActive,
                mainImage: item.product.mainImage ?? undefined,
            }
        })),
        itemCount: order.itemCount,
        totalQuantity: order.totalQuantity
    }
}