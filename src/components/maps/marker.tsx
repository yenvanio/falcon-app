import React, {useState} from 'react'
import {InfoWindowF, MarkerF} from "@react-google-maps/api";
import {FalconLocation} from "@/components/maps/types";
import {Card} from "@/components/ui/card";

type FalconMarkerProps = {
    id: string
    location: FalconLocation
    isSearch: boolean
}

export default function FalconMarker({id, location, isSearch}: FalconMarkerProps) {
    const [showTooltip, setShowTooltip] = useState(false)

    const handleMouseOver = () => {
        setShowTooltip(true)
    };

    const handleMouseExit = () => {
        setShowTooltip(false)
    };

    return (
        <MarkerF
            key={id}
            position={{lat: location.latitude, lng: location.longitude}}
            clickable={true}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseExit}
            icon={{
                url: isSearch ? "/map-search-pin.svg" : "/map-pin.svg",
                scale: 2
            }}
            children={
                showTooltip && (
                    <InfoWindowF position={{lat: location.latitude, lng: location.longitude}}>
                        <Card className="p-2">
                            {location.name}
                        </Card>
                    </InfoWindowF>
                )
            }>
        </MarkerF>
    );
}