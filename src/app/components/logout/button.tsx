"use client"

import {Button} from "@/app/components/ui/button";
import React from "react";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

export const LogoutButton = () => {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/")
    };

    return (
        <Button onClick={handleLogout} className="h-10 rounded-md bg-slate-900 hover:bg-slate-100 hover:text-slate-950 text-slate-50 px-5">Logout</Button>
    )
}