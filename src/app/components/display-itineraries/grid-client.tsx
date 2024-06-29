'use client';

import { useEffect, useState } from 'react';
import {createClient} from "@/lib/supabase/client";
import ItinerariesGrid from "@/app/components/display-itineraries/grid";
import {ItineraryProps} from "@/app/components/display-itineraries/card";

interface ItinerariesGridClientProps {
    initialItineraries: Map<string, ItineraryProps>;
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
                        const itinerary = payload.new as ItineraryProps
                        updatedItineraries.set(itinerary.id, itinerary)
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
                        updatedItineraries.delete(itinerary.id);
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
