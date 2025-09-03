import prisma from "@config/prisma";
import {CreateCategoryDto} from "@src/types/dto/category/CreateCategoryDto";
import {createCategoryDto} from "@utils/category/category.schema";

export async function getAllCategories() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            title: true,
        },
        orderBy: {
            title: "asc",
        }
    });

    return categories;
}

export async function createCategory(data: createCategoryDto) {
    const category = await prisma.category.create({
        data: {
            title: data.title,
        },
        select: {
            id: true,
            title: true,
        }
    });

    return category;
}