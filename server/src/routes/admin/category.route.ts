import {Router} from "express";
import {createCategory, getAllCategories} from "@controllers/admin/category.controller";
import {validateBody} from "@middlewares/validation";
import {createCategorySchema} from "@utils/validation";

const route = Router();

route.get("/", getAllCategories);
route.post("/", validateBody(createCategorySchema), createCategory);

export default route;