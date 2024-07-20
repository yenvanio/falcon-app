import Link from "next/link"
import {ProfileIcon} from "@/components/auth/profile-icon/profile-icon";
import {User} from "@supabase/auth-js";
import {HomeIcon} from "@/components/ui/icons/home-icon";

interface AuthedNavbarProps {
    user: User | null
}

export default async function AuthedNavbar({user}: AuthedNavbarProps) {
    return (
        <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-x-8">
                <div></div>
                <Link href="/home" className="flex items-center gap-2" prefetch={false}>
                    <HomeIcon className="h-6 w-6"/>
                    <span className="sr-only">Home</span>
                </Link>
            </nav>
            <ProfileIcon  user={user}/>
        </header>
    )
}