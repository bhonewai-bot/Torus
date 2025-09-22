export const userDetailInclude = {
    orders: {
        select: {
            id: true,
            orderNumber: true,
            total: true,
            orderStatus: true,
            createdAt: true,
        }
    },
    addresses: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true
        }
    }
}