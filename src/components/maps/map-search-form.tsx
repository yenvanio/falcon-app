import {Form, FormField, FormItem} from "@/components/ui/form";
import GooglePlacesAutocomplete, {GooglePlacesAutocompleteResult} from "@/components/maps/places-autocomplete";
import React, {useEffect, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import MapSearchResult from "@/components/maps/map-search-result";
import {ItineraryProps} from "@/components/itinerary/types";
import {createClient} from "@/lib/supabase/client";
import {toast} from "@/components/ui/use-toast";

interface MapSearchFormProps {
    itinerary: ItineraryProps
    bounds: google.maps.LatLngBounds | null
    onSubmit: (location: GooglePlacesAutocompleteResult | null) => void
}

export default function MapSearchForm({itinerary, bounds, onSubmit}: MapSearchFormProps) {
    const supabase = createClient();

    const [isLocationDrawerOpen, setIsLocationDrawerOpen] = useState(false)
    const [searchLocation, setSearchLocation] = useState<GooglePlacesAutocompleteResult | null>(null)

    const formSchema = z.object({
        location: z.string(),
        location_lat: z.string(),
        location_lng: z.string(),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const handlePlaceSelect = (place: GooglePlacesAutocompleteResult) => {
        setIsLocationDrawerOpen(true)
        setSearchLocation(place)
    }

    const addSearchMarkerToMap = () => {
        if (searchLocation) {
            supabase.rpc('CreateLocation', {
                location_address: searchLocation.address,
                location_itinerary_id: itinerary.id,
                location_lat: searchLocation.latitude.toString(),
                location_lng: searchLocation.longitude.toString(),
                location_name: searchLocation.name,
                location_phone: searchLocation.phone ?? '',
                location_place_id: searchLocation.placeId,
                location_website: searchLocation.website ?? '',
            }).then((data: any, error: any) => {
                if (error) {
                    if (error?.code == "23505") {
                        toast({
                            title: "Oops",
                            description: "You've already added this to your map",
                        })
                        return
                    }

                    toast({
                        title: "Oh, no.",
                        description: "Something went wrong, please try again later.",
                    })
                    return
                }
            })
            setSearchLocation(null)
        }
    }

    useEffect(() => {
        if (!isLocationDrawerOpen) {
            setSearchLocation(null)
            form.reset()
        }
    }, [isLocationDrawerOpen]);

    useEffect(() => {
        onSubmit(searchLocation)
    }, [searchLocation]);

    return (
        <>
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
                                                                  'website',
                                                                  'place_id'
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
            <MapSearchResult searchLocation={searchLocation} isLocationDrawerOpen={isLocationDrawerOpen}
                             onOpenChange={setIsLocationDrawerOpen} onSubmitSuggestion={addSearchMarkerToMap}/>
        </>
    )
}