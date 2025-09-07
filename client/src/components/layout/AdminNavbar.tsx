"use client"

import {LogOut, Moon, Settings, Sun, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import {SidebarTrigger} from "@/components/ui/sidebar";

export function AdminNavbar() {
    const { theme, setTheme } = useTheme();
    return (
        <nav className={'p-4 flex items-center justify-between sticky top-0 bg-background z-10'}>
            {/* LEFT */}
            <SidebarTrigger />

            {/* RIGHT */}
            <div className={'flex items-center gap-4'}>
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="relative h-9 w-9 rounded-full overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 focus:ring-0 focus-visible:ring-0 group"
                >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 scale-0 transition-all duration-500 ease-out group-hover:opacity-20 group-hover:scale-100 dark:from-blue-600 dark:to-purple-600" />
                    
                    <Sun className="h-6 w-6 scale-100 rotate-0 transition-all duration-500 ease-in-out text-yellow-600 dark:scale-0 dark:-rotate-180" />
                    <Moon className="absolute h-6 w-6 scale-0 rotate-180 transition-all duration-500 ease-in-out text-blue-400 dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="/Code_Joke.jpg" className={"object-cover"} />
                            <AvatarFallback>Bhone Wai</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={10} className={"mr-2.5"}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className={'h-[1.2rem] w-[1.2rem] mr-2'} />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className={'h-[1.2rem] w-[1.2rem] mr-2'} />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem variant={"destructive"}>
                            <LogOut className={'h-[1.2rem] w-[1.2rem] mr-2'} />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}