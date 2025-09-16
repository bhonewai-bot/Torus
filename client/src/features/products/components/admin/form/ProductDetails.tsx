import {UseFormReturn} from "react-hook-form";
import {createProductFormData, updateProductFormData} from "@/features/products/utils/product.schema";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {DollarSign} from "lucide-react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCT_STATUSES } from "@/features/products/types/product.types";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { CategoryCreateDialog } from "@/features/categories/components/CategoryCreateDialog";

interface ProductDetailsProps {
    form: UseFormReturn<createProductFormData | updateProductFormData>;
}

export function ProductDetails({ form }: ProductDetailsProps) {
    const { data: categories = [], isLoading } = useCategories();
    
    return (
        <Accordion type={"single"} collapsible defaultValue={"product-pricing-inventory"} className={"bg-card shadow-sm rounded-lg dark:bg-transparent dark:text-card-foreground dark:shadow-none"}>
            <AccordionItem value={"product-pricing-inventory"}>
                <AccordionTrigger className={"flex items-center justify-between px-6 py-3 decoration-transparent rounded-lg transition-colors hover:bg-muted/50 hover:rounded-b-none"}>
                    <span className={"flex items-center text-lg font-medium"}>
                        <DollarSign className={"h-5 w-5 mr-2 text-primary"} />
                        Pricing & Inventory
                    </span>
                </AccordionTrigger>
                <AccordionContent className={"p-6"}>
                    <div className={"space-y-6"}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name={"price"}
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
                                name={"quantity"}
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium flex justify-between">
                                            <p>Status <span className="text-primary"> *</span></p>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className={"w-full"}>
                                                    <SelectValue placeholder={isLoading ? "Loading..." : "Select Status"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PRODUCT_STATUSES.map((status) => {
                                                        const getStatusColor = (status: string) => {
                                                            switch (status) {
                                                                case 'ACTIVE':
                                                                    return 'bg-green-500';
                                                                case 'INACTIVE':
                                                                    return 'bg-red-500';
                                                                case 'DISCONTINUED':
                                                                    return 'bg-gray-500';
                                                                default:
                                                                    return 'bg-gray-400';
                                                            }
                                                        };
                                                        
                                                        const getStatusLabel = (status: string) => {
                                                            switch (status) {
                                                                case 'ACTIVE':
                                                                    return 'Active';
                                                                case 'INACTIVE':
                                                                    return 'Inactive';
                                                                case 'DISCONTINUED':
                                                                    return 'Discontinued';
                                                                default:
                                                                    return status;
                                                            }
                                                        };
                                                        
                                                        return (
                                                            <SelectItem key={status} value={status}>
                                                                <div className="flex items-center gap-2">
                                                                    <div 
                                                                        className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
                                                                    />
                                                                    {getStatusLabel(status)}
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
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
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}