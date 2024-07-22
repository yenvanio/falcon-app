"use client"

import React, {useEffect, useRef, useState} from 'react';
import {ControllerRenderProps, FieldValues} from "react-hook-form";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Input, InputProps} from "@/components/ui/input";
import LatLng = google.maps.LatLng;
import LatLngBounds = google.maps.LatLngBounds;
import {SearchIcon} from "@/components/ui/icons/search-icon";
import {XIcon} from "lucide-react";

export interface GooglePlacesAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
    autocompleteTypes: string[]
    autocompleteFields: string[]
    country: string
    continent: string
    bounds: google.maps.LatLngBounds | null
    onComplete: (result: GooglePlacesAutocompleteResult) => void
}

export interface GooglePlacesAutocompleteResult {
    name: string
    address: string
    phone: string
    country: string
    continent: string
    latitude: number
    longitude: number
    photos: google.maps.places.PlacePhoto[]
    rating: number
    website: string
    placeId: string
}

const getCountryCode = (addressComponents: google.maps.GeocoderAddressComponent[] | undefined): string | null => {
    if (addressComponents) {
        for (const component of addressComponents) {
            if (component.types.includes('country')) {
                return component.short_name;
            }
        }
    }
    return null;
};

const getContinentCode = (addressComponents: google.maps.GeocoderAddressComponent[] | undefined): string | null => {
    if (addressComponents) {
        for (const component of addressComponents) {
            if (component.types.includes('continent')) {
                return component.short_name;
            }
        }
    }
    return null;
};

export const GooglePlacesAutocomplete = React.forwardRef<HTMLInputElement, GooglePlacesAutocompleteProps>(
    ({className, autocompleteTypes, autocompleteFields, continent, country, bounds, onComplete, ...props}, ref) => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>()
    const autocompleteRef = useRef<HTMLInputElement>(null);

    // Setup Autocomplete and Listener
    useEffect(() => {
        const autoComplete = new google.maps.places.Autocomplete(autocompleteRef.current as HTMLInputElement, {
            types: autocompleteTypes,
            fields: autocompleteFields,
        })

        if (country) {
            autoComplete.setComponentRestrictions({
                country: country
            })
        } else if (bounds) {
            autoComplete.setOptions({
                bounds: bounds,
                strictBounds: true
            })
        }

        autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace()
            console.log(place)

            if (place?.geometry && place.geometry.location) {
                const country = getCountryCode(place.address_components);
                const continent = getContinentCode(place.address_components);

                const result: GooglePlacesAutocompleteResult = {
                    name: place.name!,
                    address: place.formatted_address!,
                    phone: place.formatted_phone_number!,
                    country: country ?? '',
                    continent: continent ?? '',
                    latitude: place.geometry.location?.lat(),
                    longitude: place.geometry.location?.lng(),
                    rating: place.rating!,
                    photos: place.photos ?? [],
                    website: place.website!,
                    placeId: place.place_id!
                }

                onComplete(result);
            }
        });

        setAutocomplete(autocomplete)

    }, []);

    const onClear = () => {
        if (autocompleteRef.current) {
            autocompleteRef.current.value = ''
        }
    }

    return (
        <div className={`relative ${className}`}>
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <Input
                ref={autocompleteRef}
                className="pl-10 pr-10" // Adjust padding to account for icons
            />
            {autocompleteRef.current && autocompleteRef.current.value && (
                <XIcon
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={onClear}
                />
            )}
        </div>
    );

    });

export default GooglePlacesAutocomplete;
