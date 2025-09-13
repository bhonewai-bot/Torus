"use client";

import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    ChevronUp,
    LayoutDashboard,
    Package,
    ReceiptText, ShoppingBag,
    User2,
    Users
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { ClientOnly } from "../common/ClientOnly";

export function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + "/");
    }

    return (
        <Sidebar collapsible={"icon"}>
            <SidebarHeader className={"py-4"}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/admin"}>
                                <Image src={"/Torus.svg"} alt={"Logo"} width={36} height={36} />
                                <span className={"text-lg font-semibold font-stretch-extra-expanded"}>Torus</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {/*<SidebarSeparator />*/}
            <SidebarContent>

                {/* Dashboard */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Dashboard
                    </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    {/* Overview */}
                                    <SidebarMenuButton 
                                        asChild
                                        className={isActive("/admin/e-commerce") ? "bg-secondary/50 text-primary hover:bg-secondary/50 hover:text-primary" : ""}
                                    >
                                        <Link href={"/admin/e-commerce"}>
                                            <LayoutDashboard />
                                            E-commerce
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                </SidebarGroup>

                {/* Proucts */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Management
                    </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                <SidebarMenuItem>
                                    {/* Products list */}
                                    <SidebarMenuButton 
                                        asChild
                                        className={isActive("/admin/products") ? "bg-secondary/50 text-primary hover:bg-secondary/50 hover:text-primary" : ""}
                                    >
                                        <Link href={"/admin/products"}>
                                            <Package />
                                            Products
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    {/* Products list */}
                                    <SidebarMenuButton 
                                        asChild
                                        className={isActive("/admin/orders") ? "bg-secondary/50 text-primary hover:bg-secondary/50 hover:text-primary" : ""}
                                    >
                                        <Link href={"/admin/orders"}>
                                            <ShoppingBag />
                                            Orders
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    {/* Products list */}
                                    <SidebarMenuButton 
                                        asChild
                                        className={isActive("/admin/users") ? "bg-secondary/50 text-primary hover:bg-secondary/50 hover:text-primary" : ""}
                                    >
                                        <Link href={"/admin/users"}>
                                            <Users />
                                            Users
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    {/* Products list */}
                                    <SidebarMenuButton asChild>
                                        <Link href={"/admin/invoices"}>
                                            <ReceiptText />
                                            Invoices
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="data-[state=open]:bg-transparent data-[state=open]:text-current focus:ring-0 focus-visible:ring-0">
                                    <User2 />
                                    Bhone Wai <ChevronUp className={"ml-auto"} />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={"end"}>
                                <DropdownMenuItem>Account</DropdownMenuItem>
                                <DropdownMenuItem>Setting</DropdownMenuItem>
                                <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}