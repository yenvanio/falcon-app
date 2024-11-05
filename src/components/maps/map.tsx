"use client"

import {GoogleMap} from "@react-google-maps/api";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ItineraryProps} from "@/components/itinerary/types";
import {FalconLocation} from "@/components/maps/types";
import {GetBounds} from "@/components/maps/helper";
import FalconMarker from "@/components/maps/marker";
import MapSearchForm from "@/components/maps/map-search-form";
import {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";

export interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
    // itinerary: ItineraryProps
    // locations: Map<string, FalconLocation>
}

export const defaultMapContainerStyle = {
    width: '100%',
    height: '100vh'
};

const defaultMapZoom = 7
const markerMapZoom = 12
const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'roadmap',
};

export default function MapComponent() {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const mapRef = useRef<GoogleMap>(null)
    const onLoad = useCallback((map: any) => setMap(map), []);
    const defaultMapCenter = {
        lat: 0.0,
        lng: 0.0,
    }
    const bounds = GetBounds(defaultMapCenter, 100000)

    const [searchLocationMarker, setSearchLocationMarker] = useState<FalconLocation | null>(null)
    const handleSearchSubmit = (location: GooglePlacesAutocompleteResult | null) => {
        if (!location) {
            setSearchLocationMarker(null)
            return
        }

        if (map && location) {
            setSearchLocationMarker({
                id: 'search-location-marker',
                name: location.name,
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
                phone: location.phone,
                website: location.website
            })
        }
    }

    useEffect(() => {
        if (map && searchLocationMarker) {
            map.panTo({
                lat: searchLocationMarker.latitude!,
                lng: searchLocationMarker.longitude!
            })
            map.setZoom(markerMapZoom)
        }
    }, [searchLocationMarker]);

    return (
        <React.Fragment>
            {/*<GoogleMap*/}
            {/*    ref={mapRef}*/}
            {/*    mapContainerStyle={defaultMapContainerStyle}*/}
            {/*    center={defaultMapCenter}*/}
            {/*    zoom={defaultMapZoom}*/}
            {/*    options={defaultMapOptions}*/}
            {/*    onLoad={onLoad}>*/}
            {/*    {searchLocationMarker && (*/}
            {/*        <FalconMarker id={searchLocationMarker.id} location={searchLocationMarker} isSearch={true}/>*/}
            {/*    )}*/}
            {/*    {Array.from(locations.entries()).map(([key, value]) => (*/}
            {/*        <FalconMarker id={key} location={value} isSearch={false}/>*/}
            {/*    ))}*/}
            {/*</GoogleMap>*/}
            {/*<MapSearchForm itinerary={itinerary} bounds={bounds} onSubmit={handleSearchSubmit}/>*/}
        </React.Fragment>
    )
}