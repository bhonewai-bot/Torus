"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useCreateCategory} from "@/features/categories/hooks/useCategories";
import {Plus} from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";

export function CategoryCreateDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState("");
    const { mutate: createCategory, isPending } = useCreateCategory();


    const handleSubmit = () => {
        if (!categoryName.trim()) {
            setError("Category name is required");
            return;
        }

        if (categoryName.trim().length > 100) {
            setError("Category name is too long");
            return;
        }

        setError("");

        createCategory({ title: categoryName.trim() }, {
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

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"sm"} className={"hover:bg-transparent p-0"}>
                    <Plus /> New Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label aria-label="categoryName">Category Name</Label>
                        <Input
                            id="categoryName"
                            placeholder="Enter category name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
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
                    
                    <div className="flex gap-2 pt-4">
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
                            disabled={isPending}
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