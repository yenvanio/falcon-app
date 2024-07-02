import {createClient} from "@/lib/supabase/server";
import EventListClient from "@/components/itinerary/event-list-client";
import {EventProps} from "@/components/itinerary/event-list-item";
import {parseISO} from "date-fns";

type EventListClientWrapperProps = {
    itineraryId: number;
}

export default async function EventListServer({itineraryId}: EventListClientWrapperProps) {
    const supabase = createClient()
    let events:Map<string, Map<number, EventProps>> = new Map()

    const getDateKey = (date: Date) => {
        return date.toLocaleString('default', { month: 'long' }) + " " + date.getDate()
    }

    async function getEvents() {
        const events:Map<string, Map<number, EventProps>> = new Map()

        let { data, error } = await supabase
            .rpc('GetEventsByItineraryId', {
                query_id: itineraryId
            })
        if (error) {
            console.log(error)
            return events
        }

        if (data) {
            data.forEach((event: EventProps) => {
                let emptyMap: Map<number, EventProps> = new Map()
                const dateKey = getDateKey(parseISO(event.date))

                // Check if events exist under this date
                let eventMap = events.get(dateKey)
                if (!eventMap) {
                    eventMap = emptyMap
                }

                // Add new event by id in the sub-map
                eventMap.set(event.id, event)

                // Set the map of events for this date to this super-map
                events.set(dateKey, eventMap)
            })
        }

        return events
    }

    events = await getEvents()

    return <EventListClient initialEvents={events} itinerary_id={itineraryId} />
}