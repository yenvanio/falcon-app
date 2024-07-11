"use client"

import { EventProps } from "@/components/itinerary/event-list-item-card";
import {ItineraryProps} from "@/components/itinerary/card";
import {EventListItemCollapsible} from "@/components/itinerary/event-list-item-collapsible";

interface EventListProps {
    itinerary: ItineraryProps
    events: Map<string, Map<number, EventProps>>
}

export default function EventsList({ itinerary, events }: EventListProps) {
    const dateArray = Array.from(events.entries()).sort(
        (a, b) => (a[0] > b[0] ? 1 : -1)
    )

    return (
            <div className="w-5/6">
                {dateArray.map(([date, eventsMap], index) => (
                    <EventListItemCollapsible date={date} itinerary={itinerary} eventsMap={eventsMap} isExpanded={index == 0}/>
                ))}
            </div>
    )
}
