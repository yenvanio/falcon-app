import {createClient} from "@/lib/supabase/server";
import {ItineraryProps} from "@/components/itinerary/card";
import ItinerariesGridClient from "@/components/itinerary/grid-client";

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
            data.forEach((record: ItineraryProps) => {
                itineraries.set(record.id, record)
            })
        }

        return itineraries
    }

    itineraries = await getItineraries()

    return <ItinerariesGridClient initialItineraries={itineraries} userId={user.data.user?.id} />
}