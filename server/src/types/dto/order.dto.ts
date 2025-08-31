import {OrderStatus} from "@prisma/client";

export interface UpdateOrderStatusDto {
    status: OrderStatus;
}

export interface UpdateOrderDto {
    status?: OrderStatus;
    subtotal?: number;
    taxAmount?: number;
    total?: number;
}