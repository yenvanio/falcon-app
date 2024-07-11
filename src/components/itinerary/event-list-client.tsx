"use client";

import { useEffect, useState } from 'react';
import {createClient} from "@/lib/supabase/client";
import {EventProps} from "@/components/itinerary/event-list-item-card";
import EventsList from "@/components/itinerary/event-list";
import {ItineraryProps} from "@/components/itinerary/card";
import {StripTimeFromDate} from "@/components/itinerary/helper";

interface EventListClientProps {
    itinerary: ItineraryProps;
    initialEvents: Map<string, Map<number, EventProps>>;
}

export default function EventListClient({ initialEvents, itinerary }: EventListClientProps) {
    const [events, setEvents] = useState(new Map(initialEvents));
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'events',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setEvents((prevEvents) => {
                        const updatedEvents = new Map(prevEvents);
                        const event = payload.new as EventProps
                        const eventDate = StripTimeFromDate(event.date)

                        let emptyMap: Map<number, EventProps> = new Map()

                        // Check if events exist under this date
                        let eventMap = updatedEvents.get(eventDate)
                        if (!eventMap) {
                            eventMap = emptyMap
                        }

                        eventMap.set(event.id, event)
                        updatedEvents.set(eventDate, eventMap)

                        return updatedEvents;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'events',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setEvents((prevEvents) => {
                        const updatedEvents = new Map(prevEvents);
                        const event = payload.old;
                        const eventDate = StripTimeFromDate(event.date)

                        const eventMap = updatedEvents.get(eventDate)!
                        eventMap.delete(event.id)
                        updatedEvents.set(eventDate, eventMap)

                        return updatedEvents;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, itinerary.id]);

    return <EventsList events={events} itinerary={itinerary} />;
}
