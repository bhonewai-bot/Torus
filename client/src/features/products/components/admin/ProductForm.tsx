"use client";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useCreateProduct} from "@/features/products/hooks/useProducts";
import {CreateProductDto} from "@/features/products/types/product.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import {Label} from "@/components/ui/label";

const formSchema = z.object({
    name: z.string()
        .min(2, "Product name must be at least 2 characters")
        .max(100, "Product name must be less than 100 characters"),
    sku: z.string()
        .min(1, "SKU is required")
        .max(30, "SKU must be less than 30 characters"),
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),
    price: z.coerce.number()
        .min(0.01, "Price must be greater than 0")
        .max(999999.99, "Price must be less than 1,000,000"),
    categories: z.array(z.string())
        .min(1, "At least one category is required"),
    images: z.array(z.string().url("Invalid image URL"))
        .optional()
        .default([]),
    quantity: z.coerce.number()
        .int("Quantity must be a whole number")
        .min(0, "Quantity cannot be negative"),
});

type FormData = z.infer<typeof formSchema>;

interface ProductFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
    const [categoryInput, setCategoryInput] = useState("");
    const [imageInput, setImageInput] = useState("");

    const createProductMutation = useCreateProduct();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            sku: "",
            description: "",
            price: 0,
            categories: [],
            images: [],
            quantity: 0,
        }
    });

    const categories = form.watch("categories");
    const images = form.watch("images");

    const handleAddCategory = () => {
        const trimmedCategory = categoryInput.trim();
        if (trimmedCategory && !categories.includes(trimmedCategory)) {
            form.setValue("categories", [...categories, trimmedCategory]);
            setCategoryInput("");
        }
    };

    const handleRemoveCategory = (categoryToRemove: string) => {
        form.setValue("categories", categories.filter(cat => cat !== categoryToRemove));
    };

    const handleAddImage = () => {
        const trimmedImage = imageInput.trim();
        if (trimmedImage && !images.includes(trimmedImage)) {
            try {
                new URL(trimmedImage); // Validate URL
                form.setValue("images", [...images, trimmedImage]);
                setImageInput("");
            } catch {
                form.setError("images", { message: "Please enter a valid URL" });
            }
        }
    };

    const handleRemoveImage = (imageToRemove: string) => {
        form.setValue("images", images.filter(img => img !== imageToRemove));
    };

    const onSubmit = async (data: FormData) => {
        try {
            const productData: CreateProductDto = {
                ...data,
                categories: data.categories,
                images: data.images?.length ? data.images : undefined,
            }

            await createProductMutation.mutateAsync(productData);

            form.reset();
            setCategoryInput("");
            setImageInput("");

            onSuccess?.();
        } catch (error) {
            console.error("Form submission error:", error);
        }
    }

    const isLoading = createProductMutation.isPending;

    return (
        <Card className={""}>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Enter product name"
                                                    disabled={isLoading}
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SKU *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="e.g., PROD-001"
                                                    disabled={isLoading}
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (฿) *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    disabled={isLoading}
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Quantity *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    disabled={isLoading}
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                    <Label>Categories</Label>
                                    <Input
                                        placeholder="Add category"
                                        value={categoryInput}
                                        onChange={(e) => setCategoryInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                        disabled={isLoading}
                                    />
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="icon"
                                    onClick={handleAddCategory}
                                    disabled={isLoading || !categoryInput.trim()}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {category}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCategory(category)}
                                                disabled={isLoading}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <FormMessage>{form.formState.errors.categories?.message}</FormMessage>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Product Images</h3>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add image URL"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                                    disabled={isLoading}
                                />
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="icon"
                                    onClick={handleAddImage}
                                    disabled={isLoading || !imageInput.trim()}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            {images.length > 0 && (
                                <div className="space-y-2">
                                    {images.map((image, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                            <span className="flex-1 text-sm truncate">{image}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveImage(image)}
                                                disabled={isLoading}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <FormMessage>{form.formState.errors.images?.message}</FormMessage>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Enter product description (optional)"
                                                className="min-h-[100px]"
                                                disabled={isLoading}
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6">
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="min-w-[120px]"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? "Creating..." : "Create Product"}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>     
                </Form>
            </CardContent>
        </Card>
    );
}