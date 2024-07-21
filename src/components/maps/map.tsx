'use client'

import {GoogleMap, MarkerF} from "@react-google-maps/api";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ItineraryProps} from "@/components/itinerary/types";

import GooglePlacesAutocomplete, {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem} from "@/components/ui/form";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {StarIcon} from "@/components/ui/icons/star-icon";
import PhotoGallery from "@/components/maps/photo-gallery";
import {MapPinIcon} from "@/components/ui/icons/map-pin-icon";
import {PhoneIcon} from "@/components/ui/icons/phone-icon";
import {LinkIcon} from "@/components/ui/icons/link-icon";
import {createClient} from "@/lib/supabase/client";
import {FalconLocation} from "@/components/maps/types";
import ItineraryCard from "@/components/itinerary/card";
import {parseISO} from "date-fns";

type MapProps = {
    itinerary: ItineraryProps
    initialLocations: Map<string, FalconLocation>
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

function getBounds(mapCenter: { lat: number, lng: number }, radius: number): google.maps.LatLngBounds | null {
    const centerLatLng = new google.maps.LatLng(mapCenter.lat, mapCenter.lng);
    const circle = new google.maps.Circle({center: centerLatLng, radius: radius});

    return circle.getBounds()
}

export default function MapComponent({initialLocations, itinerary}: MapProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const mapRef = useRef<GoogleMap>(null)
    const defaultMapCenter = {
        lat: parseFloat(itinerary.location.latitude),
        lng: parseFloat(itinerary.location.longitude),
    }
    const bounds = getBounds(defaultMapCenter, 100000)

    const supabase = createClient();

    const onLoad = useCallback((map: any) => setMap(map), []);

    const [isLocationDrawerOpen, setIsLocationDrawerOpen] = useState(false)
    const [searchLocationMarker, setSearchLocationMarker] = useState<GooglePlacesAutocompleteResult | null>(null)
    const [searchLocationMarkerPin, setSearchLocationMarkerPin] = useState<google.maps.Marker | null>(null)

    const [locations, setLocations] = useState(new Map(initialLocations))

    const formSchema = z.object({
        location: z.string(),
        location_lat: z.string(),
        location_lng: z.string(),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const drawerContentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (drawerContentRef.current) {
            drawerContentRef.current.setAttribute(
                'vaul-drawer-visible',
                isLocationDrawerOpen ? 'true' : 'false'
            );
        }
    }, [isLocationDrawerOpen, searchLocationMarker]);

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

    function addSearchMarkerToMap() {
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
            searchLocationMarkerPin?.setMap(null)
            setSearchLocationMarkerPin(null)
        }
    }

    useEffect(() => {
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'locations',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setLocations((prevLocations) => {
                        const updatedLocations = prevLocations;
                        const { id, name, address, latitude, longitude, phone, website } = payload.new;
                        const location: FalconLocation = {
                            id,
                            name,
                            address,
                            latitude: parseFloat(latitude),
                            longitude: parseFloat(longitude),
                            phone,
                            website
                        };
                        updatedLocations.set(location.id, location);

                        return updatedLocations;
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'locations',
                    filter: `itinerary_id=eq.${itinerary.id}`
                },
                (payload) => {
                    setLocations((prevLocations) => {
                        const updatedLocations = new Map(prevLocations);
                        const location = payload.old;
                        updatedLocations.delete(location.id);
                        return updatedLocations;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, itinerary]);

    return (
        <div className="relative w-full">
            <GoogleMap
                ref={mapRef}
                mapContainerStyle={defaultMapContainerStyle}
                center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
                onLoad={onLoad}>
                {Array.from(locations.entries()).map(([key, value]) => (
                    <MarkerF key={key} title={value.name} position={{lat: value.latitude, lng: value.longitude}} />
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
            <Drawer open={isLocationDrawerOpen} onOpenChange={setIsLocationDrawerOpen} modal={false}>
                {searchLocationMarker &&
                    <DrawerContent
                        ref={drawerContentRef}
                        className="focus:outline-none"
                        onClose={() => {
                            setIsLocationDrawerOpen(false)
                        }}>
                        <DrawerHeader>
                            <div className="grid grid-cols-5 items-start">
                                <div className="col-span-3 mt-2 space-y-4">
                                    <DrawerTitle
                                        className="text-wrap">{searchLocationMarker.name}</DrawerTitle>
                                    <div className="flex items-center">
                                        {searchLocationMarker.address && <>
                                            <MapPinIcon className="h-4 w-4"/>
                                            <DrawerDescription
                                                className="ml-2 text-wrap">{searchLocationMarker.address}</DrawerDescription>
                                        </>}
                                    </div>
                                    <div className="flex items-center">
                                        {searchLocationMarker.phone && <>
                                            <PhoneIcon className="h-4 w-4"/>
                                            <DrawerDescription
                                                className="ml-2">{searchLocationMarker.phone}</DrawerDescription>
                                        </>}
                                    </div>
                                    <div className="flex items-center">
                                        {searchLocationMarker.website && <>
                                            <LinkIcon className="h-4 w-4"/>
                                            <DrawerDescription
                                                className="ml-2">
                                                <a
                                                    href={searchLocationMarker.website}
                                                    target="_blank">
                                                    {searchLocationMarker.website}
                                                </a>
                                            </DrawerDescription>
                                        </>}
                                    </div>
                                </div>
                                <div className="grid col-span-2 gap-8 mt-2">
                                    <div className="flex justify-end items-end mr-10">
                                        {searchLocationMarker.rating && <>
                                            <StarIcon className="h-6 w-6 text-yellow-500 fill-yellow-500"/>
                                            <span className="ml-1 text-sm">{searchLocationMarker.rating}</span></>}
                                    </div>
                                    <div className="flex justify-end items-end mr-10">
                                        <Button variant="outline" className="text-primary" onClick={addSearchMarkerToMap}>
                                            Add to Map
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </DrawerHeader>
                        <DrawerDescription>
                            <PhotoGallery photos={searchLocationMarker.photos}/>
                        </DrawerDescription>
                    </DrawerContent>
                }
            </Drawer>
        </div>
    )
};

export {MapComponent};