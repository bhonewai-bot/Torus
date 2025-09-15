import {UseFormReturn} from "react-hook-form";
import {createProductFormData, updateProductFormData} from "@/features/products/utils/product.schema";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Package} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

interface ProductDimensionsProps {
    form: UseFormReturn<createProductFormData | updateProductFormData>;
}

export function ProductDimensions({ form }: ProductDimensionsProps) {
    return (
        <Accordion type={"single"} collapsible defaultValue={"product-pricing-inventory"} className={"bg-card border rounded-lg"}>
            <AccordionItem value={"product-pricing-inventory"}>
                <AccordionTrigger className={"flex items-center justify-between px-4 py-3 decoration-transparent rounded-lg transition-colors hover:bg-muted/50"}>
                    <span className={"flex items-center text-lg font-medium"}>
                        <Package className={"h-5 w-5 mr-2"} />
                        Dimensions
                    </span>
                </AccordionTrigger>
                <AccordionContent className={"px-4 py-4 border-t"}>
                    <div className={"space-y-6"}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <FormField
                                control={form.control}
                                name={"dimensions.length"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Length (cm) <span className="text-primary">*</span></FormLabel>
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
                                name={"dimensions.width"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Width (cm) <span className="text-primary">*</span></FormLabel>
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
                                name={"dimensions.height"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Height (cm) <span className="text-primary">*</span></FormLabel>
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
                                name={"dimensions.weight"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={"text-sm font-medium"}>Height (g) <span className="text-primary">*</span></FormLabel>
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
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}