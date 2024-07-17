'use client'

import {GoogleMap, Marker} from "@react-google-maps/api";
import React, {useRef, useState} from "react";
import {ItineraryProps} from "@/components/itinerary/types";

import GooglePlacesAutocomplete, {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";

type MapProps = {
    itinerary: ItineraryProps
}

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '100vh',
};

const defaultMapZoom = 8
const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'roadmap',
};


export default function MapComponent({itinerary}: MapProps) {
    const mapRef = useRef<GoogleMap>(null)
    const defaultMapCenter = {
        lat: parseFloat(itinerary.location.latitude),
        lng: parseFloat(itinerary.location.longitude),
    }

    const handlePlaceSelect = (place: GooglePlacesAutocompleteResult) => {
        console.log(place)
    }

    return (
        <div className="relative w-full">
            <GoogleMap
                ref={mapRef}
                mapContainerStyle={defaultMapContainerStyle}
                center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}>
            </GoogleMap>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-5/6">
                <div className="relative">
                    <GooglePlacesAutocomplete autocompleteTypes={''} onComplete={handlePlaceSelect}/>
                </div>
            </div>
        </div>
    )
};

export {MapComponent};