export function buildUserWhereClause(params: any) {
    const { name, email, search } = params;

    const where: any = {};

    if (name) {
        where.name = name;
    }

    if (email) {
        where.email = email;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ]
    }

    return where;
}