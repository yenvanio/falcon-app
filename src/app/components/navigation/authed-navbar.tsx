import Link from "next/link"
import AppIcon from "@/app/components/ui/app-icon";
import {createClient} from "@/lib/supabase/client";
import {ProfileIcon} from "@/app/components/profile-icon/profile-icon";

export default async function AuthedNavbar() {
    const supabase = createClient();
    const user = await supabase.auth.getUser()

    return (
        <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-4">
                <Link href="#" className="flex items-center gap-2" prefetch={false}>
                    <AppIcon className="h-6 w-6 text-yellow-400"/>
                    <span className="sr-only">Falcon</span>
                </Link>
            </nav>
            <ProfileIcon />
        </header>
    )
}