import { Router } from "express";
import productRoute from "@routes/admin/products";
import categoryRoute from "@routes/admin/category";
import inventoryRoute from "@routes/admin/inventory";
import userRoute from "@routes/admin/users";
import orderRoute from "@routes/admin/orderes"

const router = Router();

router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/inventory', inventoryRoute);
router.use('/users', userRoute);
router.use('/orders', orderRoute);

export default router;