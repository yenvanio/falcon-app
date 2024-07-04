"use client"

import Link from "next/link";

export default function Header() {
    const scrollToWaitlist = () => {
        const element = document.getElementById("footer")
        element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-24">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <img
                        src="/landing-page.jpg"
                        alt="Hero"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                    />
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                Plan Your Perfect Trip
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                Our travel itinerary planner helps you create personalized itineraries for your next
                                adventure.
                                Import your bookings, invite your friends and plan your activities with ease.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Link
                                href="#"
                                onClick={scrollToWaitlist}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                prefetch={false}
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