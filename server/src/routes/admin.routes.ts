import { Router } from "express";
import productRoute from "@routes/admin/products.route";
import categoryRoute from "@routes/admin/category.route";
import inventoryRoute from "@routes/admin/inventory.route";
import userRoute from "@routes/admin/users.route";
import orderRoute from "@routes/admin/orders.route"
import uploadRoute from "@routes/admin/upload.route";

const router = Router();

router.use('/products', productRoute);
router.use('/uploads', uploadRoute);
router.use('/categories', categoryRoute);
router.use('/inventory', inventoryRoute);
router.use('/users', userRoute);
router.use('/orders', orderRoute);

export default router;