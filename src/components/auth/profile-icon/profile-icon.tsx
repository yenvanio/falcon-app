"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
import {User} from "@supabase/auth-js";

interface ProfileIconProps {
    user: User | null
}

export const ProfileIcon = ({user}: ProfileIconProps) => {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = () => {
        supabase.auth.signOut().then(() => {
            router.replace("/")
            router.refresh()
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage/>
                    <AvatarFallback className="text-slate-950">{user?.email?.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}