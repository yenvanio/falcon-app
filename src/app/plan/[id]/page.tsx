import {Label} from "@/components/ui/label";
import {ItineraryUsersList} from "@/components/itinerary/itinerary-users-list";
import {Separator} from "@/components/ui/separator";
import {Textarea} from "@/components/ui/textarea";
import EventListServer from "@/components/itinerary/event-list-server";
import ItineraryHeader from "@/components/itinerary/itinerary-header";
import {createClient} from "@/lib/supabase/server";
import {CreateEvent} from "@/components/itinerary/create-event-dialog";
import {SkeletonCard} from "@/components/ui/skeleton-card";

export default async function ItineraryDetailPage({params, searchParams}: {
    params: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const query_id = Number(params.id)
    const supabase = createClient();

    async function getItinerary() {
        let {data, error} = await supabase
            .rpc('GetItineraryById', {
                query_id
            })

        if (error) {
            console.error(error)
            return
        }

        return data
    }

    const itinerary = await getItinerary()

    return (
        <main className="flex min-h-screen flex-col justify-between p-20">
            <div className="relative">
                {itinerary ? <div className="grid grid-cols-6">
                    <div className="col-span-5">
                        <ItineraryHeader itinerary={itinerary}/>
                        <Separator className="mt-10 w-3/4"/>
                        <div className="grid grid-cols-6 mt-10">
                            <div className="col-span-4">
                                <EventListServer itineraryId={itinerary.id}/>
                            </div>
                            <div className="col-span-2">
                                <CreateEvent itinerary_id={itinerary.id} start_date={itinerary.start_date}
                                             end_date={itinerary.end_date}/>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-rows-3 col-span-1 space-y-4">
                        <div className="row-span-1 space-y-2">
                            <Label className="text-m font-semibold col-span-1 place-content-center">Travellers</Label>
                            <ItineraryUsersList itinerary_id={itinerary.id}/>
                        </div>
                        <div className="row-span-2 space-y-2">
                            <Label className="text-m font-semibold col-span-1 place-content-center">Notes</Label>
                            <Textarea placeholder={itinerary.notes}/>
                        </div>
                    </div>
                </div> : <SkeletonCard/>
                }
            </div>
        </main>
    );
}