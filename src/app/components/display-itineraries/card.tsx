import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/card";
import FormattedDate from "@/app/components/date/formatted-date"
import FormattedDateRange from "@/app/components/date/formatted-date";

type ItineraryRole = 'OWNER' | 'COLLABORATOR' | 'FOLLOWER'

export interface ItineraryProps {
    id: string
    name: string
    start_date: string
    end_date: string
    notes: string
    owner_uuid: string
    role: ItineraryRole,
}

export default function ItineraryCard(itinerary: ItineraryProps) {
    return (
        <Card className="shadow-sm hover:shadow-md">
            <CardHeader>
                <CardTitle>{itinerary.name}</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <div className="grid-rows-1 items-center gap-4 text-sm">
                    <FormattedDateRange start_date_string={itinerary.start_date} end_date_string={itinerary.end_date} />
                </div>
            </CardFooter>
        </Card>
    )
}