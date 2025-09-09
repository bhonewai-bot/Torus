export function buildProductWhereClause(params: any) {
    const { categoryId, brand, status = "ACTIVE", search } = params;

    const where: any = { status };

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