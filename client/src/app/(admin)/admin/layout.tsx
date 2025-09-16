/* import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import {ThemeProvider} from "@/components/providers/theme-provider";
import React from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import {AdminSidebar} from "@/components/layout/AdminSidebar";
import {cookies} from "next/headers";
import {AdminNavbar} from "@/components/layout/AdminNavbar";
import {QueryProvider} from "@/components/providers/query-provider";
import {ConfirmDialogProvider} from "@/components/providers/confirm-dialog-provider";
import {Toaster} from "sonner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Admin - Torus",
    description: "Torus Admin Panel",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let defaultOpen = true;

    try {
        const cookieStore = await cookies();
        const sidebarState = cookieStore.get("sidebar_state")?.value;
        defaultOpen = sidebarState === undefined ? true : sidebarState === "true";
    } catch (error) {
        // Fallback to default if cookies fail
        console.warn('Failed to read sidebar_state cookie:', error);
    }

    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
        >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <QueryProvider>
                    <ConfirmDialogProvider>
                        <SidebarProvider defaultOpen={defaultOpen}>
                            <ErrorBoundary>
                                <AdminSidebar />
                                <main className={"w-full"}>
                                    <AdminNavbar />
                                    <div className={"px-6"}>
                                        {children}
                                        <Toaster
                                            position={"bottom-right"}
                                            richColors
                                        />
                                    </div>
                                </main>
                            </ErrorBoundary>
                        </SidebarProvider>
                    </ConfirmDialogProvider>
                </QueryProvider>
            </ThemeProvider>
        </body>
        </html>
    );
}
 */

import type { Metadata } from "next";
import {ThemeProvider} from "@/components/providers/theme-provider";
import React from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import {AdminSidebar} from "@/components/layout/AdminSidebar";
import {cookies} from "next/headers";
import {AdminNavbar} from "@/components/layout/AdminNavbar";
import {QueryProvider} from "@/components/providers/query-provider";
import {ConfirmDialogProvider} from "@/components/providers/confirm-dialog-provider";
import {Toaster} from "sonner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export const metadata: Metadata = {
    title: "Admin - Torus",
    description: "Torus Admin Panel",
};

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let defaultOpen = true;

    try {
        const cookieStore = await cookies();
        const sidebarState = cookieStore.get("sidebar_state")?.value;
        defaultOpen = sidebarState === undefined ? true : sidebarState === "true";
    } catch (error) {
        console.warn('Failed to read sidebar_state cookie:', error);
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <ConfirmDialogProvider>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        
                            <AdminSidebar />
                            <main className={"w-full"}>
                                <AdminNavbar />
                                <div className={"px-6"}>
                                    <ErrorBoundary>
                                        {children}
                                    </ErrorBoundary>
                                    {<Toaster
                                        position={"bottom-center"}
                                        richColors
                                    />}
                                </div>
                            </main>
                    </SidebarProvider>
                </ConfirmDialogProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}