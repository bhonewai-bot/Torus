import {Router} from "express";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    postgresIdPathSchema,
} from "@utils/validation";
import {getAllOrders, getOrderById, updateOrderStatus} from "@controllers/admin/order.controller";
import {orderQuerySchema, updateOrderStatusSchema} from "@utils/order/order.schema";

const router = Router();

router.get('/', validateQuery(orderQuerySchema), getAllOrders);
router.get('/:id', validateParams(postgresIdPathSchema), getOrderById);
router.patch('/:id/status', validateParams(postgresIdPathSchema), validateBody(updateOrderStatusSchema), updateOrderStatus);
// router.post('/:id/refund', validateParams(postgresIdPathSchema), refundOrder);

export default router;
