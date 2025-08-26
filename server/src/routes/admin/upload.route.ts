import {Router} from "express";
import {upload} from "@middlewares/multer";
import {deleteProductImage, uploadProductImages} from "@controllers/admin/upload.controller";

const router = Router();

router.post("/images", upload.array("images", 10), uploadProductImages);
router.delete("/images/:filename", deleteProductImage);

export default router;