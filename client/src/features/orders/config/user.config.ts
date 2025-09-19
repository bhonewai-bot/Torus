import { orderKeys } from "../lib/order.query.keys";

export const orderUpdateConfig = {
    status: {
        queryKeys: orderKeys,
        successMessage: "Order status updated successfully",
        listDataPath: "orders",
        mutationKey: "updateOrderStatus"
    }
} as const;