import {createClient} from "@/lib/supabase/server";
import {ItineraryProps} from "@/app/components/display-itineraries/card";
import ItinerariesGridClient from "@/app/components/display-itineraries/grid-client";

export default async function ItinerariesGridServer() {
    const supabase = createClient()
    const user = await supabase.auth.getUser()
    let itineraries:Map<string, ItineraryProps> = new Map()

    async function getItineraries() {
        const itineraries:Map<string, ItineraryProps> = new Map()

        let { data, error } = await supabase
            .rpc('GetItinerariesByUserUuid', {
                uuid: user.data.user?.id
            })
        if (error) {
            console.log(error)
            return itineraries
        }

        if (data) {
            data.forEach((record: ItineraryProps) => {
                itineraries.set(record.id, record)
            })
        }

        return itineraries
    }

    const channel = supabase
        .channel('table-db-changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'itineraries',
                filter: `owner_uuid=eq.${user.data.user?.id}`
            },
            (payload) => {
                const itinerary = payload.new
                itineraries.set(itinerary.id, {
                    id: itinerary.id,
                    name: itinerary.name,
                    start_date: itinerary.start_date,
                    end_date: itinerary.end_date,
                    notes: itinerary.notes,
                    owner_uuid: itinerary.owner_uuid,
                    role: itinerary.role,
                })
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'DELETE',
                schema: 'public',
                table: 'itineraries',
                filter: `owner_uuid=eq.${user.data.user?.id}`
            },
            (payload) => {
                const itinerary = payload.old
                itineraries.delete(itinerary.id)
            }
        )
        .subscribe()

    itineraries = await getItineraries()

    return <ItinerariesGridClient initialItineraries={itineraries} userId={user.data.user?.id} />
}