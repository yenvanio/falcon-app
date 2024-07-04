import Waitlist from "@/components/landing/waitlist";
import Header from "@/components/landing/header";
import Features from "@/components/landing/features";

export default function Home() {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <main className="flex min-h-screen flex-col items-center justify-center p-24">
                <Header/>
                <Features/>
                <Waitlist/>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t" id="footer">
                <p className="text-xs text-muted-foreground">&copy; 2024 Falcon. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                </nav>
            </footer>
        </div>
    );
}
