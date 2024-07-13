import {createClient} from "@/lib/supabase/server";
import {ItineraryProps} from "@/components/itinerary/card";
import ItinerariesGridClient from "@/components/itinerary/grid-client";
import {parseISO} from "date-fns";

export default async function ItinerariesGridServer() {
    const supabase = createClient()
    const user = await supabase.auth.getUser()
    let itineraries:Map<number, ItineraryProps> = new Map()

    async function getItineraries() {
        const itineraries:Map<number, ItineraryProps> = new Map()

        let { data, error } = await supabase
            .rpc('GetItinerariesByUserUuid', {
                uuid: user.data.user?.id
            })
        if (error) {
            console.log(error)
            return itineraries
        }

        if (data) {
            data.map(({ id, name, start_date, end_date, notes, owner_uuid, role }: any) => ({
                id,
                name,
                start_date: parseISO(start_date),
                end_date: parseISO(end_date),
                notes,
                owner_uuid,
                role
            })).forEach((itinerary: ItineraryProps) => {
                    itineraries.set(itinerary.id, itinerary);
            });
        }

        return itineraries
    }

    itineraries = await getItineraries()

    return <ItinerariesGridClient initialItineraries={itineraries} userId={user.data.user?.id} />
}