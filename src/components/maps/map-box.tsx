'use client'

import mapboxgl, {Marker} from 'mapbox-gl';
import { v4 as uuidv4 } from 'uuid';
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
    ({className, mapCenter, mapCenterLocationId,
         prevMapCenterLocationId, locations, ...props}, ref) => {
        const mapContainerRef = useRef<HTMLDivElement | null>(null);
        const mapRef = useRef<mapboxgl.Map | null>(null);
        const markersRef = useRef<mapboxgl.Marker[]>([]);

        const [sourceMarker, setSourceMarker] = useState<Marker>()
        const [sourceCoords, setSourceCoords] = useState<number[]>([])
        const [destinationMarkers, setDestinationMarkers] = React.useState<Marker[]>([])

        const [sourceId, setSourceId] = useState("airport-routes")
        const [layerId, setLayerId] = useState("routes")

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

        // Move to new Airport
        useEffect(() => {
            if (!mapContainerRef.current) return;
            if (mapCenter.title === '') return;

            sourceMarker?.remove();

            const marker = new mapboxgl.Marker(getSourceMarkerHTML())
                .setLngLat([mapCenter.longitude, mapCenter.latitude])
                .setPopup(new mapboxgl.Popup().setText(mapCenter.title))

            setSourceMarker(marker)
            setSourceCoords([mapCenter.longitude, mapCenter.latitude])

            marker.addTo(mapRef.current as mapboxgl.Map).togglePopup();
            mapRef.current?.flyTo({
                ...{
                    center: marker.getLngLat(),
                    zoom: 5,
                    bearing: 50,
                    pitch: 25
                }, // Fly to the selected target
                duration: 5000, // Animate over 5 seconds
                essential: true // This animation is considered essential with
                //respect to prefers-reduced-motion
            });
            mapRef.current?.resize()

        }, [mapCenter]);

        // Add new destinations
        useEffect(() => {
            // Add markers for each location
            let tmpMarkers: Marker[] = []
            markersRef.current = locations.map(location => {
                const marker = new mapboxgl.Marker(getDestinationMarkerHTML())
                    .setLngLat([location.longitude, location.latitude])
                    .setPopup(new mapboxgl.Popup().setText(location.title))
                tmpMarkers[location.id] = marker

                return marker.addTo(mapRef.current as mapboxgl.Map);
            });

            setDestinationMarkers(tmpMarkers)
        }, [locations]);

        // Draw Routes
        useEffect(() => {
            if (!sourceMarker || destinationMarkers.length === 0) return;

            // Generate feature collection directly using map
            const featureCollection: Feature<Geometry, GeoJsonProperties>[] = destinationMarkers.map((destination) => ({
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        sourceCoords,
                        destination.getLngLat().toArray(),
                    ]
                }
            }));

            // Remove Source/Layer if exists
            if (mapRef.current?.getLayer(layerId)) {
                mapRef.current?.removeLayer(layerId)
                mapRef.current?.removeSource(sourceId)
            }

            // Generate New IDs
            generateSourceAndLayerIDs()
            mapRef.current?.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: featureCollection,
                }
            });
            mapRef.current?.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                paint: {
                    'line-color': '#e68585',
                    'line-width': 1,
                }
            });

            // Cleanup function to remove source and layer on unmount
            return () => {
                if (mapRef.current?.getLayer(layerId)) {
                    mapRef.current.removeLayer(layerId);
                }
                if (mapRef.current?.getSource(sourceId)) {
                    mapRef.current.removeSource(sourceId);
                }
            };
        }, [sourceMarker, destinationMarkers]);

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

        // Clear Markers on new Airport Selection
        useEffect(() => {
            sourceMarker?.remove();
            destinationMarkers.forEach((marker) => marker.remove());
        }, [mapCenter]);

        const getSourceMarkerHTML = (): HTMLElement => {
            const html = document.createElement('div');
            html.className = 'circle-marker-source';
            html.style.height = '18px';
            html.style.width = '18px';
            html.style.borderColor = 'white';
            html.style.borderWidth = '2px';
            html.style.borderRadius = '50%';
            html.style.backgroundColor = '#4357ff';
            html.style.zIndex = '9';

            return html
        }

        const getDestinationMarkerHTML = (): HTMLElement => {
            const html = document.createElement('div');
            html.className = 'circle-marker destination';
            html.style.height = '18px';
            html.style.width = '18px';
            html.style.borderColor = 'white';
            html.style.borderWidth = '2px';
            html.style.borderRadius = '50%';
            html.style.backgroundColor = '#fdda38';

            return html
        }

        const generateSourceAndLayerIDs = () => {
            setSourceId(uuidv4())
            setLayerId(uuidv4())
        }

        return (
            <div ref={mapContainerRef} className={className}/>
        );
    })
