export const productListInclude = {
    category: {
        select: {
            id: true,
            title: true
        }
    },
    images: {
        select: {
            id: true,
            url: true,
            isMain: true
        },
        where: {
            isMain: true
        },
        take: 1
    }
};

export const productDetailInclude = {
    category: {
        select: {
            id: true,
            title: true
        }
    },
    images: {
        select: {
            id: true,
            url: true,
            isMain: true
        },
        orderBy: {
            isMain: 'desc' as const
        }
    }
};