export function buildProductWhereClause(params: any) {
    const { categoryId, brand, isActive = true, search } = params;

    const where: any = { isActive };

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (brand) {
        where.brand = {
            contains: brand,
            mode: "insensitive",
        }
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } }
        ];
    }

    return where;
}