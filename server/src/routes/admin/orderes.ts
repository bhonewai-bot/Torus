import {Router} from "express";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    paginationQuerySchema,
    postgresIdPathSchema,
    updateOrderStatusSchema,
} from "@utils/validation";
import {getAllOrders, getOrderById, refundOrder, updateOrderStatus} from "@controllers/admin/orderController";

const router = Router();

router.get('/', validateQuery(paginationQuerySchema), getAllOrders);
router.get('/:id', validateParams(postgresIdPathSchema), getOrderById);
router.put('/:id/status', validateParams(postgresIdPathSchema), validateBody(updateOrderStatusSchema), updateOrderStatus);
router.post('/:id/refund', validateParams(postgresIdPathSchema), refundOrder);

export default router;