import {Separator} from "@/components/ui/separator";
import ItineraryHeader from "@/components/itinerary/itinerary-header";
import {createClient} from "@/lib/supabase/server";
import {SkeletonCard} from "@/components/ui/skeleton-card";
import FalconCalendar, {CalendarEvent} from "@/components/calendar/calendar";
import React from "react";
import {parseISO} from "date-fns";
import {ItineraryProps} from "@/components/itinerary/card";
import {EventProps} from "@/components/itinerary/event-list-item-card";

export default async function ItineraryDetailPage({params, searchParams}: {
    params: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const query_id = Number(params.id)
    const supabase = createClient();

    async function getItinerary(): Promise<ItineraryProps | undefined> {
        let {data, error} = await supabase
            .rpc('GetItineraryById', {
                query_id
            })

        if (error) {
            console.error(error)
            return
        }

        if (data) {
            return {
                id: data.id,
                name: data.name,
                start_date: parseISO(data.start_date),
                end_date: parseISO(data.end_date),
                notes: data.notes,
                owner_uuid: data.owner_uuid,
                role: data.role
            }
        }
    }

    async function getEvents(): Promise<CalendarEvent[]> {
        const events: CalendarEvent[] = []

        let { data, error } = await supabase
            .rpc('GetEventsByItineraryId', {
                query_id
            })
        if (error) {
            console.log(error)
            return events
        }

        data.forEach((record: EventProps) => {
            events.push({
                title: record.name,
                start: parseISO(record.start_date),
                end: parseISO(record.end_date),
                resource: record,
                allDay: false,
            })
        })

        return events
    }

    const itinerary = await getItinerary()
    const events = await getEvents()

    return (
        <main className="flex min-h-screen flex-col justify-between p-20">
            <div className="relative">
                {
                    itinerary ?
                        <div className="grid grid-rows-[auto,1fr]">
                            <div className="row-span-1 grid grid-cols-6">
                                <div className="col-span-5">
                                    <ItineraryHeader itinerary={itinerary}/>
                                    <Separator className="mt-5 w-5/6"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-6">
                                <div className="col-span-5 w-5/6 mt-5">
                                    <FalconCalendar itinerary={itinerary} events={events}/>
                                </div>
                            </div>
                        </div>
                    :
                    <SkeletonCard/>
                }
            </div>
        </main>
    );
}