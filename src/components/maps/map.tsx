"use client"

import {GoogleMap, MarkerF} from "@react-google-maps/api";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ItineraryProps} from "@/components/itinerary/types";
import {FalconLocation} from "@/components/maps/types";
import {Form, FormField, FormItem} from "@/components/ui/form";
import GooglePlacesAutocomplete, {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {GetBounds} from "@/components/maps/helper";
import PlaceSuggestion from "@/components/maps/place-suggestion";
import {createClient} from "@/lib/supabase/client";

type MapProps = {
    itinerary: ItineraryProps
    locations: Map<string, FalconLocation>
}

export const defaultMapContainerStyle = {
    width: '100%',
    height: '100vh',
};

const defaultMapZoom = 8
const markerMapZoom = 12
const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'roadmap',
};

export default function MapComponent({itinerary, locations}: MapProps) {
    const supabase = createClient();

    // Map
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const mapRef = useRef<GoogleMap>(null)
    const onLoad = useCallback((map: any) => setMap(map), []);
    const defaultMapCenter = {
        lat: parseFloat(itinerary.location.latitude),
        lng: parseFloat(itinerary.location.longitude),
    }
    const bounds = GetBounds(defaultMapCenter, 100000)

    // Map Search Form
    const formSchema = z.object({
        location: z.string(),
        location_lat: z.string(),
        location_lng: z.string(),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    // Map Suggestion
    const [isLocationDrawerOpen, setIsLocationDrawerOpen] = useState(false)
    const [searchLocationMarker, setSearchLocationMarker] = useState<GooglePlacesAutocompleteResult | null>(null)

    const handlePlaceSelect = (place: GooglePlacesAutocompleteResult) => {
        setIsLocationDrawerOpen(true)
        setSearchLocationMarker(place)
    }

    useEffect(() => {
        if (map && searchLocationMarker) {
            const position = {
                lat: searchLocationMarker.latitude!,
                lng: searchLocationMarker.longitude!
            }

            // setSearchLocationMarkerPin()
            // searchLocationMarkerPin?.setMap(map)

            new google.maps.Marker({
                map: map,
                position: position,
                title: searchLocationMarker.name
            })

            map.panTo(position)
            map.setZoom(markerMapZoom)
        }
    }, [searchLocationMarker]);

    const addSearchMarkerToMap = () => {
        if (map && searchLocationMarker) {
            map.setZoom(defaultMapZoom)

            let {data, error} = supabase
                .rpc('CreateLocation', {
                    location_address: searchLocationMarker.address,
                    location_itinerary_id: itinerary.id,
                    location_lat: searchLocationMarker.latitude.toString(),
                    location_lng: searchLocationMarker.longitude.toString(),
                    location_name: searchLocationMarker.name,
                    location_phone: searchLocationMarker.phone ?? '',
                    location_website: searchLocationMarker.website ?? ''
                }).then(() => {
                    if (error) console.error(error)
                    else console.log(data)
                })

            setSearchLocationMarker(null)
            // searchLocationMarkerPin?.setMap(null)
            // setSearchLocationMarkerPin(null)
        }
    }

    return (
        <React.Fragment>
            <GoogleMap
                ref={mapRef}
                mapContainerStyle={defaultMapContainerStyle}
                center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
                onLoad={onLoad}>
                {Array.from(locations.entries()).map(([key, value]) => (
                    <MarkerF key={key} title={value.name} position={{lat: value.latitude, lng: value.longitude}}/>
                ))}
            </GoogleMap>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-5/6">
                <div className="relative">
                    <Form {...form}>
                        <FormField
                            control={form.control}
                            name="location"
                            render={({field}) => (
                                <FormItem>
                                    <GooglePlacesAutocomplete {...field}
                                                              className=""
                                                              autocompleteTypes={[]}
                                                              autocompleteFields={[
                                                                  'name',
                                                                  'formatted_address',
                                                                  'address_components',
                                                                  'formatted_phone_number',
                                                                  'geometry',
                                                                  'photos',
                                                                  'rating',
                                                                  'website'
                                                              ]}
                                                              bounds={bounds}
                                                              country={itinerary.location.country}
                                                              continent={itinerary.location.continent}
                                                              onComplete={handlePlaceSelect}/>
                                </FormItem>
                            )}/>
                    </Form>
                </div>
            </div>
            <PlaceSuggestion searchLocationMarker={searchLocationMarker} isLocationDrawerOpen={isLocationDrawerOpen} onOpenChange={setIsLocationDrawerOpen} onSubmitSuggestion={addSearchMarkerToMap}/>
        </React.Fragment>
    )
}