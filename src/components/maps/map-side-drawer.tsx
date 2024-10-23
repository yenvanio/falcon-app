'use client'

import React, {useEffect, useState} from "react";
import {ItineraryProps} from "@/components/itinerary/types";
import {createClient} from "@/lib/supabase/client";
import {FalconLocation} from "@/components/maps/types";
import MapComponent from "@/components/maps/map";
import MapBox from "@/components/maps/map-box";

type MapSideDrawerProps = {
    itinerary: ItineraryProps
    initialLocations: Map<string, FalconLocation>
}

export default function MapSideDrawer({initialLocations, itinerary}: MapSideDrawerProps) {
    const supabase = createClient();
    const [locations, setLocations] = useState(new Map(initialLocations))

    useEffect(() => {
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'locations',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setLocations((prevLocations) => {
                        const updatedLocations = new Map(prevLocations);
                        const { id, name, address, latitude, longitude, phone, website } = payload.new;
                        const location: FalconLocation = {
                            id,
                            name,
                            address,
                            latitude: parseFloat(latitude),
                            longitude: parseFloat(longitude),
                            phone,
                            website
                        };
                        updatedLocations.set(location.id, location);
                        return updatedLocations;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'locations',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setLocations((prevLocations) => {
                        const updatedLocations = new Map(prevLocations);
                        const location = payload.old;
                        updatedLocations.delete(location.id);
                        return updatedLocations;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, itinerary]);

    return (
        <div className="relative w-full">
            <MapBox itinerary={itinerary} locations={locations}/>
        </div>
    )
};

export {MapSideDrawer};