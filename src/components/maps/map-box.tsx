'use client'

import mapboxgl, {Marker} from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import React, {useEffect, useRef, useState} from "react";
import {Feature, GeoJsonProperties, Geometry} from "geojson";

export interface LocationProps {
    id: number
    title: string
    iata_code: string
    city: string
    country: string
    latitude: number
    longitude: number
}
export interface MapBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    locations: LocationProps[];
    mapCenter: {
        latitude: number;
        longitude: number;
        title: string;
    };
    mapCenterLocationId: number
    prevMapCenterLocationId: number
}

export const MapBox = React.forwardRef<HTMLDivElement, MapBoxProps>(
    ({className, mapCenter, mapCenterLocationId, prevMapCenterLocationId, locations, ...props}, ref) => {
        const mapContainerRef = useRef<HTMLDivElement | null>(null);
        const mapRef = useRef<mapboxgl.Map | null>(null);
        const markersRef = useRef<mapboxgl.Marker[]>([]);

        const [sourceMarker, setSourceMarker] = useState<Marker>()
        const [destinationMarkers, setDestinationMarkers] = React.useState<Marker[]>([])

        // Load Map
        useEffect(() => {
            if (!mapContainerRef.current) return;

            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                zoom: 1.5,
                projection: 'globe',
                center: {
                    lat: mapCenter.latitude,
                    lng: mapCenter.longitude,
                }
            });

            mapRef.current.addControl(new mapboxgl.NavigationControl());

            // Ensure the map resizes properly after rendering
            mapRef.current.on('load', () => {
                mapRef.current?.resize();
            });

            // Cleanup map instance on unmount
            return () => {
                mapRef.current?.remove();
            };

        }, []);

        // Move to new source Airport and Destinations
        useEffect(() => {
            if (!mapContainerRef.current) return;
            if (mapCenter.title === '') return;

            removePreviousMarkers()

            const sourceMarkerHTML = document.createElement('div');
            sourceMarkerHTML.className = 'circle-marker-source';
            sourceMarkerHTML.style.height = '18px';
            sourceMarkerHTML.style.width = '18px';
            sourceMarkerHTML.style.borderColor = 'white';
            sourceMarkerHTML.style.borderWidth = '2px';
            sourceMarkerHTML.style.borderRadius = '50%';
            sourceMarkerHTML.style.backgroundColor = '#4357ff';
            sourceMarkerHTML.style.zIndex = '9';

            const sMarker = new mapboxgl.Marker(sourceMarkerHTML)
                .setLngLat([mapCenter.longitude, mapCenter.latitude])
                .setPopup(new mapboxgl.Popup().setText(mapCenter.title))

            setSourceMarker(sMarker)

            sMarker.addTo(mapRef.current as mapboxgl.Map).togglePopup();
            mapRef.current?.flyTo({
                ...{
                    center: sMarker.getLngLat(),
                    zoom: 5,
                    bearing: 50,
                    pitch: 25
                }, // Fly to the selected target
                duration: 5000, // Animate over 5 seconds
                essential: true // This animation is considered essential with
                //respect to prefers-reduced-motion
            });
            mapRef.current?.resize()

            // Add markers for each location
            markersRef.current = locations.map(location => {
                const destinationMarkerHTML = document.createElement('div');
                destinationMarkerHTML.className = 'circle-marker destination';
                destinationMarkerHTML.style.height = '18px';
                destinationMarkerHTML.style.width = '18px';
                destinationMarkerHTML.style.borderColor = 'white';
                destinationMarkerHTML.style.borderWidth = '2px';
                destinationMarkerHTML.style.borderRadius = '50%';
                destinationMarkerHTML.style.backgroundColor = '#fdda38';

                const marker = new mapboxgl.Marker(destinationMarkerHTML)
                    .setLngLat([location.longitude, location.latitude])
                    .setPopup(new mapboxgl.Popup().setText(location.title))

                destinationMarkers.push(marker)

                return marker.addTo(mapRef.current as mapboxgl.Map);
            });
            const featureCollection: Feature<Geometry, GeoJsonProperties>[] = []

            destinationMarkers.map((destination) => {
                featureCollection.push({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            sMarker.getLngLat().toArray(),
                            destination.getLngLat().toArray(),
                        ]
                    },
                })
            })
            mapRef.current?.addSource('airport-routes', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: featureCollection,
                }
            })
            mapRef.current?.addLayer({
                "id": `routes`,
                "type": "line",
                "source": "airport-routes",
                "paint": {
                    "line-color": "#e68585",
                    "line-width": 1,
                }
            });
        }, [mapCenter, locations]);

        // Move to new focus point destination
        useEffect(() => {
            if (mapCenterLocationId < 0) return;
            const prevDestination = destinationMarkers[prevMapCenterLocationId]
            const nextDestination = destinationMarkers[mapCenterLocationId]

            if (prevMapCenterLocationId >= 0) prevDestination.togglePopup()

            mapRef.current?.flyTo({
                ...{
                    center: nextDestination.getLngLat(),
                    zoom: 5,
                    bearing: 50,
                    pitch: 25
                }, // Fly to the selected target
                duration: 5000, // Animate over 5 seconds
                essential: true // This animation is considered essential with
                //respect to prefers-reduced-motion
            });
            mapRef.current?.resize()
            nextDestination.togglePopup()
        }, [mapCenterLocationId])

        const removePreviousMarkers = () => {
            sourceMarker?.remove()
            destinationMarkers.forEach((marker) => marker.remove())
            if (mapRef.current?.getLayer('routes')) {
                mapRef.current?.removeLayer('routes');
                mapRef.current?.removeSource('airport-routes');
            }
        }

        return (
            <div ref={mapContainerRef} className={className}/>
        );
    })
