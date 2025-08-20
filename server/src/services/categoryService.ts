import prisma from "@config/prisma";
import {CategoryListItem, CategorySelectItem} from "@src/types/CategoryResponse";
import {CreateCategoryDto} from "@src/types/dto/category/CreateCategoryDto";

export async function getCategoriesForSelect(): Promise<CategorySelectItem[]> {
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

export async function createCategory(data: CreateCategoryDto): Promise<CategorySelectItem> {
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

export async function getAllCategories(): Promise<CategoryListItem[]> {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            title: true,
            _count: {
                select: {
                    products: {
                        where: {
                            isActive: true,
                        }
                    }
                }
            }
        }
    });

    return categories.map((category) => ({
        id: category.id,
        title: category.title,
        productCount: category._count.products,
    }));
}