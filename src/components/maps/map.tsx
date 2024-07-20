'use client'

import {GoogleMap} from "@react-google-maps/api";
import React, {useEffect, useRef, useState} from "react";
import {ItineraryProps} from "@/components/itinerary/types";

import GooglePlacesAutocomplete, {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem} from "@/components/ui/form";
import {
    Drawer,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {StarIcon} from "@/components/ui/icons/star-icon";
import PhotoGallery from "@/components/maps/photo-gallery";
import {MapPinIcon} from "@/components/ui/icons/map-pin-icon";
import {PhoneIcon} from "@/components/ui/icons/phone-icon";
import {LinkIcon} from "@/components/ui/icons/link-icon";

type MapProps = {
    itinerary: ItineraryProps
}

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

function getBounds(mapCenter: { lat: number, lng: number }, radius: number): google.maps.LatLngBounds | null {
    const centerLatLng = new google.maps.LatLng(mapCenter.lat, mapCenter.lng);
    const circle = new google.maps.Circle({center: centerLatLng, radius: radius});

    return circle.getBounds()
}

export default function MapComponent({itinerary}: MapProps) {
    const mapRef = useRef<GoogleMap>(null)
    const defaultMapCenter = {
        lat: parseFloat(itinerary.location.latitude),
        lng: parseFloat(itinerary.location.longitude),
    }
    const bounds = getBounds(defaultMapCenter, 100000)

    const [isLocationDrawerOpen, setIsLocationDrawerOpen] = useState(false)
    const [searchLocationMarker, setSearchLocationMarker] = useState<GooglePlacesAutocompleteResult | null>(null)

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
                        }}
                        onInteractOutside={(e) => {
                            e.preventDefault();
                        }}>
                        <DrawerHeader>
                            <div className="grid grid-cols-5 items-start">
                                <div className="col-span-3">
                                    <DrawerTitle>{searchLocationMarker.name}</DrawerTitle>
                                    <div className="grid grid-rows-3 gap-4 mt-2">
                                        <div className="flex items-center">
                                            {searchLocationMarker.address && <>
                                                <MapPinIcon className="h-4 w-4"/>
                                                <DrawerDescription
                                                    className="ml-2">{searchLocationMarker.address}
                                                </DrawerDescription>
                                            </>}
                                        </div>
                                        <div className="flex items-center">
                                            {searchLocationMarker.phone && <>
                                                <PhoneIcon className="h-4 w-4"/>
                                                <DrawerDescription
                                                    className="ml-2">{searchLocationMarker.phone}
                                                </DrawerDescription>
                                            </>}
                                        </div>
                                        <div className="flex items-center">
                                            {searchLocationMarker.website && <>
                                            <LinkIcon className="h-4 w-4"/>
                                            <DrawerDescription
                                                className="ml-2">{searchLocationMarker.website}
                                            </DrawerDescription>
                                        </>}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="grid grid-rows-2 gap-4 mt-2">
                                        <div className="flex justify-end items-end mr-10">
                                            {searchLocationMarker.rating && <>
                                                <StarIcon className="h-6 w-6 text-yellow-500 fill-yellow-500"/>
                                                <span className="ml-1 text-sm">{searchLocationMarker.rating}</span></>}
                                        </div>
                                        <div className="flex justify-end items-end mr-10">
                                            <Button variant="outline" className="text-primary">
                                                Add to Map
                                            </Button>
                                        </div>
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