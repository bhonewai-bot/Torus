import {UseFormReturn} from "react-hook-form";
import {createProductFormData} from "@/features/products/utils/product.schema";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {DollarSign} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";

interface ProductPricingInventoryProps {
    form: UseFormReturn<createProductFormData>;
}

export function ProductPricingInventory({ form }: ProductPricingInventoryProps) {
    return (
        <Accordion type={"single"} collapsible defaultValue={"product-pricing-inventory"} className={"bg-primary-foreground border rounded-lg"}>
            <AccordionItem value={"product-pricing-inventory"}>
                <AccordionTrigger className={"flex items-center justify-between px-4 py-3 decoration-transparent rounded-lg transition-colors hover:bg-muted/50"}>
                    <span className={"flex items-center text-lg font-medium"}>
                        <DollarSign className={"h-5 w-5 mr-2"} />
                        Pricing & Inventory
                    </span>
                </AccordionTrigger>
                <AccordionContent className={"px-4 py-4 border-t"}>
                    <div className={"space-y-6"}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name={"pricing.price"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Price <span className="text-primary">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type={"number"}
                                                step={"0.01"}
                                                placeholder={"0.00"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={"text-xs text-red-500 mt-1"} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"pricing.salePrice"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Sale Price <span className="text-primary">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type={"number"}
                                                step={"0.01"}
                                                placeholder={"0.00"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={"text-xs text-red-500 mt-1"} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"pricing.regularPrice"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Regular Price <span className="text-primary">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type={"number"}
                                                step={"0.01"}
                                                placeholder={"0.00"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={"text-xs text-red-500 mt-1"} />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name={"inventory.quantity"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Quantity <span className="text-primary">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type={"number"}
                                                placeholder={"0"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={"text-xs text-red-500 mt-1"} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"pricing.taxRate"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Tax Rate (%) <span className="text-primary">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type={"number"}
                                                step={"0.01"}
                                                placeholder={"0"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className={"text-xs text-red-500 mt-1"} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"pricing.taxIncluded"}
                                render={({ field }) => (
                                    <FormItem className={"flex flex-row items-center justify-between bg-primary-foreground rounded-lg border p-3"}>
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm font-medium">Tax Included <span className="text-primary">*</span></FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Is tax included in the price?
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}