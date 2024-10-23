'use client'

import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import {MapProps} from "@/components/maps/map";
import React, {useEffect, useRef} from "react";
import {MapSearchInput} from "@/components/maps/map-search-input";

export default function MapBox({itinerary, locations}: MapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const defaultMapCenter = {
        lat: parseFloat(itinerary.location.latitude),
        lng: parseFloat(itinerary.location.longitude),
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v9',
            zoom: 7,
            center: defaultMapCenter
        });
    }, []);

    const search = () => {
        // Implement search functionality
    };

    const select = () => {
        // Implement select functionality
    };

    return (
        <React.Fragment>
            {/*<MapSearchInput className="" onSearch={search} onSelect={select}/>*/}
            <div ref={mapContainerRef} className="min-h-[100dvh]"/>
        </React.Fragment>
    );
}
