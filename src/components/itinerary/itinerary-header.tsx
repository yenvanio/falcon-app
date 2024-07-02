import {Label} from "@/components/ui/label";
import FormattedDateRange from "@/components/date/formatted-date";
import {ItineraryProps} from "@/components/itinerary/card";
import {SkeletonCard} from "@/components/ui/skeleton-card";

interface ItineraryHeaderProps {
    itinerary?: ItineraryProps | null
}

export default function ItineraryHeader({itinerary}: ItineraryHeaderProps) {
    return (
        <>
            {
                itinerary ? <div>
                    <Label className="text-4xl font-semibold row-span-1">{itinerary?.name}</Label>
                    <div className="grid row-span-1 mt-2">
                        <Label className="text-xl font-light col-span-1 place-content-center">
                            <FormattedDateRange
                                start_date_string={itinerary?.start_date}
                                end_date_string={itinerary?.end_date}/>
                        </Label>
                    </div>
                </div> : <SkeletonCard/>
            }
        </>
    )
}