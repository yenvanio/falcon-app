"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/app/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/app/components/ui/dropdown-menu";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

export const ProfileIcon = async (props: { nextUrl?: string }) => {
    const supabase = createClient();
    const router = useRouter();

    const user = await supabase.auth.getUser()

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/")
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage/>
                    <AvatarFallback className="text-slate-950">Y</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>{user.data.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}