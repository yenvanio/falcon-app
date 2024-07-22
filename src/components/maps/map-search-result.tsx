import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {MapPinIcon} from "@/components/ui/icons/map-pin-icon";
import {PhoneIcon} from "@/components/ui/icons/phone-icon";
import {LinkIcon} from "@/components/ui/icons/link-icon";
import {StarIcon} from "@/components/ui/icons/star-icon";
import {Button} from "@/components/ui/button";
import PhotoGallery from "@/components/maps/photo-gallery";
import React, {useEffect, useRef, useState} from "react";
import {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";

interface MapSearchResultProps {
    isLocationDrawerOpen: boolean
    onOpenChange: (open: boolean) => void
    onSubmitSuggestion: () => void
    searchLocation: GooglePlacesAutocompleteResult | null
}

export default function MapSearchResult({searchLocation, isLocationDrawerOpen, onOpenChange, onSubmitSuggestion}: MapSearchResultProps) {
    const [searchLocationMarkerPin, setSearchLocationMarkerPin] = useState<google.maps.Marker | null>(null)

    const drawerContentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (drawerContentRef.current) {
            drawerContentRef.current.setAttribute(
                'vaul-drawer-visible',
                isLocationDrawerOpen ? 'true' : 'false'
            );
        }
    }, [isLocationDrawerOpen, searchLocation]);

    return (
        <Drawer open={isLocationDrawerOpen} onOpenChange={onOpenChange} modal={false}>
            {searchLocation &&
                <DrawerContent
                    ref={drawerContentRef}
                    className="focus:outline-none"
                    onClose={() => {
                        onOpenChange(false)
                    }}>
                    <DrawerHeader>
                        <div className="grid grid-cols-5 items-start">
                            <div className="col-span-3 mt-2 space-y-4">
                                <DrawerTitle
                                    className="text-wrap">{searchLocation.name}</DrawerTitle>
                                <div className="flex items-center">
                                    {searchLocation.address && <>
                                        <MapPinIcon className="h-4 w-4"/>
                                        <DrawerDescription
                                            className="ml-2 text-wrap">{searchLocation.address}</DrawerDescription>
                                    </>}
                                </div>
                                <div className="flex items-center">
                                    {searchLocation.phone && <>
                                        <PhoneIcon className="h-4 w-4"/>
                                        <DrawerDescription
                                            className="ml-2">{searchLocation.phone}</DrawerDescription>
                                    </>}
                                </div>
                                <div className="flex items-center">
                                    {searchLocation.website && <>
                                        <LinkIcon className="h-4 w-4"/>
                                        <DrawerDescription
                                            className="ml-2">
                                            <a
                                                href={searchLocation.website}
                                                target="_blank">
                                                {searchLocation.website}
                                            </a>
                                        </DrawerDescription>
                                    </>}
                                </div>
                            </div>
                            <div className="grid col-span-2 gap-8 mt-2">
                                <div className="flex justify-end items-end mr-10">
                                    {searchLocation.rating && <>
                                        <StarIcon className="h-6 w-6 text-yellow-500 fill-yellow-500"/>
                                        <span className="ml-1 text-sm">{searchLocation.rating}</span></>}
                                </div>
                                <div className="flex justify-end items-end mr-10">
                                    <Button variant="outline" className="text-primary" onClick={onSubmitSuggestion}>
                                        Add to Map
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DrawerHeader>
                    <DrawerDescription>
                        <PhotoGallery photos={searchLocation.photos}/>
                    </DrawerDescription>
                </DrawerContent>
            }
        </Drawer>
    )
}