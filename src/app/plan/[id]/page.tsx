import {Label} from "@/components/ui/label";
import {ItineraryUsersList} from "@/components/itinerary/itinerary-users-list";
import {Separator} from "@/components/ui/separator";
import {Textarea} from "@/components/ui/textarea";
import EventListServer from "@/components/itinerary/event-list-server";
import ItineraryHeader from "@/components/itinerary/itinerary-header";
import {createClient} from "@/lib/supabase/server";
import {CreateEvent} from "@/components/itinerary/create-event-dialog";
import {SkeletonCard} from "@/components/ui/skeleton-card";
import {TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Tabs} from "@radix-ui/react-tabs";
import TodoListServer from "@/components/todo/todo-list-server";

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
                {
                    itinerary ?
                        <div className="grid grid-rows-[auto,1fr]">
                            <div className="row-span-1 grid grid-cols-6">
                                <div className="col-span-5">
                                    <ItineraryHeader itinerary={itinerary}/>
                                    <Separator className="mt-5 w-5/6"/>
                                </div>
                            </div>
                            <div className="row-span-1 grid grid-cols-6">
                                <Tabs className="p-5 col-span-5" defaultValue="itinerary">
                                    <TabsList className="grid w-5/6 grid-cols-2 bg-slate-50">
                                        <TabsTrigger value="itinerary"
                                                     className="text-slate-600 data-[state=active]:bg-slate-800 data-[state=active]:text-white">Itinerary</TabsTrigger>
                                        <TabsTrigger value="todo"
                                                     className="text-slate-600 data-[state=active]:bg-slate-800 data-[state=active]:text-white">Places
                                            to Visit</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="itinerary">
                                        <EventListServer itinerary={itinerary}/>
                                    </TabsContent>
                                    <TabsContent value="todo">
                                        <TodoListServer/>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    :
                    <SkeletonCard/>
                }
            </div>
        </main>
    );
}