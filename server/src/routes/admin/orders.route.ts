import {Router} from "express";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    postgresIdPathSchema,
    updateOrderStatusSchema,
} from "@utils/validation";
import {getAllOrders, getOrderById, updateOrder} from "@controllers/admin/order.controller";
import {orderQuerySchema} from "@utils/order/order.schema";

const router = Router();

router.get('/', validateQuery(orderQuerySchema), getAllOrders);
router.get('/:id', validateParams(postgresIdPathSchema), getOrderById);
router.patch('/:id/', validateParams(postgresIdPathSchema), validateBody(updateOrderStatusSchema), updateOrder);
// router.post('/:id/refund', validateParams(postgresIdPathSchema), refundOrder);

export default router;
