import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {MapPinIcon} from "@/components/ui/icons/map-pin-icon";
import {PhoneIcon} from "@/components/ui/icons/phone-icon";
import {LinkIcon} from "@/components/ui/icons/link-icon";
import {StarIcon} from "@/components/ui/icons/star-icon";
import {Button} from "@/components/ui/button";
import PhotoGallery from "@/components/maps/photo-gallery";
import React, {useEffect, useRef, useState} from "react";
import {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";

interface PlaceSuggestionProps {
    isLocationDrawerOpen: boolean
    onOpenChange: (open: boolean) => void
    onSubmitSuggestion: () => void
    searchLocationMarker: GooglePlacesAutocompleteResult | null
}

export default function PlaceSuggestion({searchLocationMarker, isLocationDrawerOpen, onOpenChange, onSubmitSuggestion}: PlaceSuggestionProps) {
    const [searchLocationMarkerPin, setSearchLocationMarkerPin] = useState<google.maps.Marker | null>(null)

    const drawerContentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (drawerContentRef.current) {
            drawerContentRef.current.setAttribute(
                'vaul-drawer-visible',
                isLocationDrawerOpen ? 'true' : 'false'
            );
        }
    }, [isLocationDrawerOpen, searchLocationMarker]);

    return (
        <Drawer open={isLocationDrawerOpen} onOpenChange={onOpenChange} modal={false}>
            {searchLocationMarker &&
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
                                    <Button variant="outline" className="text-primary" onClick={onSubmitSuggestion}>
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
    )
}