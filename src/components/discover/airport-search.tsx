'use client'

import {LocationProps, MapBox} from "@/components/maps/map-box";
import {DiscoverSearchBar} from "@/components/discover/search-bar";
import {Dispatch, MutableRefObject, SetStateAction, useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import {DiscoverSearchResults} from "@/components/discover/search-results";

const CancelToken = axios.CancelToken;

interface AirportSearchProps {
    isSearch: boolean
    isResultsExpanded: boolean
    menuIconRef: React.RefObject<HTMLDivElement>
    toggleSearch: Dispatch<SetStateAction<boolean>>
    toggleResults: Dispatch<SetStateAction<boolean>>
}

export const AirportSearch = ({isSearch, isResultsExpanded, menuIconRef, toggleSearch, toggleResults}: AirportSearchProps) => {
    const [mapCenter, setMapCenter] = useState({latitude: 0, longitude: 0, title: ""});
    const [mapCenterLocationId, setMapCenterLocationId] = useState(-1)
    const [prevMapCenterLocationId, setPrevMapCenterLocationId] = useState(-1)
    const [destinations, setDestinations] = useState<LocationProps[]>([]);
    const [loading, setLoading] = useState(false);

    const onSearch = async (location: LocationProps) => {
        if (!location) return

        setMapCenter({latitude: location.latitude, longitude: location.longitude, title: location.title})
        setLoading(true);

        try {
            const response = await fetch(`/api/getDirectDestinations?airportCode=${location.iata_code}`);

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error fetching destinations');
            }

            setDestinations(data);
            toggleSearch(false);
            toggleResults(true);
        } catch (err) {
            toast({
                title: "Uh Oh",
                description: "No Destinations Found for this Airport",
            });

            setDestinations([])

            if (err instanceof Error) {
                console.log('Request failed:', err.message);
            }
        } finally {
            setLoading(false);
        }

    };

    const onDestinationSelected = (id: number) => {
        setPrevMapCenterLocationId(mapCenterLocationId)
        setMapCenterLocationId(id)
    }

    return (
        <div className="relative h-screen w-full">
            {isSearch && !loading && (
                <DiscoverSearchBar onSearch={onSearch}/>
            )}

            {loading && (
                <Loader2 className="h-24 w-24 animate-spin text-primary absolute top-1/2 left-1/2 z-10"/>
            )}

            <DiscoverSearchResults locations={destinations} mapCenter={mapCenter} showResults={isResultsExpanded} menuIconRef={menuIconRef}
                                   onClose={() => {toggleResults(false)}} onResultSelected={onDestinationSelected}/>

            <MapBox locations={destinations} mapCenterLocationId={mapCenterLocationId} prevMapCenterLocationId={prevMapCenterLocationId} mapCenter={mapCenter}/>
        </div>
    )
}