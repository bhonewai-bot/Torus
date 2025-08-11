import { Router } from "express";
import productsRoute from "@routes/admin/products";
import inventoryRoute from "@routes/admin/inventory";

const router = Router();

router.use('/products', productsRoute);
router.use('/inventory', inventoryRoute);

export default router;