import Link from "next/link"
import {Sheet, SheetTrigger, SheetContent} from "@/app/components/ui/sheet"
import MenuIcon from "@/app/components/ui/menu-icon";
import {Button} from "@/app/components/ui/button";
import AppIcon from "@/app/components/ui/app-icon";
import {createClient} from "@/lib/supabase/client";
import {LogoutButton} from "@/app/components/logout/button";

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
                <div className="hidden md:flex items-center gap-4">
                    <Link href="#" className="text-sm font-medium hover:text-slate-400" prefetch={false}>
                        About
                    </Link>
                    <Link href="#" className="text-sm font-medium hover:text-slate-400" prefetch={false}>
                        Contact
                    </Link>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden">
                            <MenuIcon className="h-6 w-6 text-slate-900"/>
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <div className="grid gap-2 py-6">
                            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold"
                                  prefetch={false}>
                                About
                            </Link>
                            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold"
                                  prefetch={false}>
                                Contact
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
            <LogoutButton />
        </header>
    )
}