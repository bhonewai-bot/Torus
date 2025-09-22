import {Router} from "express";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    postgresIdPathSchema,
} from "@utils/validation";
import {getOrders, getOrder, updateOrderStatus} from "@controllers/admin/order.controller";
import {orderQuerySchema, updateOrderStatusSchema} from "@utils/order/order.schema";

const router = Router();

router.get('/', validateQuery(orderQuerySchema), getOrders);
router.get('/:id', validateParams(postgresIdPathSchema), getOrder);
router.patch('/:id/status', validateParams(postgresIdPathSchema), validateBody(updateOrderStatusSchema), updateOrderStatus);

export default router;
