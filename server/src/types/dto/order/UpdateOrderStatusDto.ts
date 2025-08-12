import {OrderStatus} from "@prisma/client";

export interface UpdateOrderStatusDto {
    status: OrderStatus;
}