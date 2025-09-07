"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useCreateCategory} from "@/features/categories/hooks/useCategories";

interface CategoryCreateDialogProps {
    children?: React.ReactNode;
}

export function CategoryCreateDialog({ children }: CategoryCreateDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState("");
    const { mutate: createCategory, isPending } = useCreateCategory();

    const validateInput = (name: string): string | null => {
        if (!name.trim()) {
            return "Category name is required";
        }
        if (name.trim().length < 2) {
            return "Category name must be at least 2 characters";
        }
        if (name.trim().length > 100) {
            return "Category name must be less than 100 characters";
        }
        return null;
    };

    const handleSubmit = () => {
        const validationError = validateInput(categoryName);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        createCategory(
            { title: categoryName.trim() },
            {
            onSuccess: () => {
                setIsOpen(false);
                setCategoryName("");
                setError("");
            },
            onError: (error: any) => {
                setError(error.message || "Failed to create category");
            }
        });
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setCategoryName("");
            setError("");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
        if (error) setError(""); // Clear error when user starts typing
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <button className="font-medium hover:underline text-[13px] text-primary">
                        Add New Category
                    </button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            id="categoryName"
                            placeholder="Enter category name"
                            value={categoryName}
                            onChange={handleInputChange}
                            disabled={isPending}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsOpen(false)}
                            disabled={isPending}
                            className="flex-0"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending || !categoryName.trim()}
                            className="flex-0"
                        >
                            {isPending ? "Creating..." : "Create Category"}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}