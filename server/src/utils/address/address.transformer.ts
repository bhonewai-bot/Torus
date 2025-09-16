import { Address, ShippingAddress } from "@src/types/address.types";

export function formatAddress(address: any): Address {
    return {
        id: address.id,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company ?? undefined,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 ?? undefined,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone ?? undefined,
        isDefault: address.isDefault,
        createdAt: address.createdAt.toISOString(),
        updatedAt: address.updatedAt.toISOString(),
    }
}

export function formatShippingAddress(address: any): ShippingAddress {
    return {
        fullName: `${address.firstName} ${address.lastName}`,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 ?? undefined,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone ?? undefined
    }
}