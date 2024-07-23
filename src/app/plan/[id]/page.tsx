import {Separator} from "@/components/ui/separator";
import ItineraryHeader from "@/components/itinerary/itinerary-header";
import {createClient} from "@/lib/supabase/server";
import {SkeletonCard} from "@/components/ui/skeleton-card";
import FalconCalendar, {CalendarEvent} from "@/components/calendar/calendar";
import React from "react";
import {parseISO} from "date-fns";
import MapSideDrawer from "@/components/maps/map-side-drawer";
import {ItineraryProps} from "@/components/itinerary/types";
import {FalconLocation} from "@/components/maps/types";
import {EventProps} from "@/components/events/types";

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
                    country: data.country,
                    continent: data.continent,
                    latitude: data.latitude,
                    longitude: data.longitude
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
            const event: EventProps = {
                id: record.id,
                name: record.name,
                location: {
                    name: record.location,
                    latitude: record.latitude,
                    longitude: record.longitude
                },
                start_date: parseISO(record.start_date),
                end_date: parseISO(record.end_date),
                all_day: record.all_day,
                notes: record.notes,
                created_by: record.created_by,
            }

            events.push({
                title: event.name,
                start: event.start_date,
                end: event.end_date,
                resource: event,
                allDay: event.all_day,
            })
        })

        return events
    }

    async function getLocations(): Promise<Map<string, FalconLocation>> {
        const locations:Map<string, FalconLocation> = new Map()

        let {data, error} = await supabase
            .rpc('GetLocationsByItineraryId', {
                query_id
            })

            if (error) {
                console.log(error)
                return locations
            }

        if (data) {
            data.map(({ id, name, address, latitude, longitude, phone, website }: any) => ({
                id: id,
                name: name,
                address: address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                phone: phone,
                website: website,
            })).forEach((location: FalconLocation) => {
                locations.set(location.id, location);
            });
        }

        return locations
    }

    const itinerary = await getItinerary()
    const initialEvents = await getEvents()
    const initialLocations = await getLocations()

    console.log(initialEvents)

    return (
        itinerary ?
            <>
                <div className="grid grid-cols-7">
                    <main className="col-span-4 bg-background p-6 shadow-2xl z-10">
                        <div className="grid grid-rows-[auto,1fr] h-full">
                            <div className="row-span-1 grid grid-cols-6">
                                <div className="col-span-6">
                                    <ItineraryHeader itinerary={itinerary}/>
                                    <Separator className="mt-5"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-6 flex-1">
                                <div className="col-span-6 mt-5">
                                    <FalconCalendar itinerary={itinerary} initialEvents={initialEvents} initialLocations={initialLocations}/>
                                </div>
                            </div>
                        </div>
                    </main>
                    <aside className="self-start sticky top-0 col-span-3">
                        <MapSideDrawer itinerary={itinerary} initialLocations={initialLocations}/>
                    </aside>
                </div>
            </>
            :
            <SkeletonCard/>
    )
}