"use client";

import { useEffect, useState } from 'react';
import {createClient} from "@/lib/supabase/client";
import {EventProps} from "@/components/itinerary/event-list-item";
import EventsList from "@/components/itinerary/event-list";
import {parseISO} from "date-fns";

interface EventListClientProps {
    initialEvents: Map<string, Map<number, EventProps>>;
    itinerary_id: number;
}

export default function EventListClient({ initialEvents, itinerary_id }: EventListClientProps) {
    const [events, setEvents] = useState(new Map(initialEvents));
    const supabase = createClient();

    const getDateKey = (date: Date) => {
        return date.toLocaleString('default', { month: 'long' }) + " " + date.getDate()
    }

    useEffect(() => {
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'events',
                    filter: `itinerary_id=eq.${itinerary_id}`
                },
                (payload) => {
                    setEvents((prevEvents) => {
                        const updatedEvents = new Map(prevEvents);
                        const event = payload.new as EventProps
                        const dateKey = getDateKey(parseISO(event.date))

                        let emptyMap: Map<number, EventProps> = new Map()

                        // Check if events exist under this date
                        let eventMap = updatedEvents.get(dateKey)
                        if (!eventMap) {
                            eventMap = emptyMap
                        }

                        eventMap.set(event.id, event)
                        updatedEvents.set(dateKey, eventMap)

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
                    filter: `itinerary_id=eq.${itinerary_id}`
                },
                (payload) => {
                    setEvents((prevEvents) => {
                        const updatedEvents = new Map(prevEvents);
                        const event = payload.old;
                        const dateKey = getDateKey(parseISO(event.date))

                        const eventMap = updatedEvents.get(dateKey)!
                        eventMap.delete(event.id)
                        updatedEvents.set(dateKey, eventMap)

                        return updatedEvents;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, itinerary_id]);

    return <EventsList events={events} />;
}
