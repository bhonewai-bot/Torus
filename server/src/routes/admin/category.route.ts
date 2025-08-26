import {Router} from "express";
import {createCategory, getAllCategories, getCategoriesForSelect} from "@controllers/admin/category.controller";
import {validateBody} from "@middlewares/validation";
import {createCategorySchema} from "@utils/validation";

const route = Router();

route.get("/select", getCategoriesForSelect);
route.post("/", validateBody(createCategorySchema), createCategory);
route.get("/", getAllCategories);

export default route;