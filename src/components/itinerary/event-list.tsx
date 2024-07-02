"use client"

import { Label } from "@/components/ui/label";
import EventListItem, { EventProps } from "@/components/itinerary/event-list-item";

interface EventListProps {
    events: Map<string, Map<number, EventProps>>
}

export default function EventsList({ events }: EventListProps) {
    const dateArray = Array.from(events.entries()).sort(
        (a, b) => (a[0] > b[0] ? 1 : -1)
    )

    return (
            <div className="grid grid-cols-1 gap-4 max-w-6xl w-full">
                {dateArray.map(([date, eventsMap]) => (
                    <div className="mt-10" key={date}>
                        <Label className="text-2xl font-semibold">{date}</Label>
                        {Array.from(eventsMap.entries()).map(([id, event]) => (
                            <EventListItem
                                key={event.id}
                                id={event.id}
                                name={event.name}
                                location={event.location}
                                date={event.date}
                                notes={event.notes}
                                created_by={event.created_by}
                            />
                        ))}
                    </div>
                ))}
            </div>
    )
}
