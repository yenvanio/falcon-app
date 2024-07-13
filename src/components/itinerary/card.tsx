import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import FormattedDateRange from "@/components/calendar/formatted-date";
import {useRouter} from "next/navigation";

export type ItineraryRole = 'OWNER' | 'COLLABORATOR' | 'FOLLOWER'

export interface ItineraryProps {
    id: number
    name: string
    start_date: Date
    end_date: Date
    notes: string
    owner_uuid: string
    role: ItineraryRole,
}

export default function ItineraryCard(itinerary: ItineraryProps) {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/plan/${itinerary.id}`)
    }

    return (
        <Card className="shadow-sm hover:shadow-md hover:cursor-pointer" onClick={handleClick}>
            <CardHeader>
                <CardTitle>{itinerary.name}</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <div className="grid-rows-1 items-center gap-4 text-sm">
                    <FormattedDateRange start_date={itinerary.start_date} end_date={itinerary.end_date} />
                </div>
            </CardFooter>
        </Card>
    )
}