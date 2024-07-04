import {CalendarIcon} from "@/components/ui/icons/calendar-icon";
import {InboxIcon} from "@/components/ui/icons/inbox-icon";
import {UsersIcon} from "@/components/ui/icons/users-icon";

export default function Features() {
    return (
        <section className="w-full py-6 md:py-12 lg:py-24">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col items-start space-y-2">
                        <InboxIcon className="h-8 w-8 text-primary"/>
                        <h3 className="text-xl font-bold">Import your bookings</h3>
                        <p className="text-muted-foreground">
                            Easily import your hotel, flight, and restaurant bookings into your travel itinerary.
                        </p>
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                        <UsersIcon className="h-8 w-8 text-primary"/>
                        <h3 className="text-xl font-bold">Invite your friends</h3>
                        <p className="text-muted-foreground">Collaborate with friends and family on your travel
                            itineraries.</p>
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                        <CalendarIcon className="h-8 w-8 text-primary"/>
                        <h3 className="text-xl font-bold">Plan your activities</h3>
                        <p className="text-muted-foreground">
                            Easily add activities, hotels, and transportation to your itinerary and keep everything
                            organized.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}