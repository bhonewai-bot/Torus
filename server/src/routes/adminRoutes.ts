import { Router } from "express";
import productsRoute from "@routes/admin/products";

const router = Router();

router.use('/products', productsRoute);

export default router;