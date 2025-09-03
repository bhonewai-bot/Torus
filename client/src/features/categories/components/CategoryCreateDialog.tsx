import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export function CategoryCreateDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"sm"} className={"h-auto p-0 text-blue-500"}>
                    + New Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>

                {/* Form for creating new category */}
                <div className="space-y-3">
                    <Input
                        type="text"
                        placeholder="Category name"
                    />
                    <Button className="w-full">Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}