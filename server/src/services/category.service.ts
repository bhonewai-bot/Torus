import prisma from "@config/prisma";
import {createCategoryDto, updateCategoryDto} from "@utils/category/category.schema";

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

export async function updateCategory(id: string, data: updateCategoryDto) {
    const updatedcategory = await prisma.category.update({
        where: { id },
        data
    });

    return updatedcategory;
}

export async function deleteCategory(id:string) {
    const category = await prisma.category.delete({
        where: { id },
    });

    return category;
}