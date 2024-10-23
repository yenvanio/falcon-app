import * as React from "react"
import {createClient} from "@/lib/supabase/server";
import {ItineraryUsersList} from "@/components/itinerary/itinerary-user-list";

type ItineraryUsersListServerProps = {
    itinerary_id: number
}

export async function ItineraryUsersListServer({itinerary_id}: ItineraryUsersListServerProps) {
    const supabase = createClient();

    const getUsers = async () => {
        const {data, error} = await supabase
            .rpc('GetUsersByItineraryId', {
                query_id: itinerary_id
            });

        if (error) {
            console.error(error);
            return []
        }

        return data
    }

    const users = await getUsers()


    return (
        <ItineraryUsersList itinerary_id={itinerary_id} initial_users={users}/>
    )
}
