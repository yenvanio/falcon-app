import {createClient} from "@/lib/supabase/server";
import EventListClient from "@/components/itinerary/event-list-client";
import {EventProps} from "@/components/itinerary/event-list-item-card";
import {eachDayOfInterval, parseISO} from "date-fns";
import {ItineraryProps} from "@/components/itinerary/card";
import {StripTimeFromDate} from "@/components/itinerary/helper";

type EventListClientWrapperProps = {
    itinerary: ItineraryProps;
}

export default async function EventListServer({itinerary}: EventListClientWrapperProps) {
    const supabase = createClient()

    const initializeEventsMap = (startDate: string, endDate: string) => {
        let events:Map<string, Map<number, EventProps>> = new Map()

        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const dateRange = eachDayOfInterval({ start, end });

        dateRange.forEach(date => {
            events.set(StripTimeFromDate(date.toISOString()), new Map<number, EventProps>());
        });

        return events
    }

    async function populateEvents(events:Map<string, Map<number, EventProps>>) {
        let { data, error } = await supabase
            .rpc('GetEventsByItineraryId', {
                query_id: itinerary.id
            })
        if (error) {
            console.log(error)
            return events
        }

        if (data) {
            data.forEach((event: EventProps) => {
                let emptyMap: Map<number, EventProps> = new Map()

                // Check if events exist under this date
                let eventMap = events.get(StripTimeFromDate(event.date))
                if (!eventMap) {
                    eventMap = emptyMap
                }

                // Add new event by id in the sub-map
                eventMap.set(event.id, event)

                // Set the map of events for this date to this super-map
                events.set(StripTimeFromDate(event.date), eventMap)
            })
        }

        return events
    }

    let events = initializeEventsMap(itinerary.start_date, itinerary.end_date);
    events = await populateEvents(events);

    return <EventListClient initialEvents={events} itinerary={itinerary} />
}