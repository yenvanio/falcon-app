import Link from "next/link"
import {LoginDialog} from "@/components/auth/login/dialog";

export default async function UnauthedNavbar() {
    return (
        <header className="bg-slate-900 text-white px-4 py-6 flex items-center justify-between">
            <nav className="flex items-center gap-4">
                <Link href="#" className="flex items-center justify-center" prefetch={false}>
                    {/*<PlaneIcon className="h-6 w-6" />*/}
                    <img
                        src="/falcon.svg"
                        alt="falcon"
                        className="h-6 w-6"
                    />
                    {/*<AppIcon className="h-6 w-6 text-yellow-400"/>*/}
                    <span className="font-semibold ml-2">Falcon</span>
                </Link>
            </nav>
            <div className="float-right">
                {/*<LoginDialog />*/}
            </div>
        </header>
    )
}