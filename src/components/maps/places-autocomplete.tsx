"use client"

import React, {useEffect, useRef, useState} from 'react';
import {ControllerRenderProps} from "react-hook-form";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Input} from "@/components/ui/input";
import LatLng = google.maps.LatLng;
import LatLngBounds = google.maps.LatLngBounds;

export interface GooglePlacesAutocompleteResult {
    description: string;
    place_id: string;
    latitude: number;
    longitude: number;
}

export function GooglePlacesAutocomplete({className, field, autocompleteTypes, onComplete}: any) {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>()
    const autocompleteRef = useRef<HTMLInputElement>(null);

    const autocompleteFields = [
        'name',
        'formatted_address',
        'geometry'
    ]

    // const LatLngBounds = (): LatLngBounds => {
    //     const radiusInMeters = 5
    //     const center = new LatLng()
    //
    //     const distanceFromCenterToCorner = radiusInMeters * Math.sqrt(2.0)
    //     const southwestCorner = SphericalUtil.computeOffset(center, distanceFromCenterToCorner, 225.0)
    //     const northeastCorner = SphericalUtil.computeOffset(center, distanceFromCenterToCorner, 45.0)
    //     return new LatLngBounds(southwestCorner, northeastCorner)
    // }

    // Setup Autocomplete and Listener
    useEffect(() => {
        const autoComplete = new google.maps.places.Autocomplete(autocompleteRef.current as HTMLInputElement, {
            types: autocompleteTypes,
            fields: autocompleteFields,
            // bounds: LatLngBounds()
        })
        autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace()

            if (place?.geometry) {
                const result = {
                    description: place.name!,
                    place_id: place.place_id!,
                    latitude: place.geometry.location?.lat(),
                    longitude: place.geometry.location?.lng()
                }

                onComplete(result);
            }
        });

        setAutocomplete(autocomplete)

    }, []);

    return (
        <div className={className}>
            <Input ref={autocompleteRef}/>
        </div>
    );

};

export default GooglePlacesAutocomplete;
