import {Router} from "express";
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts
} from "@controllers/admin/product.controller";
import {validateBody, validateParams, validateQuery} from "@middlewares/validation";
import {
    postgresIdPathSchema,
} from "@utils/validation";
import {bulkDeleteProductsSchema, createProductSchema, productQuerySchema, updateProductSchema} from "@utils/product/product.schema";

const router = Router();

router.get('/', validateQuery(productQuerySchema), getProducts);
router.get('/:id', validateParams(postgresIdPathSchema), getProduct);
router.post('/', validateBody(createProductSchema), createProduct);
router.put('/:id', validateParams(postgresIdPathSchema), validateBody(updateProductSchema), updateProduct);
router.post('/bulk-delete', validateBody(bulkDeleteProductsSchema), bulkDeleteProducts);
router.delete('/:id', validateParams(postgresIdPathSchema), deleteProduct);

export default router;