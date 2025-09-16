import z from "zod";

export const createAddressSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    company: z.string().optional(),
    addressLine1: z.string().min(2, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().min(6, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
    phone: z.string().optional(),
    isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export type createAddressDto = z.infer<typeof createAddressSchema>;
export type updateAddressDto = z.infer<typeof updateAddressSchema>;