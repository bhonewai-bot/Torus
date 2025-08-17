"use client";

import {ReactNode, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

type Props = {
    children: ReactNode;
}

export function QueryProvider({ children }: Props) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
                gcTime: 1000 * 6 * 5,
                retry: 3,
            },
            mutations: {
                retry: 1,
            }
        }
    }));

    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
}