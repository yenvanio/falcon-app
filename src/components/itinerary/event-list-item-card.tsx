import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import FormattedDateRange from "@/components/calendar/formatted-date";
import {useRouter} from "next/navigation";
import {parseISO} from "date-fns";

export interface EventProps {
    id: number
    name: string
    location: string
    start_date: string
    end_date: string
    notes: string
    created_by: string
}

export default function EventListItemCard(event: EventProps) {
    const date = parseISO(event.start_date)
    const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });

    return (
        <Card className="shadow-sm mt-10 mr-10">
            <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.location} @ {formattedTime}</CardDescription>
            </CardHeader>
            <CardContent>
                {/*<img*/}
                {/*    src="/landing-page.jpg"*/}
                {/*    alt="Hero"*/}
                {/*    className="mx-auto w-full aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"*/}
                {/*/>*/}
            </CardContent>
            <CardFooter>
                <div className="grid-rows-1 items-center gap-4 text-sm">
                    <p>{event.notes}</p>
                </div>
            </CardFooter>
        </Card>
    )
}