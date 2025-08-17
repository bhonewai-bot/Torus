"use client";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {createContext, ReactNode, useState} from "react";

interface ConfirmDialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
}

interface ConfirmDialogContextType {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

export const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = (opts: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions({
                confirmText: 'Confirm',
                cancelText: 'Cancel',
                variant: 'default',
                ...opts,
            });
            setResolvePromise(() => resolve);
            setIsOpen(true);
        });
    };

    const handleConfirm = () => {
        resolvePromise?.(true);
        setIsOpen(false);
        setOptions(null);
        setResolvePromise(null);
    };

    const handleCancel = () => {
        resolvePromise?.(false);
        setIsOpen(false);
        setOptions(null);
        setResolvePromise(null);
    };

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}

            {/* Global Dialog */}
            <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{options?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {options?.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>
                            {options?.cancelText || 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={
                                options?.variant === 'destructive'
                                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    : ''
                            }
                        >
                            {options?.confirmText || 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmDialogContext.Provider>
    );
}