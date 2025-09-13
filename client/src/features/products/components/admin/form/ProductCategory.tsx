import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryCreateDialog } from "@/features/categories/components/CategoryCreateDialog";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useProduct } from "@/features/products/hooks/useProducts";
import { PRODUCT_STATUSES } from "@/features/products/types/product.types";
import { createProductFormData, updateProductFormData } from "@/features/products/utils/product.schema";
import { UseFormReturn } from "react-hook-form";

interface ProductCategoryProps {
    form: UseFormReturn<createProductFormData | updateProductFormData>
}

export function ProductCategory({ form }: ProductCategoryProps) {
    const { data: products = [] } = useProduct();
    const { data: categories = [], isLoading } = useCategories();

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium flex justify-between">
                                <p>Status  <span className="text-primary"> *</span></p>
                            </FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={"w-full"}>
                                        <SelectValue placeholder={isLoading ? "Loading..." : "Select Category"} />

                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRODUCT_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                <div className="flex items-center gap-2">
                                                    <div 
                                                        className={`w-2 h-2 rounded-full ${
                                                            status === 'ACTIVE' 
                                                                ? 'bg-green-500' 
                                                                : 'bg-gray-400'
                                                        }`}
                                                    />
                                                    {status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                                </div>
                                            </SelectItem>
                                        ))}
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
            </CardContent>
        </Card>
    )
}