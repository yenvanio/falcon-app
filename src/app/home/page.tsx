import AuthedNavbar from "@/app/components/navigation/authed-navbar";
import {CreateItinerary} from "@/app/components/create-itinerary/dialog";
import ItinerariesGridServer from "@/app/components/display-itineraries/grid-server";

export default function Dashboard() {
    return (
        <>
            <AuthedNavbar/>
            <main className="flex min-h-screen flex-col justify-between p-20">
                <div className="relative">
                    <div className="absolute top-0 right-0">
                        <CreateItinerary />
                    </div>
                    <ItinerariesGridServer/>
                </div>
            </main>
        </>

    );
}
