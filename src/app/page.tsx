import {Label} from "@/components/ui/label";
import Waitlist from "@/components/landing/waitlist";

export default function Home() {
    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <Label className="text-4xl mb-8">Welcome to Falcon!</Label>
            <div className="flex-col items-center justify-center p-8">
                <div className="text-center">
                    <Waitlist />
                </div>
            </div>
            </main>
        </>
    );
}
