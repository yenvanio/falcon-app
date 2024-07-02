import Link from "next/link"
import AppIcon from "@/components/ui/app-icon";
import {ProfileIcon} from "@/components/auth/profile-icon/profile-icon";
import {User} from "@supabase/auth-js";

interface AuthedNavbarProps {
    user: User | null
}

export default async function AuthedNavbar({user}: AuthedNavbarProps) {
    return (
        <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-4">
                <Link href="#" className="flex items-center gap-2" prefetch={false}>
                    <AppIcon className="h-6 w-6 text-yellow-400"/>
                    <span className="sr-only">Falcon</span>
                </Link>
            </nav>
            <ProfileIcon  user={user}/>
        </header>
    )
}