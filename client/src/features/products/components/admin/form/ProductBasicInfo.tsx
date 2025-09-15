import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Info} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {UseFormReturn} from "react-hook-form";
import {createProductFormData, updateProductFormData} from "@/features/products/utils/product.schema";

interface ProductBasicInfoProps {
    form: UseFormReturn<createProductFormData | updateProductFormData>
}

export function ProductBasicInfo({ form }: ProductBasicInfoProps) {

    return (
        <Accordion type="single" collapsible defaultValue={"product-info"} className="bg-card shadow-sm rounded-lg dark:bg-transparent dark:text-card-foreground dark:shadow-none">
            <AccordionItem value="product-info">
                <AccordionTrigger className="flex items-center justify-between px-6 py-3 decoration-transparent rounded-lg transition-colors hover:bg-muted/50 hover:rounded-b-none">
                    <span className={"flex items-center text-lg font-medium"}>
                        <Info className={"h-5 w-5 mr-2 text-primary"} />
                        Product Information
                    </span>
                </AccordionTrigger>
                <AccordionContent className="p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Title<span className="text-primary">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Product Title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">SKU<span className="text-primary">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. PRD-001"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name={"description"}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={"text-sm font-medium"}>Description <span className="text-primary">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={"Write a product description..."}
                                            {...field}
                                            className={"h-40"}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}