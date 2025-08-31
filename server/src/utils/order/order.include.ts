export const orderListInclude = {
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        }
    },
    items: {
        select: {
            id: true,
            price: true,
            quantity: true,
            taxAmount: true,
            product: {
                select: {
                    id: true,
                    title: true,
                    images: {
                        select: {
                            id: true,
                            url: true,
                            isMain: true,
                        },
                        orderBy: {
                            isMain: "desc" as const
                        },
                        take: 1,
                    }
                }
            }
        }
    }
}