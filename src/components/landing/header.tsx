"use client"

import Link from "next/link";
import {useEffect, useRef} from "react";

export default function Header() {
    const scrollToWaitlist = () => {
        const element = document.getElementById("footer")
        element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }

    const buttonRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (buttonRef.current) {
                const button = buttonRef.current;
                const originalText = "Join our waitlist";
                const smallText = "Waitlist";

                if (button.offsetWidth < 170) {
                    button.textContent = smallText;
                } else {
                    button.textContent = originalText;
                }
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section className="w-full sm:py-8 md:py-24 lg:py-32 xl:py-24">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <img
                        src="/landing-page.jpg"
                        alt="Hero"
                        className="mx-auto w-full aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                    />
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                                Plan Your Perfect Trip
                            </h1>
                            <p className="max-w-full text-muted-foreground sm:max-w-md md:max-w-lg md:text-xl">
                                Our travel itinerary planner helps you create personalized itineraries for your next
                                adventure. Import your bookings, invite your friends, and plan your activities with ease.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Link
                                href="#"
                                onClick={scrollToWaitlist}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                prefetch={false}
                                ref={buttonRef}
                            >
                                Join our waitlist
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
