import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Info} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useCategories} from "@/features/categories/hooks/useCategories";
import {Textarea} from "@/components/ui/textarea";
import {UseFormReturn} from "react-hook-form";
import {CategoryCreateDialog} from "@/features/categories/components/CategoryCreateDialog";
import {createProductFormData} from "@/features/products/utils/product.schema";

interface ProductBasicInfoProps {
    form: UseFormReturn<createProductFormData>
}

export function ProductBasicInfo({ form }: ProductBasicInfoProps) {
    const { data: categories = [], isLoading } = useCategories();

    return (
        <Accordion type="single" collapsible defaultValue={"product-info"} className="bg-primary-foreground border rounded-lg">
            <AccordionItem value="product-info">
                <AccordionTrigger className="flex items-center justify-between px-4 py-3 decoration-transparent rounded-lg transition-colors hover:bg-muted/50">
                    <span className={"flex items-center text-lg font-medium"}>
                        <Info className={"h-5 w-5 mr-2"} />
                        Product Information
                    </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-4 border-t">
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
                                                placeholder="Title"
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
                                                placeholder="e.g., PROD-001"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Brand<span className="text-primary">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Brand name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 mt-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium flex justify-between">
                                            <p>Category  <span className="text-primary"> *</span></p>
                                            <CategoryCreateDialog />
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className={"w-full"}>
                                                    <SelectValue placeholder={isLoading ? "Loading..." : "Select Category"} />

                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                            className={"h-32"}
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