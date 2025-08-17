"use client";

import {useContext, useState} from "react";
import {ConfirmDialogContext} from "@/components/providers/confirm-dialog-provider";

export function useConfirmDialog() {
    const context = useContext(ConfirmDialogContext);

    if (!context) {
        throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
    }

    return context;
}

