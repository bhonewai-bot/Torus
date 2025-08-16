import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem} from "@/components/ui/sidebar";
import {
    Boxes,
    ChevronDown,
    ChevronUp,
    LayoutDashboard,
    Package,
    Plus,
    ReceiptText, ShoppingCart, User,
    User2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

export function AdminSidebar() {
    return (
        <Sidebar collapsible={"icon"}>
            <SidebarHeader className={"py-4"}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/admin"}>
                                <Image src={"/Torus.svg"} alt={"Logo"} width={24} height={24} />
                                <span className={"text-base font-semibold"}>Torus</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {/*<SidebarSeparator />*/}
            <SidebarContent>

                {/* Dashboard */}
                <Collapsible defaultOpen className={"group/collapsible"}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className={"cursor-pointer"}>
                                Dashboard
                                <ChevronDown className={"ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"} />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        {/* Orders list */}
                                        <SidebarMenuButton asChild>
                                            <Link href={"/admin/overview"}>
                                                <LayoutDashboard />
                                                Overview
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>

                {/* Proucts */}
                <Collapsible defaultOpen className={"group/collapsible"}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className={"cursor-pointer"}>
                                Products
                                <ChevronDown className={"ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"} />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        {/* Products list */}
                                        <SidebarMenuButton asChild>
                                            <Link href={"/admin/products"}>
                                                <Package />
                                                Products
                                            </Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                {/* Add Product */}
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={'/products'}>
                                                        <Plus />
                                                        Add Product
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        {/* Products list */}
                                        <SidebarMenuButton asChild>
                                            <Link href={"/public#"}>
                                                <Boxes />
                                                Inventory
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>

                {/* SALES */}
                <Collapsible defaultOpen className={"group/collapsible"}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className={"cursor-pointer"}>
                                Sales
                                <ChevronDown className={"ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"} />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        {/* Orders list */}
                                        <SidebarMenuButton asChild>
                                            <Link href={"/order"}>
                                                <ShoppingCart />
                                                Orders
                                            </Link>
                                        </SidebarMenuButton>
                                        {/* Invoices list */}
                                        <SidebarMenuButton asChild>
                                            <Link href={"/invoices"}>
                                                <ReceiptText />
                                                Invoices
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>

                {/* Users */}
                <Collapsible defaultOpen className={"group/collapsible"}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className={"cursor-pointer"}>
                                Users
                                <ChevronDown className={"ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"} />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        {/* Orders list */}
                                        <SidebarMenuButton asChild>
                                            <Link href={"/order"}>
                                                <User />
                                                Users
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>

            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 />
                                    Bhone Wai <ChevronUp className={"ml-auto"} />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={"end"}>
                                <DropdownMenuItem>Account</DropdownMenuItem>
                                <DropdownMenuItem>Setting</DropdownMenuItem>
                                <DropdownMenuItem>Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}