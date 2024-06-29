"use client"

import ItineraryCard, {ItineraryProps} from "@/app/components/display-itineraries/card";
import {Label} from "@/app/components/ui/label";

interface ItinerariesGridProps {
    itineraries: Map<string, ItineraryProps>
}

export default function ItinerariesGrid({itineraries}: ItinerariesGridProps) {
    const itineraryArray = Array.from(itineraries.entries());

    return (
        <div>
            <Label className="text-4xl font-semibold">Your Itineraries</Label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl w-full mt-10">
                {itineraryArray.map(([key, value]) => (
                    <ItineraryCard key={value.id}
                        id={value.id}
                        name={value.name}
                        start_date={value.start_date}
                        end_date={value.end_date}
                        notes={value.notes}
                        owner_uuid={value.owner_uuid}
                        role={value.role}/>
                ))}
            </div>
        </div>

    )
}