"use client";

import { useEffect, useState } from 'react';
import {createClient} from "@/lib/supabase/client";
import ItinerariesGrid from "@/components/itinerary/grid";
import {parseISO} from "date-fns";
import {ItineraryProps} from "@/components/itinerary/types";

interface ItinerariesGridClientProps {
    initialItineraries: Map<number, ItineraryProps>;
    userId: string | undefined;
}

export default function ItinerariesGridClient({ initialItineraries, userId }: ItinerariesGridClientProps) {
    const [itineraries, setItineraries] = useState(new Map(initialItineraries));
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'itineraries',
                    filter: `owner_uuid=eq.${userId}`
                },
                (payload) => {
                    setItineraries((prevItineraries) => {
                        const updatedItineraries = new Map(prevItineraries);
                        const { id, name, start_date, end_date, location, country, continent, latitude, longitude, owner_uuid, role } = payload.new;
                        const itinerary: ItineraryProps = {
                            id,
                            name,
                            start_date: parseISO(start_date),
                            end_date: parseISO(end_date),
                            location: {
                                name: location,
                                country: country,
                                continent: continent,
                                latitude: latitude,
                                longitude: longitude,
                            },
                            owner_uuid,
                            role
                        };
                        updatedItineraries.set(itinerary.id, itinerary);
                        return updatedItineraries;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'itineraries',
                    filter: `owner_uuid=eq.${userId}`
                },
                (payload) => {
                    setItineraries((prevItineraries) => {
                        const updatedItineraries = new Map(prevItineraries);
                        const itinerary = payload.old;
                        updatedItineraries.delete(itinerary.itinerary_id);
                        return updatedItineraries;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    return <ItinerariesGrid key={itineraries.size} itineraries={itineraries} />;
}
