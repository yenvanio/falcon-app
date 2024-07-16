import {Separator} from "@/components/ui/separator";
import ItineraryHeader from "@/components/itinerary/itinerary-header";
import {createClient} from "@/lib/supabase/server";
import {SkeletonCard} from "@/components/ui/skeleton-card";
import FalconCalendar, {CalendarEvent} from "@/components/calendar/calendar";
import React from "react";
import {parseISO} from "date-fns";
import {MapComponent} from "@/components/maps/map";
import {ItineraryProps} from "@/components/itinerary/types";

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
                location: {
                    name: data.location,
                    latitude: data.location_lat,
                    longitude: data.location_lng,
                },
                owner_uuid: data.owner_uuid,
                role: data.role
            }
        }
    }

    async function getEvents(): Promise<CalendarEvent[]> {
        const events: CalendarEvent[] = []

        let {data, error} = await supabase
            .rpc('GetEventsByItineraryId', {
                query_id
            })
        if (error) {
            console.log(error)
            return events
        }

        data.forEach((record: any) => {
            events.push({
                title: record.name,
                start: parseISO(record.start_date),
                end: parseISO(record.end_date),
                resource: {
                    id: record.id,
                    name: record.name,
                    location: {
                        name: record.location,
                        latitude: record.latitude,
                        longitude: record.longitude
                    },
                    start_date: record.start_date,
                    end_date: record.end_date,
                    notes: record.notes,
                    created_by: record.created_by,
                },
                allDay: false,
            })
        })

        return events
    }

    const itinerary = await getItinerary()
    const events = await getEvents()

    return (
        <main className="flex h-screen">
            {
                itinerary ? (
                    <>
                        <div className="bg-background p-6 shadow-2xl w-[800px] overflow-y-auto z-10">
                            <div className="grid grid-rows-[auto,1fr] h-full">
                                <div className="row-span-1 grid grid-cols-6">
                                    <div className="col-span-6">
                                        <ItineraryHeader itinerary={itinerary}/>
                                        <Separator className="mt-5"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-6 flex-1">
                                    <div className="col-span-6 mt-5">
                                        <FalconCalendar itinerary={itinerary} initialEvents={events}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div id="map" className="h-full w-full">
                                <MapComponent itinerary={itinerary}/>
                            </div>
                        </div>
                    </>
                ) : (<SkeletonCard/>)
            }
        </main>
    )
}