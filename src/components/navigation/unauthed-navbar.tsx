import Link from "next/link"
import {Sheet, SheetTrigger, SheetContent} from "@/components/ui/sheet"
import MenuIcon from "@/components/ui/menu-icon";
import {Button} from "@/components/ui/button";
import AppIcon from "@/components/ui/app-icon";
import {LoginDialog} from "@/components/auth/login/dialog";

export default async function UnauthedNavbar() {
    return (
        <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <nav className="flex items-center gap-4">
                <Link href="#" className="flex items-center gap-2" prefetch={false}>
                    <AppIcon className="h-6 w-6 text-yellow-400"/>
                    <span className="sr-only">Falcon</span>
                </Link>
            </nav>
            <div className="float-right">
                <LoginDialog />
            </div>
        </header>
    )
}