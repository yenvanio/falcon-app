import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import FormattedDateRange from "@/components/date/formatted-date";
import {useRouter} from "next/navigation";
import {parseISO} from "date-fns";

export interface EventProps {
    id: number
    name: string
    location: string
    date: string
    notes: string
    created_by: string
}

export default function EventListItem(event: EventProps) {
    const date = parseISO(event.date)
    const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });

    return (
        <Card className="shadow-sm hover:shadow-md mt-10 mr-10">
            <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.location} @ {formattedTime}</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter>
                <div className="grid-rows-1 items-center gap-4 text-sm">
                    <p>{event.notes}</p>
                </div>
            </CardFooter>
        </Card>
    )
}