import {OrderDetail, OrderItem, OrderList} from "@src/types/order.types";
import { formatUser } from "../user/user.transformer";
import { formatShippingAddress } from "../address/address.transformer";
import { formatPayment } from "../payment/payment.transformer";

export const formatOrderItem = (item: any): OrderItem => {
    return {
        id: item.id,
        productId: item.productId,
        productSku: item.productSku,
        productTitle: item.productTitle,
        productImage: item.productImage ?? undefined,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        product: {
            id: item.product.id,
            sku: item.product.sku,
            title: item.product.title,
            price: item.product.price,
            status: item.product.status,
        }
    }
}

export const formatOrderList = (order: any): OrderList => {
    return {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        orderStatus: order.orderStatus,
        user: formatUser(order.user),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
    }
}

export const formatOrderDetail = (order: any): OrderDetail => {
    return {
        id: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        user: formatUser(order.user),
        items: order.items.map(formatOrderItem),
        pricing: {
            subtotal: order.subtotal,
            taxAmount: order.taxAmount,
            shippingAmount: order.shippingAmount,
            discountAmount: order.discountAmount,
            total: order.total
        },
        shippingAddress: order.shippingAddress ? formatShippingAddress(order.shippingAddress) : undefined,
        payments: order.payments.map(formatPayment),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
    }
}