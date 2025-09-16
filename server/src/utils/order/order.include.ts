export const orderListInclude = {
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
    _count: {
        select: { items: true },
    }
}

export const orderDetailInclude = {
    user: {
        select: {
        id: true,
        name: true,
        email: true,
        },
    },
    items: {
        include: {
            product: {
                select: {
                    id: true,
                    sku: true,
                    title: true,
                    price: true,
                    status: true,
                },
            },
        },
    },
    payments: true,
    shippingAddress: true,
};