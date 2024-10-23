import {Label} from "@/components/ui/label";
import FormattedDateRange from "@/components/calendar/formatted-date";
import {SkeletonCard} from "@/components/ui/skeleton-card";
import {NotesIcon} from "@/components/ui/icons/notes-icon";
import {Button} from "@/components/ui/button";
import {ItineraryUsersListServer} from "@/components/itinerary/itinerary-users-list-server";
import {ItineraryProps} from "@/components/itinerary/types";

interface ItineraryHeaderProps {
    itinerary?: ItineraryProps | null
}

export default function ItineraryHeader({itinerary}: ItineraryHeaderProps) {
    return (
        <>
            {
                itinerary ?
                    <div>
                        <Label className="text-4xl font-semibold row-span-1">{itinerary?.name}</Label>
                        <div className="grid grid-cols-4 row-span-1 col-span-1 mt-5">
                            <div className="col-span-3">
                                <Label className="text-xl font-light col-span-1 place-content-center">
                                    <FormattedDateRange
                                        start_date={itinerary?.start_date}
                                        end_date={itinerary?.end_date}/>
                                </Label>
                            </div>
                            <div className="col-span-1 flex justify-end items-center space-x-2">
                                <ItineraryUsersListServer itinerary_id={itinerary?.id}/>
                                <Button className="bg-white text-slate-950 hover:bg-accent">
                                    <NotesIcon/>
                                </Button>
                            </div>
                        </div>
                    </div>
                    :
                    <SkeletonCard/>
            }
        </>
    )
}