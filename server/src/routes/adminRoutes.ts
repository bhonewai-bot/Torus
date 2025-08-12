import { Router } from "express";
import productsRoute from "@routes/admin/products";
import inventoryRoute from "@routes/admin/inventory";
import userRoute from "@routes/admin/users";
import orderRoute from "@routes/admin/orderes"

const router = Router();

router.use('/products', productsRoute);
router.use('/inventory', inventoryRoute);
router.use('/users', userRoute);
router.use('/orders', orderRoute);

export default router;